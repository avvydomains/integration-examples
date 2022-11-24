import React from 'react'
import { ethers } from 'ethers'
import AVVY from '@avvy/client'

const PROVIDER_URL = 'https://api.avax.network/ext/bc/C/rpc'

class EVMAddress extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      
      // this does nothing in the current component,
      // but could be used to display a loading spinner.
      loading: false,
      
      // this is the .avax name that we will attempt to
      // find.
      reverse: null
    }
  }

  componentDidMount() {
    this.reverseRecord()
  }

  reverseRecord = async () => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const avvy = new AVVY(provider)
    this.setState({
      loading: true
    })
    try {
      const hash = await avvy.reverse(AVVY.RECORDS.EVM, this.props.address)
      const name = await hash.lookup()
      this.setState({
        reverse: name.name,
        loading: false
      })
    } catch (err) {
      console.log('failed to reverse name')
      console.log(err)
      this.setState({
        loading: false
      })
    }
  }

  render() {
    return (
      <div style={{ backgroundColor: '#eee', fontSize: '10px', padding: '10px'}}>
        {this.state.reverse ? (
          <span>{this.state.reverse} ({this.props.address.slice(0, 6)}..{this.props.address.slice(this.props.address.length - 4)})</span>
        ) : (
          <span>{this.props.address}</span>
        )}
      </div>
    )
  }
}

export default EVMAddress
