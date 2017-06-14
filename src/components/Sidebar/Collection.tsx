import * as React from 'react'
import { EventHandler } from 'react'
import { observer } from 'mobx-react'
import { i18n } from '../../stores/I18nStore'
import { ChapterType } from '../../stores/constants'
import appState, { IChapter, IChapterGroup, IBook, INotesOfTags } from '../../stores/AppState'

function CollectionHead(props: {
  icon: string, name: string, onClick: EventHandler<any>, notesNum?: number
}) {
  const {icon, name, onClick, notesNum = -1} = props
  return (
    <div onClick={onClick}>
      <div className="collection-icon">
        <img src={icon} />
      </div>
      <div className="collection-title">{name}</div>
      {notesNum > -1 ? <div className="collection-number">{notesNum}</div> : null}
    </div>
  )
}

function AddNotebooks() {
  return (
    <div>

    </div>
  )
}

function BookHead(props: { color: string, name: string }) {
  const {color, name} = props
  return (
    <div>
      <span className="book-icon" style={{color: color}}>i</span>
      <div className="book-title">{name}</div>
    </div>
  )
}

const Chapter = observer((props: { chapter: IChapter }) => {
  const {chapter} = props
  return (
    <div onClick={() => appState.showNotes(chapter.notes)}>
      <span className="chapter-icon" style={{color: chapter.color}}>i</span>
      <div className="chapter-title">{chapter.name}</div>
    </div>
  )
})

const ChapterGroup = observer((props: { group: IChapterGroup }) => {
  const {group} = props
  return (
    <div>
      <div>
        <span className="chapter-group-icon" style={{color: group.color}}>i</span>
        <div className="chapter-group-title">{group.name}</div>
      </div>
      <Chapters chapters={group.chapters} />
    </div>
  )
})

const Chapters = observer((props: { chapters: Array<IChapter | IChapterGroup> }): any => {
  const {chapters} = props
  return (
    <div>
      {
        chapters.map((chapter, i) => {
          switch (chapter.type) {
            case ChapterType.CHAPTER:
              return <Chapter chapter={chapter as IChapter} key={i} />
            case ChapterType.GROUP:
              return <ChapterGroup group={chapter as IChapterGroup} key={i} />
            default:
              return null
          }
        })
      }
    </div>
  )
})

const Book = observer((props: { book: IBook }) => {
  const {book} = props
  return (
    <div>
      <BookHead color={book.color} name={book.name} />
      <Chapters chapters={book.chapters} />
    </div>
  )
})

const Books = observer((props: { books: IBook[] }) => {
  const {books} = props
  return (
    <div>
      {
        books.map((book, i) => <Book book={book} key={i} />)
      }
    </div>
  )
})

const Collection = observer((props: {
  icon: string, name: string, notes: number[], onClick: EventHandler<any>
}) => {
  const {icon, name, notes, onClick} = props
  return (
    <CollectionHead
      icon={icon} name={name} notesNum={notes.length} onClick={onClick}
    />
  )
})

const CollectionWithBooks = observer((props: {
  icon: string, name: string, books: IBook[]
}) => {
  const {icon, name, books} = props
  const clickHandler = () => {}
  return (
    <div>
      <CollectionHead icon={icon} name={name} onClick={clickHandler} />
      <AddNotebooks />
      <Books books={books} />
    </div>
  )
})

export const Notebooks = observer((props: { appState: any }) => {
  const {appState} = props
  return (
    <div>
      <Collection
        icon="" name={i18n('recents')} notes={appState.recents}
        onClick={() => appState.showNotes(appState.recents)}
      />
      <Collection
        icon="" name={i18n('trash')} notes={appState.notesInTrash}
        onClick={() => appState.showNotes(appState.notesInTrash)}
      />
      <CollectionWithBooks icon="" name={i18n('notebooks')} books={appState.notebooks} />
    </div>
  )
})

const Tag = observer((props: { tag: string, notes: number[] }) => {
  const {tag, notes} = props
  return (
    <div onClick={() => appState.showNotes(notes)}>{tag}</div>
  )
})

export const Tags = observer((props: { notesOfTags: INotesOfTags }) => {
  const {notesOfTags} = props
  return (
    <div>
      {
        Object.keys(notesOfTags).map(tag => {
          return <Tag tag={tag} notes={notesOfTags[tag]} key={tag} />
        })
      }
    </div>
  )
})