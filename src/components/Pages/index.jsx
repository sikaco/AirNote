import React, { Component } from 'react'
import { observer } from 'mobx-react'

import appState from '../../AppState'
import { i18n } from '../../global/i18nStore'
import { NOTE_TYPE } from '../../global/constants'

const AddPage = observer(() => {
  return (
    <div onClick={() => appState.addNewPage(NOTE_TYPE.HTML)}>
      <span>+</span>{i18n('newPage')}
    </div>
  )
})

const Page = observer(({page}) =>
  <div>
    {page.title}
  </div>
)

const PageList = observer(({pages, appState}) =>
  <div>
    {
      pages.map(pageIndex => <Page page={appState.allNotePages[pageIndex]} key={pageIndex} />)
    }
  </div>
)

const SearchInPages = observer(() =>
  <div>

  </div>
)

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

