import * as React from 'react'
import { observer } from 'mobx-react'
import './index.less'

import { EmptyProps } from '../../types'

@observer
export default class Note extends React.Component<EmptyProps, void> {
  render() {
    return (
      <div id="note">
        note
      </div>
    )
  }
}
