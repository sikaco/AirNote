import React from 'react'
import { observer } from 'mobx-react'
import { i18n } from '../../global/i18nStore'
import { CHAPTER_TYPE } from '../../global/constants'
import appState from '../../AppState'

function CollectionHead({icon, name, pageNum = -1, onClick}) {
  return (
    <div onClick={onClick}>
      <div className="collection-icon">
        <img src={icon} />
      </div>
      <div className="collection-title">{name}</div>
      {pageNum >= 0 ? <div className="collection-number">{pageNum}</div> : null}
    </div>
  )
}

function AddNotebooks() {
  return (
    <div>

    </div>
  )
}

function BookHead({color, name}) {
  return (
    <div>
      <span className="book-icon" style={{color: color}}>i</span>
      <div className="book-title">{name}</div>
    </div>
  )
}

const Chapter = observer(({chapter}) =>
  <div onClick={() => appState.showPages(chapter.pages)}>
    <span className="chapter-icon" style={{color: chapter.color}}>i</span>
    <div className="chapter-title">{chapter.name}</div>
  </div>
)

const ChapterGroup = observer(({group}) =>
  <div>
    <div>
      <span className="chapter-group-icon" style={{color: group.color}}>i</span>
      <div className="chapter-group-title">{group.name}</div>
    </div>
    <Chapters chapters={group.chapters} />
  </div>
)

const Chapters = observer(({chapters}) =>
  <div>
    {
      chapters.map((chapter, i) => {
        switch (chapter.type) {
          case CHAPTER_TYPE.CHAPTER:
            return <Chapter chapter={chapter} key={i} />
          case CHAPTER_TYPE.GROUP:
            return <ChapterGroup group={chapter} key={i} />
          default:
            return null
        }
      })
    }
  </div>
)

const Book = observer(({book}) =>
  <div>
    <BookHead color={book.color} name={book.name} />
    <Chapters chapters={book.chapters} />
  </div>
)

const Books = observer(({books}) =>
  <div>
    {
      books.map((book, i) => <Book book={book} key={i} />)
    }
  </div>
)

const Collection = observer(({icon, name, pages, onClick}) =>
  <CollectionHead
    icon={icon} name={name} pageNum={pages.length} onClick={onClick}
  />
)

const CollectionWithBooks = observer(({icon, name, books}) =>
  <div>
    <CollectionHead icon={icon} name={name} />
    <AddNotebooks />
    <Books books={books} />
  </div>
)

export const Notebooks = observer(({appState}) =>
  <div>
    <Collection
      icon="" name={i18n('recents')} pages={appState.recents}
      onClick={() => appState.showPages(appState.recents)}
    />
    <Collection
      icon="" name={i18n('trash')} pages={appState.notesInTrash}
      onClick={() => appState.showPages(appState.notesInTrash)}
    />
    <CollectionWithBooks icon="" name={i18n('notebooks')} books={appState.notebooks} />
  </div>
)

const Tag = observer(({tag, pages}) =>
  <div onClick={() => appState.showPages(pages)}>{tag}</div>
)

export const Tags = observer(({tag2pagesMap}) =>
  <div>
    {
      Object.keys(tag2pagesMap).map(tag => {
        return <Tag tag={tag} pages={tag2pagesMap[tag]} key={tag} />
      })
    }
  </div>
)