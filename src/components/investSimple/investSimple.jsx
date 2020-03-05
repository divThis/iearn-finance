import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Switch
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withNamespaces } from 'react-i18next';

import InvestAllModal from './investAllModal.jsx'
import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  INVEST_RETURNED,
  REDEEM_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
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
    paddingBottom: '20px'
  },
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '48px 0px'
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
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  overlay: {
    position: 'absolute',
    borderRadius: '10px',
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
    borderRadius: '20px',
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
    maxWidth: '100px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '0.75rem',
    height: 'max-content',
    [theme.breakpoints.up('md')]: {
      maxWidth: '130px',
      width: '100%'
    }
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
    borderRadius: '0.75rem',
    marginBottom: '24px',
  }
});

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#DC6BE5',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);


const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: '1px',
    '&:focus': {
      color: '#DC6BE5',
      opacity: 1,
    },
  },
}))(props => <Tab disableRipple {...props} />);

class InvestSimple extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const disclaimerClosed = localStorage.getItem('iearn-disclaimer-closed')

    this.state = {
      assets: store.getStore('assets'),
      account: account,
      modalOpen: false,
      modalInvestAllOpen: false,
      snackbarType: null,
      snackbarMessage: null,
      hideV1: true,
      value: 1,
      disclaimerClosed: disclaimerClosed
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    }
  }
  componentWillMount() {
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);

  }

  componentWillUnmount() {
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
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
    setTimeout(this.refresh,5000);
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

  render() {
    const { classes, t } = this.props;
    const {
      loading,
      account,
      modalOpen,
      modalInvestAllOpen,
      snackbarMessage,
      hideV1,
      value,
      disclaimerClosed
    } = this.state
    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }
    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>

          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>

          { account.address &&

            <div className={ classes.intro }>
              {/*<StyledTabs value={value} onChange={this.handleTabChange} aria-label="styled tabs example">
                <StyledTab label="v1" />
                <StyledTab label="y.curve.fi" />
                <StyledTab label="busd.curve.fi" />
              </StyledTabs>*/}
              <ToggleButtonGroup value={value} onChange={this.handleTabChange} aria-label="version" exclusive size={ 'small' }>
                <ToggleButton value={0} aria-label="v1">
                  <Typography variant={ 'h3' }>v1</Typography>
                </ToggleButton>
                <ToggleButton value={1} aria-label="v2">
                  <Typography variant={ 'h3' }>y.curve.fi</Typography>
                </ToggleButton>
                <ToggleButton value={2} aria-label="v3">
                  <Typography variant={ 'h3' }>busd.curve.fi</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
              <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
                <Typography variant={ 'h5'} noWrap>{ address }</Typography>
                <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </Card>
            </div>
          }
          { !account.address &&
            <div className={ classes.introCenter }>
              <Typography variant='h2'>{ t('InvestSimple.Intro') }</Typography>
            </div>
          }
          {!account.address &&
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.overlayClicked }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('InvestSimple.Connect') }</Typography>
              </Button>
            </div>
          }
          { account.address && value == 0 && this.renderAssetBlocksv1() }
          { account.address && value == 1 && this.renderAssetBlocksv2() }
          { account.address && value == 2 && this.renderAssetBlocksv3() }
          {/* account.address && <div className={ classes.investAllContainer }>
            <Button
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              disabled={ loading }
              onClick={ this.investAllClicked }
              >
              <Typography className={ classes.buttonText } variant={ 'h5'}>{ 'Earn All' }</Typography>
            </Button>
          </div> */}
        </div>
        { loading && <Loader /> }
        { modalOpen && this.renderModal() }
        { modalInvestAllOpen && this.renderInvestAllModal() }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  handleTabChange = (event, newValue) => {
    console.log(newValue);
    this.setState({value:newValue})
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  };

  renderAssetBlocks = () => {
    const { classes, t } = this.props
    const {
      value,
    } = this.state
    return (
      <StyledTabs value={value} onChange={this.handleTabChange} aria-label="styled tabs example">
        <StyledTab label="v1" />
        <StyledTab label="y.curve.fi" />
        <StyledTab label="busd.curve.fi" />
      </StyledTabs>
    )
  }

  renderAssetBlocksv1 = () => {
    const { assets, expanded, hideV1 } = this.state
    const { classes, t } = this.props
    const width = window.innerWidth

    return assets.filter((asset) => {
      return (hideV1 === true || asset.version !== 1)
    }).filter((asset) => {
      return (asset.version === 1 && (asset.investedBalance) > 0)
    }).filter((asset) => {
      return !(asset.symbol === "iDAI")
    }).map((asset) => {
      return (
        <ExpansionPanel className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <ExpansionPanelSummary
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
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ (asset.maxApr*100).toFixed(4) + ' %' }</Typography>
                <Typography variant={ 'h5' }>{ t('InvestSimple.InterestRate') }</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{asset.balance+' '+( asset.tokenSymbol ? asset.tokenSymbol : asset.symbol )}</Typography>
                <Typography variant={ 'h5' }>{ t('InvestSimple.AvailableBalance') }</Typography>
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }

  renderAssetBlocksv2 = () => {
    const { assets, expanded, hideV1 } = this.state
    const { classes, t } = this.props
    const width = window.innerWidth

    return assets.filter((asset) => {
      return (asset.version === 2)
    }).filter((asset) => {
      return !(asset.symbol === "iDAI")
    }).map((asset) => {
      return (
        <ExpansionPanel className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <ExpansionPanelSummary
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
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ (asset.maxApr*100).toFixed(4) + ' %' }</Typography>
                <Typography variant={ 'h5' }>{ t('InvestSimple.InterestRate') }</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{(asset.balance)+' '+( asset.tokenSymbol ? asset.tokenSymbol : asset.symbol )}</Typography>
                <Typography variant={ 'h5' }>{ t('InvestSimple.AvailableBalance') }</Typography>
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }

  renderAssetBlocksv3 = () => {
    const { assets, expanded, hideV1 } = this.state
    const { classes, t } = this.props
    const width = window.innerWidth

    return assets.filter((asset) => {
      return (asset.version === 3)
    }).filter((asset) => {
      return !(asset.symbol === "iDAI")
    }).map((asset) => {
      return (
        <ExpansionPanel className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <ExpansionPanelSummary
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
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ (asset.maxApr*100).toFixed(4) + ' %' }</Typography>
                <Typography variant={ 'h5' }>{ t('InvestSimple.InterestRate') }</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{(asset.balance)+' '+( asset.tokenSymbol ? asset.tokenSymbol : asset.symbol )}</Typography>
                <Typography variant={ 'h5' }>{ t('InvestSimple.AvailableBalance') }</Typography>
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
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

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderInvestAllModal = () => {
    return (
      <InvestAllModal closeModal={ this.closeInvestAllModal } modalOpen={ this.state.modalInvestAllOpen } assets={ this.state.assets } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  investAllClicked = () => {
    this.setState({ modalInvestAllOpen: true })
  }

  closeInvestAllModal = () => {
    this.setState({ modalInvestAllOpen: false })
  }

  // closeDisclaimer = () => {
  //   localStorage.setItem('iearn-disclaimer-closed', '1')
  //   this.setState({ disclaimerClosed: '1' })
  // }
}

export default withNamespaces()(withRouter(withStyles(styles)(InvestSimple)));
