import React, { Component } from 'react'
import { observer } from 'mobx-react'
import appState from '../../AppState'

function AddPage() {
  return (
    <div>

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
        pages.map(pageIndex => <Page page={appState.allNotePages[pageIndex]} key={pageIndex}/>)
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
        <AddPage/>
        <PageList pages={appState.showedPages} appState={appState}/>
        <SearchInPages/>
      </div>
    )
  }
}

