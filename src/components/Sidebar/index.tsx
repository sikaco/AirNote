import * as React from 'react'
import * as moment from 'moment'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Radio } from 'antd'
import './index.less'

import { EmptyProps, FormInputEvent } from '../../types'
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

function syncTimeFormat(time: moment.Moment): string {
  // todo: Format time according to how far the moment is.

  return time.format('h:m A')
}

const SyncInfoBar = observer((props: { syncInfo: ISyncInfo }) => {
  const {syncInfo} = props
  let syncTips = ''
  switch (syncInfo.state) {
    case SyncState.DONE:
      const time = syncTimeFormat(syncInfo.lastSyncedTime)
      syncTips = `${i18n('lastSynced')}: ${time}`
      break
    case SyncState.DOING:
      syncTips = `${i18n('syncing')}`
      break
    case SyncState.FAILED:
      syncTips = `${i18n('syncFailed')}`
  }

  return (
    <div id="sync-info-bar" onClick={() => {appState.getData()}}>
      <span className="sync-info-icon" />
      <div className="sync-info-tips">{syncTips}</div>
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
export default class Sidebar extends React.Component<EmptyProps, void> {
  store: ComponentStore

  constructor(props: EmptyProps) {
    super(props)

    this.store = new ComponentStore()
  }

  handleTabChange = (e: FormInputEvent) => {
    this.store.changeTab(Number(e.target.value))
  }

  render() {
    return (
      <div id="sidebar">
        <Radio.Group className="sidebar-tabs" value={this.store.tabIndex} onChange={this.handleTabChange}>
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
