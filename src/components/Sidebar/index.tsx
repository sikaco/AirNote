import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Radio } from 'antd'
import './index.less'

import { i18n } from '../../stores/I18nStore'
import appState, { ISyncInfo } from '../../stores/AppState'
import { Notebooks, Tags } from './Collection'
import { SyncState } from '../../stores/constants'

const tabs = [
  {
    name: 'notebooks',
    content: <Notebooks appState={appState} />
  },
  {
    name: 'tags',
    content: <Tags notesOfTags={appState.notesOfTags} />
  }
]

const SyncInfoBar = observer((props: { syncInfo: ISyncInfo }) => {
  const {syncInfo} = props
  let syncTips = ''
  switch (syncInfo.state) {
    case SyncState.DONE:
      let time = syncInfo.lastSyncedTime
      syncTips = `${i18n('lastSynced')}: ${time}`
      break
    case SyncState.DOING:
      syncTips = `${i18n('syncing')}`
      break
    case SyncState.FAILED:
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

  @action changeTab(index: number): void {
    this.tabIndex = index
  }
}

@observer
export default class Sidebar extends React.Component<any, void> {
  store: ComponentStore

  constructor(props: any) {
    super(props)

    this.store = new ComponentStore()
  }

  handleTabChange = (e: any) => {
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
