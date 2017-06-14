import * as React from 'react'
import { observer } from 'mobx-react'

@observer
export default class Note extends React.Component<any, void> {
  render() {
    return (
      <div id="note">
        note
      </div>
    )
  }
}
