import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Tabs } from 'antd'
import './index.less'

const TabPane = Tabs.TabPane

@observer
export default class Sidebar extends Component {
  render() {
    return (
      <div id="sidebar">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 1" key="1">
            sidebar
            {/*<Collection key="recent"/>
             <Collection key="trash"/>
             <Notebooks/>*/}
          </TabPane>
          <TabPane tab="Tab 2" key="2">

          </TabPane>
        </Tabs>
      </div>
    )
  }
}
