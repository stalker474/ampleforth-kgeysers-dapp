import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card
} from '@material-ui/core';

import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme/theme'

import Snackbar from '../snackbar/snackbar'
import Loader from '../loader/loader'
import config from "../../config/config";

 import {
   Tooltip,
 } from '@material-ui/core'
 import InfoIcon from '@material-ui/icons/Info';

import {
  ERROR,
  GET_BALANCES_NFT,
  BALANCES_NFT_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  TRIGGER_SWAP,
  TRIGGER_SWAP_RETURNED,
  REWARD
} from '../../constants/constants'

import Store from "../../stores/store";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  swapContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    }
  },
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '24px 0px'
  },
  introText: {
    paddingLeft: '20px'
  },
  actionButton: {
    '&:hover': {
      backgroundColor: colors.compoundGreen,
    },
    backgroundColor: colors.green,
    border: 'solid 1px',
    fontWeight: 'bold',
    width: "80%"

  },
  overlay: {
    position: 'absolute',
    background: 'RGBA(200, 200, 200, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #aaa',
    cursor: 'pointer',

    right: '0px',
    top: '10px',
    height: '70px',
    width: '160px',
    [theme.breakpoints.up('md')]: {
      right: '0px',
      top: '10px',
      height: '90px',
      width: '210px',
    }
  },
  heading: {
    display: 'none',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  headingName: {
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    border: "solid 2px",
    marginTop: "20px",
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    height: '140px',
    width: '140px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '150px',
      width: '150px',
      marginRight: '24px',
    }
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    border: '1px solid '+colors.borderGrey,
    alignItems: 'center',
    maxWidth: 'calc(100vw - 24px)',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      maxWidth: 'auto'
    }
  },
  between: {
    width: '40px',
    height: '40px'
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
  },
  versionToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tableHeadContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  grey: {
    color: colors.darkGray
  },
});

class SwapForNFT extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    this.state = {
      account: account,
      network : null,
      snackbarType: null,
      snackbarMessage: null,
      value: 1,
      claimTokenBalance: 0,
      nftTokenBalance: 0,
      loading : false
    }

    if(account && account.address && this.state.network === config.network) {
      dispatcher.dispatch({ type: GET_BALANCES_NFT, content: {} })
      this.setState({loading : true})
    }
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_NFT_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(TRIGGER_SWAP_RETURNED, this.swapCompleted)

  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(BALANCES_NFT_RETURNED, this.balancesReturned);
    emitter.removeListener(TRIGGER_SWAP_RETURNED, this.swapCompleted);
  };

  refresh() {
    dispatcher.dispatch({ type: GET_BALANCES_NFT, content: {} })
  }

  balancesReturned = (balances) => {
    this.setState({
      loading: false,
      claimTokenBalance : balances[0],
      nftTokenBalance: balances[1]
    })
    setTimeout(this.refresh, 60000);
  };

  connectionConnected = () => {
    const { t } = this.props
    
    this.setState({ account: store.getStore('account'),
                    network : store.getStore('networkID'),
                    loading: true })
    if(this.state.network === config.network) {
      dispatcher.dispatch({ type: GET_BALANCES_NFT, content: {} })
      this.setState({loading : true})
    }

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t("Unlock.WalletConnected"), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  swapCompleted = () => {
    this.setState({loading : false});
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      account,
      snackbarMessage,
      network
    } = this.state
    if(!account || !account.address || (network !== config.network)) {
      return (
        <div className={ classes.root }>
          <Typography variant={'h2'}>Please connect your wallet</Typography>
          { snackbarMessage && this.renderSnackbar() }
        </div>
      )
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.swapContainer }>
        { account.address && this.renderSwapComponent() }
        </div>
        { loading && <Loader /> }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  renderSwapComponent = () => {
    const { nftTokenBalance, claimTokenBalance, account, loading } = this.state
    const { classes, t } = this.props
      return (
        <div>
          <div className={ classes.assetSummary }>
              <div className={classes.heading}>
                <div className={ classes.assetIcon }>
                  <img alt="" src={ require('../../assets/zeus_nft.png') } style={{width : '100%', padding : '4%'}} />
                </div>
              </div>
              <div className={classes.heading} style={{flex : 2, marginRight : "23px", textAlign : "center"}}>
                <Typography variant={ 'h3' }>Phase I of the Zeus kGeyser Pioneer NFT distribution is now live. Use the Claim Token in your wallet to mint NFT.</Typography>
              </div>
              <div className={classes.heading} style={{flex : 1}}>
                <Button
                className={ classes.actionButton }
                variant="text"
                color="secondary"
                disabled={ loading }
                onClick={ (event) => {this.onSwap();} }
                >Mint 1 NFT
                </Button>
                <Typography variant={ 'h5' } className={ classes.grey }>You can mint {claimTokenBalance} NFTs</Typography>
              </div>
              <div className={classes.heading} style={{flex : 1, fontWeight : "bold", textAlign : "center", fontSize : "1.1em", marginRight : "23px"}}>
                <a href={"https://testnets.opensea.io/accounts/" + account.address}>View claimed tokens on OpenSea</a>
              </div>
            </div>
            <div className={ classes.assetSummary }>
              <div className={classes.heading}>
                <div className={ classes.assetIcon }>
                  <img alt="" src={ require('../../assets/apollo_nft.png') } style={{width : '100%', padding : '4%'}} />
                </div>
              </div>
              <div className={classes.heading} style={{flex : 2, marginRight : "23px", textAlign : "center"}}>
                <Typography variant={ 'h3' }>Phase I of the Apollo kGeyser Pioneer NFT distribution has not launched.</Typography>
              </div>
              <div className={classes.heading} style={{flex : 1}}>
                <Button
                className={ classes.actionButton }
                variant="text"
                color="secondary"
                disabled={ true }
                onClick={ (event) => {this.onSwap();} }
                >Minting is not yet available
                </Button>
                <Typography variant={ 'h5' } className={ classes.grey }>You can mint 0 NFTs</Typography>
              </div>
              <div className={classes.heading} style={{flex : 1, fontWeight : "bold", textAlign : "center", fontSize : "1.1em", marginRight : "23px"}}>
                <a >View claimed tokens on OpenSea (After Launch)</a>
              </div>
            </div>
        </div>
      )
  }

  onSwap = () => {
    dispatcher.dispatch({ type: TRIGGER_SWAP, content: {} })
    this.setState({loading : true})
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };
}

export default withNamespaces()(withRouter(withStyles(styles)(SwapForNFT)));
