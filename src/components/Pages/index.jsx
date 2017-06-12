import React, { Component } from 'react'
import { observer } from 'mobx-react'

import appState from '../../AppState'
import { i18n } from '../../global/i18nStore'
import { NOTE_TYPE } from '../../global/constants'

function AddPage() {
  const blankPage = {
    layer: 0,
    title: 'Untitled Note', // todo
    contentType: NOTE_TYPE.HTML,
    content: '',
    deleted: false,
    tags: [],
    id: 0
  }

  return (
    <div onClick={() => {
      appState.pushToShowedPages(blankPage)
    }}>
      <span>+</span>{i18n('newPage')}
    </div>
  )
}

function Page({page}) {
  return (
    <div>
      {page.title}
    </div>
  )
}

function PageList({pages, appState}) {
  return (
    <div>
      {
        pages.map(pageIndex => <Page page={appState.allNotePages[pageIndex]} key={pageIndex} />)
      }
    </div>
  )
}

function SearchInPages() {
  return (
    <div>

    </div>
  )
}

@observer
export default class Pages extends Component {
  render() {
    return (
      <div id="pages">
        <AddPage />
        <PageList pages={appState.showedPages} appState={appState} />
        <SearchInPages />
      </div>
    )
  }
}

