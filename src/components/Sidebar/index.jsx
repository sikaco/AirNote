import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Radio } from 'antd'
import './index.less'

import i18n from "../../global/i18n";
import {Collection, NoteBooksCollection} from './Collection'

const tabs = [
  {
    name: i18n('notebooks'),
    content: (
      <div>
        <Collection logo="" name={i18n('recents')} list=""/>
        <Collection logo="" name={i18n('trash')} list=""/>
        <NoteBooksCollection logo="" name={i18n('notebooks')} list=""/>
      </div>
    )
  },
  {
    name: i18n('tags'),
    content: <div>test2</div>
  }
]

class LocalStore {
  @observable tabIndex = 0

  @action changeTab(index) {
    this.tabIndex = index
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
          {
            tabs.map((tab, i) => <Radio.Button value={i} key={i}>{tab.name}</Radio.Button>)
          }
        </Radio.Group>
        {tabs[this.store.tabIndex].content}
      </div>
    )
  }
}
