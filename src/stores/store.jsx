import config from "../config";
import async from 'async';
import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
  UPDATE,
  UPDATE_RETURNED,
  GET_CONTRACT_EVENTS,
  GET_CONTRACT_EVENTS_RETURNED,
  REWARD,
  REWARD_RETURNED
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

const rp = require('request-promise');
const ethers = require('ethers');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      universalGasPrice: '70',
      ethPrice: 0,
      assets: [
        {
          id: 'kGeyser1',
          name: 'AMPL/ETH',
          symbol: 'kMPL',
          description: 'Provide AMPL/ETH liquidity to earn kMPL',
          investSymbol: 'AMPL/ETH',
          uFragmentAddress: '0x9a1Beed6fE647a89f015BFdbE542A910165C4D8c',
          geyserContract: '0x0A9D9DE2feAB9DEB0394c60612cB1e49bd8Fb588',
          investTokenContract: '0x9a1Beed6fE647a89f015BFdbE542A910165C4D8c',
          rewardTokenContract: '0x21c64c1f20569aAd654488D0eA399B70E0ADcb36',
          decimals: 9,
          geyserContractABI: config.GeyserABI,
          investTokenBalance: 0,
          stakedTokenBalance: 0,
          totalStakedTokenBalance: 0,
          rewardTokenBalance: 0,
          unlockedTokens : 0,
          bonusValue: 0,
          rebaseBonusValue: 0,
          needRebase : false,
          positiveBonus : 0,
          negativeBonus : 0,
          totalReward : 0,
          nextReward : 0
        },
        {
          id: 'kGeyser2',
          name: 'kMPL/ETH',
          symbol: 'kMPL',
          description: 'Provide kMPL/ETH liquidity to earn kMPL',
          investSymbol: 'kMPL/ETH',
          uFragmentAddress: '0x9a1Beed6fE647a89f015BFdbE542A910165C4D8c',
          geyserContract: '0x98Eb3C667F4e18bFB1c6A3b290F057f8d0C503C3',
          investTokenContract: '0x9a1Beed6fE647a89f015BFdbE542A910165C4D8c',
          rewardTokenContract: '0x21c64c1f20569aAd654488D0eA399B70E0ADcb36',
          decimals: 9,
          geyserContractABI: config.GeyserABI,
          investTokenBalance: 0,
          stakedTokenBalance: 0,
          totalStakedTokenBalance: 0,
          rewardTokenBalance: 0,
          unlockedTokens : 0,
          bonusValue: 0,
          rebaseBonusValue: 0,
          needRebase : false,
          positiveBonus : 0,
          negativeBonus : 0,
          totalReward : 0,
          nextReward : 0
        }
      ],
      account: {},
      web3: null,
      pricePerFullShare: 0,
      uniswapYields: [],
      uniswapLiquidity: [],
      events: [],
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      builtWith: [
        {
          website: 'https://www.ethereum.org',
          logo: 'ethereum.png',
          name: 'ethereum'
        },
        {
          website: 'https://trufflesuite.com',
          logo: 'truffle.png',
          name: 'Truffle Suite'
        },
        {
          website: 'https://etherscan.io',
          logo: 'etherscan.png',
          name: 'Etherscan'
        }
      ],
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      ethBalance: 0,
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case INVEST:
            this.invest(payload)
            break;
          case UPDATE:
            this.update(payload)
            break;
          case REWARD:
            this.reward(payload)
            break;
          case REDEEM:
            this.redeem(payload)
            break;
          case GET_CONTRACT_EVENTS:
            this.getContractEvents(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  invest = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._checkApproval(asset, account, amount, asset.geyserContract, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callInvest(asset, account, amount, (err, investResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(INVEST_RETURNED, investResult)
      })
    })
  }

  update = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callUpdateAccounting(asset, account, (err, result) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }
      return emitter.emit(UPDATE_RETURNED, result)
    })
  }

  reward = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callReward(asset, account, (err, result) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }
      return emitter.emit(REWARD_RETURNED, result)
    })
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.investTokenContract)
    try {
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        /*
          code to accomodate for "assert _value == 0 or self.allowances[msg.sender][_spender] == 0" in contract
          We check to see if the allowance is > 0. If > 0 set to 0 before we set it to the correct amount.
        */
        if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3', 'USDT', 'sCRV'].includes(asset.id) && ethAllowance > 0) {
          await erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        }

        await erc20Contract.methods.approve(contract, web3.utils.toWei('999999999999', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3', 'sCRV'].includes(asset.id) && ethAllowance > 0) {
        erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', async function(hash){
            erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
              .on('transactionHash', function(hash){
                callback()
              })
              .on('error', function(error) {
                if (!error.toString().includes("-32601")) {
                  if(error.message) {
                    return callback(error.message)
                  }
                  callback(error)
                }
              })
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } else {
      callback()
    }
  }

  _callInvest = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    var amountToSend = amount*10**asset.decimals;
    geyserContract.methods.stake(amountToSend,"0x").send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  redeem = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callRedeem(asset, account, amount, (err, redeemResult) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }
      return emitter.emit(REDEEM_RETURNED, redeemResult)
    })
  }

  _callRedeem = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)

    var amountSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountSend = amount*10**asset.decimals;
    }

    geyserContract.methods.unstakeQuery(amountSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      console.log(hash)
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber, receipt);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
    })
    .on('error', function(error) {
      console.log(error);
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  _callUpdateAccounting = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)

    
    geyserContract.methods.updateAccounting().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      console.log(hash)
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber, receipt);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
    })
    .on('error', function(error) {
      console.log(error);
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  _callReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)

    
    geyserContract.methods.rewardRebase().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      console.log(hash)
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber, receipt);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
    })
    .on('error', function(error) {
      console.log(error);
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  getBalances = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')

    if(!account || !account.address) {
      return false
    }

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(assets, (asset, callback) => {
      console.log("requesting",asset)
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getInvestedBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getTotalStaked(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getUnlockedTokens(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getLastTotalSupply(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getRebaseData(web3, asset, account, callbackInner) }
      ], (err, data) => {
        asset.investTokenBalance = data[0]
        asset.stakedTokenBalance = data[1]
        asset.totalStakedTokenBalance = data[2]
        asset.unlockedTokens = data[3]
        asset.rewardTokenBalance = asset.stakedTokenBalance / asset.totalStakedTokenBalance * asset.unlockedTokens;
        asset.needRebase = data[4].recorded !== data[4].current;
        asset.positiveBonus = data[5].positiveBonus;
        asset.negativeBonus = data[5].negativeBonus;
        asset.totalReward = data[5].totalReward;
        asset.nextReward = (data[4].recorded > data[4].current?asset.positiveBonus / 1000 * asset.totalReward : asset.negativeBonus / 1000 * asset.totalReward) / 10**asset.decimals;
        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ assets: assets })
      return emitter.emit(BALANCES_RETURNED, assets)
    })
  }

  _getERC20Balance = async (web3, asset, account, callback) => {

    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.investTokenContract)

      try {
        var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
        balance = parseFloat(balance)/10**asset.decimals
        callback(null, parseFloat(balance))
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
  }

  _getTotalStaked = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, 0)
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    try {
      var  balance = await geyserContract.methods.totalStaked().call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  _getUnlockedTokens = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, 0)
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    try {
      var  balance = await geyserContract.methods.totalUnlocked().call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  _getLastTotalSupply = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, 0)
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    let fragmentContract = new web3.eth.Contract(config.erc20ABI, asset.uFragmentAddress)
    try {
      //get the total supply saved in the geyser contract
      var  totalSupplyRecorded = await geyserContract.methods.lastAMPLTotalSupply().call({ from: account.address });
      // and the current real total supply
      var  totalSupplyCurrent = await fragmentContract.methods.totalSupply().call({ from: account.address });
      callback(null, {recorded : totalSupplyRecorded, current : totalSupplyCurrent})
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  _getRebaseData = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, 0)
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    
    try {
      var  positive = await geyserContract.methods.bonusPositiveRebase().call({ from: account.address });
      var  negative = await geyserContract.methods.bonusNegativeRebase().call({ from: account.address });
      var totalReward = await geyserContract.methods.totalRewardTokens().call({ from: account.address });
      callback(null, {positiveBonus : positive, negativeBonus : negative, totalReward : totalReward})
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  _getInvestedBalance = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, 0)
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    var  balance = await geyserContract.methods.totalStakedFor(account.address).call({ from: account.address });
    balance = parseFloat(balance)/10**asset.decimals
    callback(null, parseFloat(balance))
  }

  getContractEvents = (payload) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let geyserContract = new web3.eth.Contract(config.uFragmentABI, config.geyserContract)

    geyserContract.getPastEvents('allEvents', { fromBlock: 1, toBlock: 'latest' })
      .then((res) => {

        const sorted = res.sort((a, b) => {
          return parseFloat(a.blockNumber) - parseFloat(b.blockNumber)
        }).filter((tx) => {
          if(tx.event !== 'Transfer') {
            return false
          }

          if(!tx.returnValues.value || tx.returnValues.value === 0) {
            return false
          }

          if(tx.returnValues.from !== '0x0000000000000000000000000000000000000000') {
            return false
          }

          return true
        }).map(async (tx) => {
          const rawTx = await this._getTransaction(web3, tx.transactionHash)

          return {
            blockNumber: tx.blockNumber,
            transactionHash: tx.transactionHash,
            eth: web3.utils.fromWei(rawTx.value, 'ether'),
            iEth: web3.utils.fromWei(tx.returnValues.value, 'ether'),
            ethRatio: tx.returnValues.value*100/rawTx.value,
            address: rawTx.from
          }
        })

        Promise.all(sorted).then(async (transactions) => {
          const pricePerFullShare = await this._getPricePerFullShare(web3, geyserContract)

          const trxs = transactions.map(async (tx) => {
            //console.log(tx.address)
            const balance = await this._getIEthBalance(web3, geyserContract, tx.address)

            tx.ethRedeem = (parseFloat(pricePerFullShare)*parseFloat(balance))
            tx.growth = (parseFloat(tx.ethRedeem)*100/parseFloat(tx.eth))
            return tx
          })

          Promise.all(trxs).then(async (txs) => {
            store.setStore({ events: txs })
            return emitter.emit(GET_CONTRACT_EVENTS_RETURNED, txs)
          })
        })
      })
  }

  _getTransaction = async (web3, hash) => {
    const rawTx = await web3.eth.getTransaction(hash)
    return rawTx
  }

  _getPricePerFullShare = async (web3, geyserContract) => {
    const balance = web3.utils.fromWei(await geyserContract.methods.getPricePerFullShare().call({ }), 'ether');
    return balance
  }

  _getIEthBalance = async (web3, geyserContract, address) => {
    const balance = web3.utils.fromWei(await geyserContract.methods.balanceOf(address).call({ }), 'ether');
    return balance
  }

  _approveToken = async (token, spender, amount, account, web3) => {
    // First 4 bytes of the hash of "fee()" for the sighash selector
    let funcHash = ethers.utils.hexDataSlice(ethers.utils.id('approve(address,uint256)'), 0, 4);

    let abi = new ethers.utils.AbiCoder();
    let inputs = [{
      name: 'spender',
      type: 'address'
    }, {
      name: 'amount',
      type: 'uint256'
    }];

    let params = [spender, amount];
    let bytes = abi.encode(inputs, params).substr(2);

    // construct approval data from function hash and parameters
    let inputData = `${funcHash}${bytes}`;

    // let nonce = await infuraProvider.getTransactionCount(ethersWallet.address);
    let nonce = await web3.eth.getTransactionCount(account.address)

    // You will want to get the real gas price from https://ethgasstation.info/json/ethgasAPI.json
    let gasPrice = web3.utils.toWei(await this._getGasPrice(), 'gwei');

    let transaction = {
      to: token,
      nonce: nonce,
      gasLimit: 500000, // You will want to use estimateGas instead for real apps
      gasPrice: gasPrice,
      data: inputData,
      from: account.address
    }

    // let tx = await ethersWallet.sendTransaction(transaction);
    let tx = await web3.eth.sendTransaction(transaction)
    console.log(tx);
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    try {
      if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3', 'USDT'].includes(asset.id)) {
        const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })
        const ethAllowance = web3.utils.fromWei(allowance, "ether")
        if(ethAllowance > 0) {
          erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
            .on('transactionHash', function(hash){
              //success...
            })
            .on('error', function(error) {
              if (!error.toString().includes("-32601")) {
                if(error.message) {
                  return callback(error.message)
                }
                callback(error)
              }
            })
        }
      }

      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }

  _getWeb3Provider = async () => {
    const web3context = store.getStore('web3context')
    if(!web3context) {
      return null
    }
    const provider = web3context.library.provider
    if(!provider) {
      return null
    }

    const web3 = new Web3(provider);

    // const web3 = createAlchemyWeb3(config.infuraProvider, { writeProvider: provider });

    return web3
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
