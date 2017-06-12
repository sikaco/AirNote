import { observable, action, computed, useStrict } from 'mobx'
import { NOTE_TYPE, CHAPTER_TYPE, COLOR, SYNC_STATE } from './global/constants'
useStrict(true)

class AppState {
  // all note pages
  @observable allNotePages = []

  // collections
  @observable notebooks = []
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

  // showed pages
  @observable showedPages = []

  @action setShowedPages(pages) {
    this.showedPages = pages
  }

  @action pushToShowedPages(...newPage) {
    console.log(...newPage)
    this.showedPages.push(...newPage)
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
