import * as React from 'react'
import { observer } from 'mobx-react'

import { EmptyProps } from '../../types'
import appState, { INoteData } from '../../stores/AppState'
import { i18n } from '../../stores/I18nStore'
import { NoteType } from '../../stores/constants'

const AddPage = observer(() => {
  return (
    <div onClick={() => appState.addNewNote(NoteType.HTML)}>
      <span>+</span>{i18n('newPage')}
    </div>
  )
})

const Page = observer((props: { note: INoteData }) => {
  const {note} = props
  return (
    <div>
      {note.title}
    </div>
  )
})

const PageList = observer((props: { noteDataList: INoteData[] }) => {
  const {noteDataList} = props
  return (
    <div>
      {
        noteDataList.map(note => <Page note={note} key={note.id} />)
      }
    </div>
  )
})

const SearchInPages = observer(() =>
  <div>

  </div>
)

@observer
export default class Pages extends React.Component<EmptyProps, void> {
  render() {
    return (
      <div id="pages">
        <AddPage />
        <PageList noteDataList={appState.showedNoteData} />
        <SearchInPages />
      </div>
    )
  }
}

