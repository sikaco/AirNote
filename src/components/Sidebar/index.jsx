import React, {Component} from 'react'
import {observer} from 'mobx-react'
import css from './index.less'

@observer
export default class Sidebar extends Component {
  render() {
    return (
      <div id="sidebar">
        sidebar
        {/*<TabHead/>
         <TabBody>
         <Collection key="recent"/>
         <Collection key="trash"/>
         <Notebooks/>
         </TabBody>*/}
      </div>
    )
  }
}

