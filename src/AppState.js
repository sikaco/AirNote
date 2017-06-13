import { observable, action, computed, useStrict } from 'mobx'
import { NOTE_TYPE, CHAPTER_TYPE, COLOR, SYNC_STATE } from './global/constants'
useStrict(true)

class AppState {
  // all note pages
  @observable allNotePages = []

  // notebooks
  @observable notebooks = []

  @action pushChapterToBook(chapter, bookIndex) { // todo: for debug
    this.notebooks[bookIndex].chapters.push(chapter)
  }

  // collections
  @observable recents = []

  @computed get notesInTrash() {
    return this.allNotePages.filter(page => page.deleted)
  }

  @computed get tag2pagesMap() {
    let pagesOfTags = {}
    this.allNotePages.forEach((page, i) => {
      page.tags.forEach(tag => {
        pagesOfTags[tag] = pagesOfTags[tag] || []
        pagesOfTags[tag].push(i)
      })
    })

    return pagesOfTags
  }

  // pages
  @observable showedPages = []

  @action showPages(pages) {
    this.showedPages = pages
  }

  @action addNewPage(noteType) {
    const blankPage = {
      layer: 0,
      title: 'Untitled Note', // todo: need be ''
      contentType: noteType,
      content: '',
      deleted: false,
      tags: [],
      id: 0
    }

    this.allNotePages.push(blankPage)
    this.showedPages.push(this.allNotePages.length - 1)
    console.log(this.showedPages.slice())
  }

  @action spliceShowedPages() {

  }

  // sync info
  @observable syncInfo = {
    state: SYNC_STATE.DONE,
    lastSyncedTime: new Date
  }

  constructor() {
    this.getData()
  }

  @action getData() {
    //TODO: ajax

    this.allNotePages = [
      {
        layer: 0,
        title: 'Hello Notes',
        contentType: NOTE_TYPE.HTML,
        content: 'Your first note',
        deleted: false,
        tags: ['note', 'blog'],
        id: 0   // TODO: every page should has a uniq id
      },
      {
        layer: 1,
        title: 'Hello Notes 2nd',
        contentType: NOTE_TYPE.HTML,
        content: 'Your 2nd note',
        deleted: false,
        tags: ['note']
      },
      {
        layer: 1,
        title: 'Hello Notes 2nd',
        contentType: NOTE_TYPE.HTML,
        content: 'Your 2nd note',
        deleted: false,
        tags: []
      }
    ]

    this.notebooks = [
      {
        color: COLOR.RED,
        name: 'User guide',
        chapters: [
          {
            color: COLOR.BLUE,
            name: 'Air Note',
            type: CHAPTER_TYPE.CHAPTER,
            pages: [0, 1]
          },
          {
            color: COLOR.BLUE,
            name: 'Air Note Group',
            type: CHAPTER_TYPE.GROUP,
            chapters: [
              {
                color: COLOR.BLUE,
                name: 'Air Note',
                type: CHAPTER_TYPE.CHAPTER,
                pages: [2]
              }
            ]
          }
        ]
      }
    ]

    this.recents = [0, 1]
  }
}

export default new AppState()
