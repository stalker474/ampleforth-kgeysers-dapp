import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'
import config from "../../config";

 import {
   Tooltip,
 } from '@material-ui/core'
 import InfoIcon from '@material-ui/icons/Info';

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  INVEST_RETURNED,
  REDEEM_RETURNED,
  UPDATE_RETURNED,
  REWARD_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  REWARD
} from '../../constants'

import Store from "../../stores";

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
  investedContainerLoggedOut: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  investedContainer: {
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
  balancesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    padding: '12px 12px',
    position: 'relative',
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
    border: '1px solid' + colors.borderGrey,
    fontWeight: 500,
    width: "auto"

  },
  rewardButton: {
    '&:hover': {
      backgroundColor: colors.compoundGreen,
    },
    backgroundColor: colors.green,
    border: '1px solid' + colors.borderGrey,
    fontWeight: 500,
    float : 'right'
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
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
  },
  headingName: {
    paddingTop: '5px',
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
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
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
  investAllContainer: {
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%'
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    marginBottom: '24px',
    background: colors.white
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

class InvestSimple extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    this.state = {
      assets: store.getStore('assets'),
      account: account,
      network : null,
      snackbarType: null,
      snackbarMessage: null,
      value: 1,
      info_expanded : false
    }

    if(account && account.address && this.state.network === config.network) {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    }
  }
  componentWillMount() {
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(UPDATE_RETURNED, this.updateReturned);
    emitter.on(REWARD_RETURNED, this.rewardReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);

  }

  componentWillUnmount() {
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(UPDATE_RETURNED, this.updateReturned);
    emitter.removeListener(REWARD_RETURNED, this.rewardReturned);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
  };

  refresh() {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  }

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('assets') })
    setTimeout(this.refresh, 10000);
  };

  connectionConnected = () => {
    const { t } = this.props
    
    this.setState({ account: store.getStore('account') , network : store.getStore('networkID') })
    if(this.state.network === config.network)
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t("Unlock.WalletConnected"), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

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

  investReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  redeemReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  rewardReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  updateReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
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
          <div className={ classes.investedContainerLoggedOut }>
          <Accordion style={{border: '0px', background: "#e6e6e6"}} key={ "info_expand" } expanded={ this.state.info_expanded} onChange={ () => { this.toggleInfo() } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="info-panel"
            style={{padding : "5px"}}
          >
           <div style={{margin : "auto"}}><b>Using the kGeyser</b></div>
          </AccordionSummary>
          <AccordionDetails>
            <img alt="graphic" src={require('../../assets/kGeysers_Infographics_v2.png')}/>
          </AccordionDetails>
        </Accordion>
            <div className={ classes.introCenter }>
              {(!account || !account.address) ?
              <Typography variant='h3'>Connect your wallet to continue</Typography>
              :
              <Typography variant='h3'>Switch to network : {config.network}</Typography>
            }
            </div>
          </div>
          { snackbarMessage && this.renderSnackbar() }
        </div>
      )
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
        <Accordion style={{border: '0px', background: colors.infoGrey, color : colors.white}} key={ "info_expand" } expanded={ this.state.info_expanded} onChange={ () => { this.toggleInfo() } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="info-panel"
            style={{padding : "5px"}}
          >
           <div style={{margin : "auto"}}><b>Using the kGeyser</b></div>
          </AccordionSummary>
          <AccordionDetails>
            <img alt="graphic" src={require('../../assets/kGeysers_Infographics_v2.png')}/>
          </AccordionDetails>
        </Accordion>
          { account.address && this.renderAssetBlocks() }
          
        </div>
        { loading && <Loader /> }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  handleTabChange = (event, newValue) => {
    this.setState({value:newValue})
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  };

  renderAssetBlocks = () => {
    const { assets, expanded } = this.state
    const { classes, t } = this.props
    return assets.map((asset) => {
      return (
        <Accordion className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+asset.symbol+'-logo.png') }
                    style={{width : '100%'}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading} style={{flex : 2}}>
                <Typography variant={ 'h3' }>
                  {
                    asset.totalStakedFor.toLocaleString('en-US', {maximumFractionDigits: 8}) + ' ' + asset.investSymbol
                  }
                </Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>{ t('InvestSimple.InvestedBalance') }</Typography>
              </div>
              <div className={classes.heading}>
              <Typography variant={ 'h3' }>
                {(asset.apy * 100.0).toFixed(2)}%
                <Tooltip title={
                    <React.Fragment>
                      <Typography variant={'h5'}>
                      The annual percentage yield (APY) is the real rate of return earned from the pool when taking into account the effect of compounding interest
                      </Typography>
                    </React.Fragment>
                  } arrow>
                  <InfoIcon />
                </Tooltip>
              <Typography variant={ 'h5' } className={ classes.grey }>APY</Typography>
                </Typography>
              </div>
              <div className={classes.heading} style={{flex : 2}}>
              {asset.needRebase && (Date.now() >= 1604759460000)? <Button
                className={ classes.rewardButton }
                variant="text"
                color="secondary"
                onClick={ (event) => {this.onRebase(asset); event.stopPropagation(); /*prevent accordeon from oppening*/} }
                >
                  <div style={{height : '24px', marginRight : '5px'}}>
              </div>
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Asset.Rebase') + ': ' } <br/> { asset.needRebase? asset.nextReward.toFixed(2) + ' ' + asset.rewardSymbol : '' }</Typography>
                <Tooltip title={
                    <React.Fragment>
                      <Typography variant={'h5'} className={ classes.fees }>
                      Press this button after 02:30 UTC daily to distribute the rebase bonus to all stakers. (.5% during positive rebases, 1% during negative.). Bonus does not accumulate, so click once every 24 hours!
                      </Typography>
                    </React.Fragment>
                  } arrow>
                  <InfoIcon style={{color : 'white'}} />
                </Tooltip>
              </Button> : <Typography>Next rebase bonus available at 02:30 UTC</Typography>}
              </div>
              
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  toggleInfo = () => {
    this.setState({ info_expanded: !this.state.info_expanded })
  }

  onRebase = (asset) => {
    this.startLoading()
    dispatcher.dispatch({ type: REWARD, content: { asset } })
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

export default withNamespaces()(withRouter(withStyles(styles)(InvestSimple)));
