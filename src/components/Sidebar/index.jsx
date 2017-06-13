import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Radio } from 'antd'
import './index.less'

import { i18n } from '../../global/i18nStore'
import appState from '../../AppState'
import { Notebooks, Tags } from './Collection'
import { SYNC_STATE } from '../../global/constants'

const tabs = [
  {
    name: 'notebooks',
    content: <Notebooks appState={appState} />
  },
  {
    name: 'tags',
    content: <Tags tag2pagesMap={appState.tag2pagesMap} />
  }
]

const SyncInfoBar = observer(({syncInfo}) => {
  let syncTips = ''
  switch (syncInfo.state) {
    case SYNC_STATE.DONE:
      let time = syncInfo.lastSyncedTime
      syncTips = `${i18n('lastSynced')}: ${time}`
      break
    case SYNC_STATE.DOING:
      syncTips = `${i18n('syncing')}`
      break
    case SYNC_STATE.FAILED:
      syncTips = `${i18n('syncFailed')}`
  }

  return (
    <div onClick={() => {appState.getData()}}>
      <img />
      <div>{syncTips}</div>
    </div>
  )
})

class ComponentStore {
  @observable tabIndex = 0

  @action changeTab(index) {
    this.tabIndex = index
  }
}

@observer
export default class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.store = new ComponentStore()
  }

  handleTabChange = (e) => {
    this.store.changeTab(e.target.value)
  }

  render() {
    return (
      <div id="sidebar">
        <Radio.Group value={this.store.tabIndex} onChange={this.handleTabChange}>
          {
            tabs.map((tab, i) => <Radio.Button value={i} key={i}>{i18n(tab.name)}</Radio.Button>)
          }
        </Radio.Group>
        {tabs[this.store.tabIndex].content}
        <SyncInfoBar syncInfo={appState.syncInfo} />
      </div>
    )
  }
}
