import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
export default class Note extends Component {
  render() {
    return (
      <div id="note">
        note
      </div>
    )
  }
}

