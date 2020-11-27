import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Card
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import {
  ERROR,
  INVEST,
  INVEST_RETURNED,
  UPDATE,
  REDEEM,
  REDEEM_RETURNED,
} from '../../constants'

import Store from "../../stores";

import { colors } from '../../theme'

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    width: '100%',
    textAlign: 'center',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    height: '47px',
    margin: '10px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none',
      margin: '0px'
    }
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px',
  },
  buttonText: {
    fontWeight: '700',
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  },
  stats: {
    width : '100%',
    background : colors.primary,
    borderRadius : '0',
    border : 'solid 1px',
    padding : '5px'
  },
  statsbody: {
    width : '50%',
    margin : 'auto',
    background : colors.primary,
    textAlign : 'left',
    float : 'left'
  }
});


class Asset extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  investReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  redeemReturned = (txHash) => {
    this.setState({ loading: false, redeemAmount: '' })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset, t } = this.props;
    const {
      account,
      amount,
      amountError,
      redeemAmount,
      redeemAmountError,
      loading
    } = this.state

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.tradeContainer }>
        {<div className={ classes.balances }>
            <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Available Balance: '+ asset.investTokenBalance.toLocaleString('en-US', {maximumFractionDigits: 10}) } { asset.investSymbol }</Typography>
        </div>}
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='amount'
          value={ amount }
          error={ amountError }
          onChange={ this.onChange }
          placeholder="0.00"
          variant="outlined"
          onKeyDown={ this.inputKeyDown }
        />
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            color="primary"
            onClick={ () => { this.setAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            color="primary"
            onClick={ () => { this.setAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            color="primary"
            onClick={ () => { this.setAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            color="primary"
            onClick={ () => { this.setAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          onClick={ this.onInvest }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={'secondary'}>{t('Asset.Earn')}</Typography>
        </Button>
        <Card className={ classes.stats }>
          <Card className={ classes.statsbody }>
            <Typography><b>total staked:</b></Typography>
            <Typography><b>rewards unlocked:</b></Typography>
            <Typography><b>rewards left:</b></Typography>
            <Typography><b>total bonus:</b></Typography>
            <Typography><b>bonus left:</b></Typography>
            <Typography><b>program duration:</b></Typography>
            <Typography><b>estimated program end:</b></Typography>
            <Typography><b>ROI:</b></Typography>
            <Typography><b>APY:</b></Typography>
          </Card>
          <Card className={ classes.statsbody }>
            <Typography>{asset.totalStaked.toLocaleString('en-US', {maximumFractionDigits: 8})} {asset.investSymbol}</Typography>
            <Typography>{asset.unlockedTokens.toLocaleString('en-US', {maximumFractionDigits: 2})} {asset.rewardSymbol}</Typography>
            <Typography>{asset.lockedTokens.toLocaleString('en-US', {maximumFractionDigits: 2})} {asset.rewardSymbol}</Typography>
            <Typography>{(asset.totalRewardTokens / 10**asset.token1Decimals).toLocaleString('en-US', {maximumFractionDigits: 2})} {asset.rewardSymbol}</Typography>
            <Typography>{asset.rebaseRewardLeft.toLocaleString('en-US', {maximumFractionDigits: 2})} {asset.rewardSymbol}</Typography>
            <Typography>{asset.duration} days</Typography>
            <Typography>{new Date(asset.end).toLocaleDateString()}</Typography>
            <Typography>{(asset.roi * 100.0).toFixed(2)}%</Typography>
            <Typography>{(asset.apy * 100.0).toFixed(2)}%</Typography>
          </Card>
        </Card>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
    <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>{ 'Estimated reward: '+ asset.rewardTokenBalance.toLocaleString('en-US', {maximumFractionDigits: 2}) } { asset.rewardSymbol } | Reward Multiplier: x{asset.bonusValue.toFixed(2)}</Typography>
        </div>
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='redeemAmount'
          value={ redeemAmount }
          error={ redeemAmountError }
          onChange={ this.onChange }
          disabled={ loading }
          placeholder="0.00"
          variant="outlined"
          onKeyDown={ this.inputRedeemKeyDown }
        />
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address }
          onClick={ this.onRedeem }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Asset.Claim') + ', ' + asset.rewardSymbol + " reward" }</Typography>
        </Button>
      </div>
    </div>)
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onInvest();
    }
  }

  onInvest = () => {
    this.setState({ amountError: false })

    const { amount } = this.state
    const { asset, startLoading } = this.props
    if(!amount || isNaN(amount) || amount <= 0 || amount > asset.investTokenBalance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: INVEST, content: { amount: amount, asset: asset } })
  }

  onRedeem = () => {
    this.setState({ redeemAmountError: false })

    const { redeemAmount } = this.state
    const { asset, startLoading  } = this.props

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > asset.totalStakedFor) {
      this.setState({ redeemAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: REDEEM, content: { amount: redeemAmount, asset: asset } })
  }

  onUpdate = () => {
    this.setState({ amountError: false })

    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: UPDATE, content: { asset } })
  }

  setAmount = (percent) => {
    if(this.state.loading) {
      return
    }
    const { asset } = this.props

    const balance = asset.investTokenBalance
    let amount = balance*percent/100.0
    amount = Math.floor(amount*10**15)/10**15;
    this.setState({ amount: amount.toLocaleString('en-US', {maximumFractionDigits: 15}) })
  }

  setRedeemAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.totalStakedFor
    
    let amount = balance*percent/100.0
    amount = Math.floor(amount*10**15)/10**15;
    this.setState({ redeemAmount: amount.toLocaleString('en-US', {maximumFractionDigits: 15}) })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Asset)));
