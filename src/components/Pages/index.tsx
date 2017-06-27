import * as React from 'react'
import { observer } from 'mobx-react'
import './index.less'

import { EmptyProps } from '../../types'
import appState, { NoteData } from '../../stores/AppState'
import { i18n } from '../../stores/I18nStore'
import { NoteType } from '../../stores/constants'

const AddPage = observer(() => {
  return (
    <div id="add-page-btn" onClick={() => appState.createNewNote(NoteType.HTML)}>
      <div className="btn-inner">
        <span>+</span>{i18n('newPage')}
      </div>
    </div>
  )
})

const Page = observer((props: { note: NoteData }) => {
  const {note} = props
  return (
    <div className="page-item">
      {note.title}
    </div>
  )
})

const PageList = observer((props: { noteDataList: NoteData[] }) => {
  const {noteDataList} = props
  return (
    <div className="page-list">
      {
        noteDataList.map(note => <Page note={note} key={note.id} />)
      }
    </div>
  )
})

const SearchInPages = observer(() =>
  <div id="search-in-pages">

  </div>
)

@observer
export default class Pages extends React.Component<EmptyProps, void> {
  render() {
    return (
      <div id="pages">
        <AddPage />
        <PageList noteDataList={appState.focusedNoteDataList} />
        <SearchInPages />
      </div>
    )
  }
}
