/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import "@ethersproject/shims"
import { ethers } from 'ethers'
import AvvyProvider from '@avvy/react-native-provider'
import AVVY from '@avvy/client'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      evmAddress: null
    }
  }

  initAvvy = async (poseidon) => {
    const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')
    const avvy = new AVVY(provider, {
      poseidon
    })
    const evmAddress = await avvy.name('avvydomains.avax').resolve(avvy.RECORDS.EVM)
    this.setState({
      evmAddress
    })
  }

  render() {
    return (
      <SafeAreaView>
        <AvvyProvider poseidon={(poseidon) => this.initAvvy(poseidon)} /> 
          <ScrollView>
            <View
              style={{
                flex: 1,
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontWeight: 'bold' }}>Forward Resolution Test</Text>
              <Text>avvydomains.avax</Text>
              <Text>{this.state.evmAddress || 'Loading EVM Address'}</Text>
            </View>
          </ScrollView>
      </SafeAreaView>
    );
  }
};

export default App;
