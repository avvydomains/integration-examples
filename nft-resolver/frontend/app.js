import AVVY from '@avvy/client'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ethers } from 'ethers'

import contracts from './contracts.json'

const REGISTRY_NAME = 'nftreg.avax'

const Button = (props) => (
  <div {...props} className={`${props.className} bg-gray-700 rounded px-2 py-1 text-white inline-block cursor-pointer`}>{props.children}</div>
)

const Loader = () => (
  <div className='text-center my-4 w-full'>
    <div className={'lds-ring'}><div></div><div></div><div></div><div></div></div>
  </div>
)

class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      account: null,
      hasToken: false,
      chainId: null,
      name: null,
      nextName: '',
      loading: false
    }
  }

  _getContract = (contractName) => {
    const chainId = this.state.chainId
    const contractData = contracts[chainId][0].contracts[contractName]
    return new ethers.Contract(contractData.address, contractData.abi, this.provider.getSigner())
  }

  _isMainnet = () => {
    return this.state.chainId === 43114
  }

  connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if (accounts.length > 0) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.avvy = new AVVY(this.provider)
      const { chainId } = await this.provider.getNetwork()
      this.setState({
        account: accounts[0],
        chainId
      }, async () => {
        const hasToken = await this.hasToken()
        const name = await this.getName()
        this.setState({
          hasToken,
          name,
        })
      })
    }
  }

  getName = async () => {
    // checks to see if the user has set a name
    const resolver = await this._getContract('NameResolver')
    try {
      const hash = await resolver.getName(this.state.account)
      let preimage

      if (this._isMainnet()) {
        // use library with simplified lookup on mainnet
        preimage = await this.avvy.hash(hash).lookup()
      } else {
        // otherwise we use the internal functions to access our mock rainbowtable
        let rainbowTable = await this._getContract('RainbowTableV1')
        let preimageSignals = await rainbowTable.lookup(hash)
        preimage = await this.avvy.utils.decodeNameHashInputSignals(preimageSignals)
      }

      return preimage
    } catch (err) {
      console.log(err)
      return null
    }
  }

  hasToken = async () => {
    // checks to see if the user owns the NFT
    const contract = this._getContract('NFT')
    const balance = await contract.balanceOf(this.state.account)
    return parseInt(balance.toString()) > 0
  }

  getToken = async () => {
    // helps the user get an NFT (in this case, just directly mints it)
  }

  mintToken = async () => {
    const contract = this._getContract('NFT')
    const tx = await contract.mint()
    const receipt = await tx.wait()
    await this.connectWallet()
  }

  onNextNameChanged = (e) => {
    this.setState({
      nextName: e.target.value
    })
  }

  changeName = async () => {
    const resolver = await this._getContract('NameResolver')
    const preimage = this.state.nextName + '.' + REGISTRY_NAME
    const hash = await this.avvy.utils.nameHash(preimage)
    const inputSignals = await this.avvy.utils.encodeNameHashInputSignals(preimage)
    this.setState({
      loading: true
    })
    try {
      const tx = await resolver.claimName(inputSignals, hash)
      await tx.wait()
      await this.connectWallet()
      this.setState({
        loading: false
      })
    } catch (err) {
      alert('Failed: ' + err)
      console.log(err)
      this.setState({
        loading: false
      })
    }
  }

  setMain = async () => {
    this.setState({
      loading: true
    })
    const preimage = this.state.nextName + '.' + REGISTRY_NAME
    const hash = await this.avvy.utils.nameHash(preimage)
    try {
      let tx
      if (this._isMainnet()) {
        
        // this is the live mainnet version
        tx = await this.avvy.contracts.EVMReverseResolverV1.set(hash, [])
      } else {

        // this is our local mock version
        let evmReverseResolver = await this._getContract('EVMReverseResolverV1')
        tx = await evmReverseResolver.set(hash, [])
      }

      await tx.wait()
      this.setState({
        loading: false
      })
    } catch (err) {
      alert('Failed: ' + err)
      console.log(err)
      this.setState({
        loading: false
      })
    }
  }
  
  renderAuthenticated() {
    return (
      <div>
        {this.state.hasToken ? (
          <div>
            <div>
              {this.state.name ? (
                <div className='flex items-center'>
                  <span>{'You have set your name to: '}</span>
                  <span className='font-bold ml-2'>{this.state.name}</span>
                </div>
              ) : <div>{'You have not set your name.'}</div>}
            </div>
            <div className='font-bold mt-4'>{'Set Name'}</div>
            <div className=''>{'You can change your claimed name on this registry using this form.'}</div>
            <div className='mt-2 flex items-center'>
              <input type="text" className='border border-gray-200 rounded p-2' onChange={this.onNextNameChanged} />
              <div className='mr-2'>{'.' + REGISTRY_NAME}</div>
            </div>
            <Button onClick={this.changeName} className='mt-2'>{'Set name'}</Button>
            {this.state.name ? (
              <div className='mt-4'>
                <div className='font-bold'>{'Set as Main Avvy Name'}</div>
                <div className=''>{'If you would like to use ' + this.state.name + ' as your Main Avvy Name, enable using the button below. Your Main Avvy Name can be used as your username wherever you connect your wallet.'}</div>
                <Button onClick={this.setMain} className='mt-2'>{'Set as main'}</Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <div>{"You don't hold our NFT! Mint one to continue."}</div>
            <div className='mt-2'>{"On mainnet, this can be hooked up to any existing ERC721 NFT collection so that only holders can access the subdomain regisry."}</div>
            <Button onClick={this.mintToken} className='mt-2'>Mint NFT</Button>
          </div>
        )}
      </div>
    )
  }

  renderLoading() {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  render() {
    return (
      <div className='flex w-full h-full items-center bg-gray-100'>
        <div className='bg-white shadow rounded-xl p-4 max-w-screen-md m-auto w-full'>
          <div className='font-bold'>
            {REGISTRY_NAME + ' - Avvy Domains Subdomain Registry'}
          </div>
          <div className='my-2 w-full bg-gray-200' style={{'height': '1px'}} />
          {this.state.loading ? this.renderLoading() : this.state.account ? this.renderAuthenticated() : (
            <div className='mt-2'>
              <div>
                {'This project is a demo subdomain registry. The goal is to illustrate how subdomain registries can be set up and used.'}
              </div>
              <Button className='mt-4' onClick={this.connectWallet}>Connect Wallet to Continue</Button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

async function main() {
  const root = createRoot(document.getElementById('root'))
  root.render(<App />)
}

main()
