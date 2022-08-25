import React from 'react'
import { ethers } from 'ethers'
import AVVY from '@avvy/client'

const PROVIDER_URL = 'https://api.avax.network/ext/bc/C/rpc'

class EVMForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
    }
  }

  onSubmit = async (e) => {
    e.preventDefault()
    let val = this.inputRef.value
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const avvy = new AVVY(provider)
    this.setState({
      searching: true
    }, async () => {
      if (/\.avax$/.test(val)) {
        try {
          val = await avvy.name(val).resolve(AVVY.RECORDS.EVM)
        } catch {}
      }
      if (/0x[0-9A-Za-z]{40}/.test(val)) {
        alert('🥳🥳🥳🥳🥳 you did it!')
      } else {
        alert('Please enter an 0x address or a .avax address!')
      }

      this.setState({
        searching: false
      })
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input placeholder='0x..' type="text" ref={(ref) => this.inputRef = ref} disabled={this.state.searching} />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default EVMForm
