import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

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
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
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
      snackbarType: null,
      snackbarMessage: null,
      hideV1: true,
      value: 1,
      info_expanded : false
    }

    if(account && account.address) {
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
    setTimeout(this.refresh, 3000);
  };

  connectionConnected = () => {
    const { t } = this.props
    this.setState({ account: store.getStore('account') })

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
      snackbarMessage
    } = this.state

    if(!account || !account.address) {
      return (
        <div className={ classes.root }>
          <div className={ classes.investedContainerLoggedOut }>
          <Accordion style={{border: '0px', background: "#e6e6e6"}} key={ "info_expand" } expanded={ this.state.info_expanded} onChange={ () => { this.toggleInfo() } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="info-panel"
            style={{padding : "5px"}}
          >
           <div style={{margin : "auto"}}><b>About the kGeyser</b></div>
          </AccordionSummary>
          <AccordionDetails>
          <Typography >
              Welcome to the kGeyser, a program launched by the AmpleSense DAO to support Ample/kMPL (kiloAmple) liquidity and distribute kMPL tokens to the community.<br/>
              <br/>
              There are two kGeysers: <b>Zeus</b> and <b>Apollo</b>.<br/>
              <br/>
              In <b>Zeus</b>, community members can deposit AMPL/ETH liquidity tokens (from Uniswap) into the kGeyser for kMPL rewards.<br/>
              <br/>
              <b>Apollo</b> is for kMPL/ETH liquidity providers. Deposit Uniswap kMPL/ETH liquidity tokens for additional rewards.<br/>
              <br/>
              Note: The kGeyser contract is a fork of the audited Ampleforth Geyser <a href="https://github.com/ampleforth/ampleforth-audits/blob/master/token-geyser/v1.0.0/CertiK_Verification_Report.pdf">contract</a>.<br/>
              <br/>
              <b>Distribute Bonus kMPL</b>: Each day, you can distribute bonus kMPL to liquidity providers after each Ample rebase (approximately 02:30 UTC).<br/>
              <br/>
              - <b>During positive rebase</b>: The daily bonus is .5% of the bonus pool<br/>
              - <b>During negative rebase</b>: The bonus doubles to 1% of the kMPL bonus pool<br/>
              - <b>During equilibrium</b>: No bonus is distributed<br/>
          </Typography>
          </AccordionDetails>
        </Accordion>
            <div className={ classes.introCenter }>
              <Typography variant='h3'>Connect your wallet to continue</Typography>
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
           <div style={{margin : "auto"}}><b>About the kGeyser</b></div>
          </AccordionSummary>
          <AccordionDetails>
          <Typography >
              Welcome to the kGeyser, a program launched by the AmpleSense DAO to support Ample/kMPL (kiloAmple) liquidity and distribute kMPL tokens to the community.<br/>
              <br/>
              There are two kGeysers: <b>Zeus</b> and <b>Apollo</b>.<br/>
              <br/>
              In <b>Zeus</b>, community members can deposit AMPL/ETH liquidity tokens (from Uniswap) into the kGeyser for kMPL rewards.<br/>
              <br/>
              <b>Apollo</b> is for kMPL/ETH liquidity providers. Deposit Uniswap kMPL/ETH liquidity tokens for additional rewards.<br/>
              <br/>
              Note: The kGeyser contract is a fork of the audited Ampleforth Geyser <a href="https://github.com/ampleforth/ampleforth-audits/blob/master/token-geyser/v1.0.0/CertiK_Verification_Report.pdf">contract</a>.<br/>
              <br/>
              <b>Distribute Bonus kMPL</b>: Each day, you can distribute bonus kMPL to liquidity providers after each Ample rebase (approximately 02:30 UTC).<br/>
              <br/>
              - <b>During positive rebase</b>: The daily bonus is .5% of the bonus pool<br/>
              - <b>During negative rebase</b>: The bonus doubles to 1% of the kMPL bonus pool<br/>
              - <b>During equilibrium</b>: No bonus is distributed<br/>
          </Typography>
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
    const width = window.innerWidth
    console.log(assets)
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
                    height={ width > 600 ? '40px' : '30px'}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>
                  {
                    asset.stakedTokenBalance.toFixed(2) + ' ' + asset.investSymbol
                  }
                </Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>{ t('InvestSimple.InvestedBalance') }</Typography>
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
