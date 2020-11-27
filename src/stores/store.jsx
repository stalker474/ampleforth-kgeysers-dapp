import config from "../config";
import async from 'async';
import humanizeDuration from 'humanize-duration'

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
      statistics: [],
      universalGasPrice: '70',
      ethPrice: 0,
      assets: [
        {
          id: 'kGeyser1',
          name: 'AMPL/ETH',
          symbol: 'AMPL-ETH-Uni-V2',
          rewardSymbol : 'kMPL',
          description: 'Uniswap V2 AMPL/ETH',
          investSymbol: 'AMPL/ETH',
          uFragmentAddress: '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
          geyserContract: '0x9665683d3c4a7F8Bb89d367dbB708dd4F70F2cEa',
          liquidityTokenAddress : '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
          token1Address : '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
          token2Address : '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          rewardTokenContract: '0xc463f34040ad6222C1fFB03ACEbDFAAC032202d6',  
          token1Decimals : 9,
          geyserContractABI: config.GeyserABI,
          investTokenBalance: 0,
          totalStakedFor: 0,
          totalStaked: 0,
          rewardTokenBalance: 0,
          unlockedTokens : 0.0,
          lockedTokens : 0.0,
          bonusValue: 0,
          rebaseBonusValue: 0,
          needRebase : false,
          positiveBonus : 0,
          negativeBonus : 0,
          totalRewardTokens : 0.0,
          nextReward : 0,
          rebaseRewardLeft : 0.0,
          programDuration : 0,
          roi : 0.0,
          apy : 0.0,
          duration : 90.0,
          end : 1614811689000
        },
        {
          id: 'kGeyser2',
          name: 'kMPL/AMPL',
          symbol: 'kMPL-AMPL-Uni-V2',
          rewardSymbol : 'kMPL',
          description: 'Uniswap V2 kMPL/AMPL',
          investSymbol: 'kMPL/AMPL',
          uFragmentAddress: '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
          geyserContract: '0x495074B57f8f7Fd1309932f8AA1F9BAFf1DefF4F',
          liquidityTokenAddress : '0x53b784d0fb88f53c6af76839a7eaec8e95729375',
          token1Address : '0xc463f34040ad6222C1fFB03ACEbDFAAC032202d6',
          token2Address : '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
          rewardTokenContract: '0xc463f34040ad6222C1fFB03ACEbDFAAC032202d6',  
          token1Decimals : 9,
          geyserContractABI: config.GeyserABI,
          investTokenBalance: 0,
          totalStakedFor: 0,
          totalStaked: 0,
          rewardTokenBalance: 0,
          unlockedTokens : 0.0,
          lockedTokens : 0.0,
          bonusValue: 0,
          rebaseBonusValue: 0,
          needRebase : false,
          positiveBonus : 0,
          negativeBonus : 0,
          totalRewardTokens : 0.0,
          nextReward : 0,
          rebaseRewardLeft : 0.0,
          programDuration : 0,
          roi : 0.0,
          apy : 0.0,
          duration : 120.0,
          end : 1615157624000
        }
      ],
      account: {},
      web3: null,
      networkID : null,
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
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.liquidityTokenAddress)
    try {
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      let ethAllowance = web3.utils.fromWei(allowance, "ether")
      var amountToSend = web3.utils.toWei('999999999', "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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
    } else {
      callback()
    }
  }

  _callInvest = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    
    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    var amountToSend = web3.utils.toWei(amount, "ether")
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
      async.parallel([
        (callbackInner) => { this._getStakingTokenBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getUserBalances(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getGlobalStats(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getRebaseData(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getMultiplierBonusAndReward(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getTokenPrices(web3, asset, account, callbackInner) }
        
      ], (err, data) => {
        asset.investTokenBalance = data[0]
        asset.totalStakedFor = data[1].totalStakedFor
        asset.totalStaked = data[2].totalStaked
        asset.unlockedTokens = data[2].totalUnlocked
        asset.lockedTokens = data[2].totalLocked
        asset.needRebase = data[2].recorded !== data[2].current;
        asset.rebaseRewardLeft = data[2].rebaseRewardLeft;
        asset.programDuration = humanizeDuration(data[2].duration * 1000)
        asset.positiveBonus = data[3].positiveBonus;
        asset.negativeBonus = data[3].negativeBonus;
        asset.totalRewardTokens = data[3].totalReward;
        if(data[2].current > data[2].recorded) {
          asset.nextReward = asset.positiveBonus / 1000 * asset.totalRewardTokens / 10**asset.token1Decimals
        } else if(data[2].current < data[2].recorded) {
          asset.nextReward = asset.negativeBonus / 1000 * asset.totalRewardTokens / 10**asset.token1Decimals
        } else {
          asset.nextReward = 0.0
        }
        asset.bonusValue = data[4].bonus
        asset.rewardTokenBalance = data[4].reward
        let totalRewardedTokensValue = asset.unlockedTokens * data[5].rewardTokenPrice
        let dailyRewardedTokensValue = (asset.lockedTokens + asset.unlockedTokens) / asset.duration * data[5].rewardTokenPrice
        let totalInvestedTokensValue = asset.totalStaked * data[5].investTokenPrice
        if(totalRewardedTokensValue === 0 || totalInvestedTokensValue === 0)
          asset.roi = 0.0;
        else
          asset.roi = dailyRewardedTokensValue / totalInvestedTokensValue;
       
        asset.apy = (1.0 + asset.roi)**(365.0/asset.duration) - 1
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

  _getStakingTokenBalance = async (web3, asset, account, callback) => {

    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.liquidityTokenAddress)

      try {
        var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
        balance = web3.utils.fromWei(balance, "ether")
        callback(null, parseFloat(balance))
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
  }

  _getGlobalStats = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, {totalStaked : 0.0, totalUnlocked : 0.0, totalLocked : 0.0, recorded : 0.0, current : 0.0, rebaseRewardLeft : 0.0, duration : 0})
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    let fragmentContract = new web3.eth.Contract(config.erc20ABI, asset.uFragmentAddress)
    try {
      var  staked = await geyserContract.methods.totalStaked().call({ from: account.address });
      staked = parseFloat(web3.utils.fromWei(staked, "ether"))
      var  unlocked = await geyserContract.methods.totalUnlocked().call({ from: account.address });
      unlocked = parseFloat(unlocked)/10**asset.token1Decimals
      var  locked = await geyserContract.methods.totalLocked().call({ from: account.address });
      locked = parseFloat(locked)/10**asset.token1Decimals
      var  rebaseRewardLeft = await geyserContract.methods.rewardLeft().call({ from: account.address });
      rebaseRewardLeft = parseFloat(rebaseRewardLeft)/10**asset.token1Decimals
      var bonusPeriodSec = await geyserContract.methods.bonusPeriodSec().call({ from: account.address });
      //get the total supply saved in the geyser contract
      var  totalSupplyRecorded = await geyserContract.methods.lastAMPLTotalSupply().call({ from: account.address });
      // and the current real total supply
      var  totalSupplyCurrent = await fragmentContract.methods.totalSupply().call({ from: account.address });
      callback(null, {totalStaked : staked, totalUnlocked : unlocked, totalLocked : locked, recorded : totalSupplyRecorded, current : totalSupplyCurrent, rebaseRewardLeft : rebaseRewardLeft, duration : bonusPeriodSec})
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  _getMultiplierBonusAndReward = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, 0)
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    try {
      let minMultiplier = 1.0
      let startBonus = (await geyserContract.methods.startBonus().call({ from: account.address })) / 100.0;
      let maxMultiplier = 1.0 / startBonus
      let balance = await geyserContract.methods.totalStakedFor(account.address).call({ from: account.address });
      //nothing staked?
      if(balance.toString() === "0") {
        callback(null, { bonus : 1.0, reward : 0.0 })
        return
      }
      
      let totalCurrentRewardsFor = await geyserContract.methods.unstakeQuery(balance).call({ from: account.address });
      let totalRewardsFor = (await geyserContract.methods.updateAccounting().call({ from: account.address }))[4];
      
      let bonusPerc = Math.max(startBonus, totalCurrentRewardsFor / totalRewardsFor)
      let completedPerc = (bonusPerc - startBonus) / (1.0 - startBonus)
      let bonusMultiplier = completedPerc * (maxMultiplier - minMultiplier) + minMultiplier
      callback(null, {bonus : bonusMultiplier, reward : parseFloat(totalCurrentRewardsFor / 10**asset.token1Decimals)})
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

  _getUserBalances = async (web3, asset, account, callback) => {

    if(asset.geyserContract === null) {
      return callback(null, {totalStakedFor : 0})
    }

    let geyserContract = new web3.eth.Contract(asset.geyserContractABI, asset.geyserContract)
    var  balance = await geyserContract.methods.totalStakedFor(account.address).call({ from: account.address });
    balance = web3.utils.fromWei(balance, "ether")
    callback(null, {totalStakedFor : parseFloat(balance)})
  }

  getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  _getTokenPrices = async (web3, asset, account, callback) => {
    try {
      //use random api key
      let result = await fetch("https://min-api.cryptocompare.com/data/price?fsym=" + asset.rewardSymbol + "&tsyms=USD&api_key=" + config.cryptocompareApiKeys[this.getRandomInt(config.cryptocompareApiKeys.length)])
      let rewardPriceRes = await result.json()

      let res = await fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", {
      "headers": {
          "Content-Type": "application/json"
      },
      "body": "{\"query\":\"{\\n  pair(id: \\\"" + asset.liquidityTokenAddress + "\\\") {\\n    totalSupply\\n    reserveUSD\\n  }\\n}\\n\",\"variables\":null}",
      "method": "POST",
      "mode": "cors"
      });
      let data = await res.json()
      if(data.data) {
        let pair = data.data.pair
        if(pair) {
          //price of one lp token
          let lpPrice = pair.reserveUSD / pair.totalSupply
          callback(null, {investTokenPrice :lpPrice, rewardTokenPrice : rewardPriceRes.USD? rewardPriceRes.USD : 100.00})
          return
        }
      }
      callback(null, {investTokenPrice : 1000000000.0, rewardTokenPrice : 1.0})
    } catch(ex) {
      console.log(ex)
      return callback(null, {investTokenPrice : 0.0, rewardTokenPrice : 0.0})
    }
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
        if(parseFloat(ethAllowance) > 0) {
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
