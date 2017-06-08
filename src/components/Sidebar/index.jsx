import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Radio } from 'antd'
import './index.less'

import i18n from "../../global/i18n";
import appState from "../../AppState";
import { Collection, CollectionWithBooks } from './Collection'

function Notebooks({appState}) {
  return (
    <div>
      <Collection
        icon="" name={i18n('recents')} pages={appState.recents}
        onClick={() => {appState.setShowedPages(appState.recents)}}
      />
      <Collection
        icon="" name={i18n('trash')} pages={appState.notesInTrash}
        onClick={() => {appState.setShowedPages(appState.notesInTrash)}}
      />
      <CollectionWithBooks icon="" name={i18n('notebooks')} books={appState.notebooks}/>
    </div>
  )
}

const tabs = [
  {
    name: i18n('notebooks'),
    content: <Notebooks appState={appState}/>
  },
  {
    name: i18n('tags'),
    content: <div>test2</div>
  }
]

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
            tabs.map((tab, i) => <Radio.Button value={i} key={i}>{tab.name}</Radio.Button>)
          }
        </Radio.Group>
        {tabs[this.store.tabIndex].content}
      </div>
    )
  }
}
