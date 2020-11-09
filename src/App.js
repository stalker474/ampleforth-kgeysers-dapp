import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import IpfsRouter from 'ipfs-react-router'
import Web3 from 'web3';

import './i18n';
import interestTheme from './theme';

import InvestSimple from './components/investSimple';
import Footer from './components/footer';
import Header from './components/header';

import { injected } from "./stores/connectors";

import {
  CONNECTION_CONNECTED,
} from './constants'

import Store from "./stores";
const emitter = Store.emitter
const store = Store.store

class App extends Component {
  state = {};
  updateAccount () {
    window.ethereum.on('accountsChanged', function (accounts) {
      store.setStore({ account: { address: accounts[0] } })

      const web3context = store.getStore('web3context')
      if(web3context) {
        emitter.emit(CONNECTION_CONNECTED)
      }
    })
  }
  componentWillMount() {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          let web3 = new Web3(a.provider)
          web3.eth.net.getNetworkType().then(type => {
            store.setStore({ networkID : type, account: { address: a.account }, web3context: { library: { provider: a.provider } } })
            emitter.emit(CONNECTION_CONNECTED)
          })
        })
        .catch((e) => {
          console.log(e)
        })
      } else {

      }
    });

    if(window.ethereum) {
      this.updateAccount()
    } else {
      window.addEventListener('ethereum#initialized', this.updateAccount, {
        once: true,
      });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        <CssBaseline />
        <IpfsRouter>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            background: "#f9fafb"
          }}>
            <Header />
             <InvestSimple />
            <Footer />
          </div>
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
