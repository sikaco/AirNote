import React from 'react'
import { i18n } from "../../global/i18nStore"
import { CHAPTER_TYPE } from '../../global/constants'
import appState from '../../AppState'

function CollectionHead({icon, name, pageNum = -1, onClick}) {
  return (
    <div onClick={onClick}>
      <div className="collection-icon">
        <img src={icon}/>
      </div>
      <div className="collection-title">{name}</div>
      {
        pageNum >= 0 ? <div className="collection-number">{pageNum}</div> : null
      }
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

function Chapter({chapter}) {
  return (
    <div onClick={() => {
      appState.setShowedPages(chapter.pages)
    }}>
      <span className="chapter-icon" style={{color: chapter.color}}>i</span>
      <div className="chapter-title">{chapter.name}</div>
    </div>
  )
}

function ChapterGroup({group}) {
  return (
    <div>
      <div>
        <span className="chapter-group-icon" style={{color: group.color}}>i</span>
        <div className="chapter-group-title">{group.name}</div>
      </div>
      <Chapters chapters={group.chapters}/>
    </div>
  )
}

function Chapters({chapters}) {
  return (
    <div>
      {
        chapters.map((chapter, i) => {
          switch (chapter.type) {
            case CHAPTER_TYPE.CHAPTER:
              return <Chapter chapter={chapter} key={i}/>
            case CHAPTER_TYPE.GROUP:
              return <ChapterGroup group={chapter} key={i}/>
            default:
              return null
          }
        })
      }
    </div>
  )
}

function Book({book}) {
  return (
    <div>
      <BookHead color={book.color} name={book.name}/>
      <Chapters chapters={book.chapters}/>
    </div>
  )
}

function Books({books}) {
  return (
    <div>
      {
        books.map((book, i) => <Book book={book} key={i}/>)
      }
    </div>
  )
}

function Collection({icon, name, pages, onClick}) {
  return <CollectionHead icon={icon} name={name} pageNum={pages.length} onClick={onClick}/>
}

function CollectionWithBooks({icon, name, books}) {
  return (
    <div>
      <CollectionHead icon={icon} name={name}/>
      <AddNotebooks/>
      <Books books={books}/>
    </div>
  )
}

export function Notebooks({appState}) {
  return (
    <div>
      <Collection
        icon="" name={i18n('recents')} pages={appState.recents}
        onClick={() => {
          appState.setShowedPages(appState.recents)
        }}
      />
      <Collection
        icon="" name={i18n('trash')} pages={appState.notesInTrash}
        onClick={() => {
          appState.setShowedPages(appState.notesInTrash)
        }}
      />
      <CollectionWithBooks icon="" name={i18n('notebooks')} books={appState.notebooks}/>
    </div>
  )
}

function Tag({tag, pages}) {
  return (
    <div onClick={() => appState.setShowedPages(pages)}>{tag}</div>
  )
}

export function Tags({tag2pagesMap}) {
  return (
    <div>
      {
        Object.keys(tag2pagesMap).map(tag => {
          return <Tag tag={tag} pages={tag2pagesMap[tag]} key={tag}/>
        })
      }
    </div>
  )
}