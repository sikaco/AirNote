import React, { Component } from 'react'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'
import { Radio } from 'antd'
import './index.less'

// import Collection from 'Collection'

const tabContentMap = {
  0: <div>test1</div>,
  1: <div>test2</div>
}

class LocalStore {
  @observable tabIndex = 0

  @action changeTab(index) {
    this.tabIndex = index
  }

  @computed get tabContent() {
    return tabContentMap[this.tabIndex]
  }
}

@observer
export default class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.store = new LocalStore()
  }

  handleTabChange = (e) => {
    this.store.changeTab(e.target.value)
  }

  render() {
    return (
      <div id="sidebar">
        <Radio.Group value={this.store.tabIndex} onChange={this.handleTabChange}>
          <Radio.Button value={0}>Notebooks</Radio.Button>
          <Radio.Button value={1}>Tags</Radio.Button>
        </Radio.Group>
        {this.store.tabContent}
      </div>
    )
  }
}
