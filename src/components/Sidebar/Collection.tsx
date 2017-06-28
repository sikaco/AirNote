import * as React from 'react'
import { MouseEventHandler, ReactChildren, ReactElement, MouseEvent } from 'react'
import { observer } from 'mobx-react'

import { i18n } from '../../global/I18nStore'
import { ChapterType } from '../../global/constants'
import * as util from '../../global/util'
import appState, { Chapter, ChapterGroup, Book, INotesOfTags, AppState } from '../../global/AppState'

function CollectionHead(props: {
  iconClass: string, name: string, onClick: MouseEventHandler<HTMLDivElement>,
  notesNum?: number, children?: ReactChildren
}) {
  const {iconClass, name, onClick, notesNum = -1, children} = props
  return (
    <div className="collection-head" onClick={onClick}>
      <div className="collection-icon">
        <span className={iconClass} />
      </div>
      <div className="collection-title">{name}</div>
      {notesNum > -1 ? <div className="collection-number">{notesNum}</div> : null}
      {children}
    </div>
  )
}

function AddNotebooks() {
  const addBook = () => {
    const notebookName = prompt(i18n('pleaseInputNotebookName'), '')
    if (notebookName !== null) {
      appState.addBook('red', notebookName)
    }
  }

  return (
    <div className="add-notebooks-btn-wrap">
      <div className="add-notebooks-btn" role="button" onClick={addBook}> +</div>
    </div>
  )
}

function BookHead(props: { color: string, name: string, ctxMenuHandler: MouseEventHandler<HTMLDivElement> }) {
  const {color, name, ctxMenuHandler} = props
  return (
    <div className="book-head" onContextMenu={ctxMenuHandler}>
      <span className="book-arrow" />
      <div className="book-icon">
        <span className="" style={{color}} />
      </div>
      <div className="book-title">{name || i18n('untitledNotebook')}</div>
    </div>
  )
}

const ChapterComponent = observer((props: { chapter: Chapter }) => {
  const {chapter} = props
  const clickHandler = () => {
    appState.focusNoteList(chapter.notes, appState.id2NotePathMap.get(chapter.id))
  }

  return (
    <div className="chapter" onClick={clickHandler}>
      <span className="chapter-icon" style={{color: chapter.color}} />
      <div className="chapter-title">{chapter.name || i18n('untitledChapter')}</div>
    </div>
  )
})

const ChapterGroupComponent = observer((props: { group: ChapterGroup }) => {
  const {group} = props
  return (
    <div className="chapter-group">
      <div>
        <span className="chapter-arrow" />
        <span className="chapter-group-icon" style={{color: group.color}} />
        <div className="chapter-group-title">{group.name || i18n('untitledGroup')}</div>
      </div>
      <Chapters chapters={group.chapters} />
    </div>
  )
})

// TS will report errors if not to do this
interface IChaptersProps {
  chapters: Array<Chapter | ChapterGroup>
}
const Chapters = observer((props: IChaptersProps): ReactElement<IChaptersProps> => {
  const {chapters} = props
  return (
    <div className="chapters">
      {
        chapters.map(chapter => {
          switch (chapter.type) {
            case ChapterType.CHAPTER:
              return <ChapterComponent chapter={chapter as Chapter} key={chapter.id} />
            case ChapterType.GROUP:
              return <ChapterGroupComponent group={chapter as ChapterGroup} key={chapter.id} />
            default:
              util.assertNever(chapter)
              return null
          }
        })
      }
    </div>
  )
})

const BookComponent = observer((props: { book: Book }) => {
  const {book} = props

  const ctxMenuHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (e.button === 2) {
      // todo: context menu popup

      // todo: CURD
    }
  }

  return (
    <div className="book">
      <BookHead color={book.color} name={book.name} ctxMenuHandler={ctxMenuHandler} />
      <Chapters chapters={book.chapters} />
    </div>
  )
})

const BookComponentList = observer((props: { books: Book[] }) => {
  const {books} = props
  return (
    <div className="books">
      {
        books.map(book => <BookComponent book={book} key={book.id} />)
      }
    </div>
  )
})

const Collection = observer((props: {
  iconClass: string, name: string, notes: number[], onClick: MouseEventHandler<HTMLDivElement>
}) => {
  const {iconClass, name, notes, onClick} = props
  return (
    <div className="collection">
      <CollectionHead
        iconClass={iconClass} name={name} notesNum={notes.length} onClick={onClick}
      />
    </div>
  )
})

const CollectionWithBooks = observer((props: {
  iconClass: string, name: string, books: Book[]
}) => {
  const {iconClass, name, books} = props
  const clickHandler = () => {
    // todo
  }
  return (
    <div className="collection-with-books">
      <CollectionHead iconClass={iconClass} name={name} onClick={clickHandler}>
        <AddNotebooks />
      </CollectionHead>
      <BookComponentList books={books} />
    </div>
  )
})

export const Notebooks = observer((props: { appState: AppState }) => {
  const {appState} = props
  return (
    <div id="notebooks">
      <Collection
        iconClass="" name={i18n('recents')} notes={appState.recents}
        onClick={() => appState.focusNoteList(appState.recents)}
      />
      <Collection
        iconClass="" name={i18n('trash')} notes={appState.notesInTrash}
        onClick={() => appState.focusNoteList(appState.notesInTrash)  /*todo: add trash path*/}
      />
      <CollectionWithBooks iconClass="" name={i18n('notebooks')} books={appState.notebooks} />
    </div>
  )
})

const Tag = observer((props: { tag: string, notes: number[] }) => {
  const {tag, notes} = props
  return (
    <div className="tag" onClick={() => appState.focusNoteList(notes) /*todo: add tags path*/}>{tag}</div>
  )
})

export const Tags = observer((props: { notesOfTags: INotesOfTags }) => {
  const {notesOfTags} = props
  return (
    <div id="tags">
      {
        Object.keys(notesOfTags).map(tag => {
          return <Tag tag={tag} notes={notesOfTags[tag]} key={tag} />
        })
      }
    </div>
  )
})
