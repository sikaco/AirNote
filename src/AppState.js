import { observable, action, computed } from 'mobx'
import {CHAPTER_TYPE, COLORS} from './global/constants'

class AppState {
  @observable allNotes = []

  @observable notebooks = []
  @observable recents = []
  @computed get notesInTrash() {
    return this.allNotes.filter(page => page.deleted)
  }

  @observable showedPages = []
  @action setShowedPages(pages) {
    this.showedPages = pages
  }

  constructor() {
    this.getData()
  }

  @action getData() {
    //TODO: ajax

    this.allNotes = [
      {
        layer: 0,
        title: 'Hello Notes',
        contentType: 'html',
        content: "Your first note",
        deleted: false
      },
      {
        layer: 1,
        title: 'Hello Notes 2nd',
        contentType: 'html',
        content: "Your 2nd note",
        deleted: false
      },
      {
        layer: 1,
        title: 'Hello Notes 2nd',
        contentType: 'html',
        content: "Your 2nd note",
        deleted: false
      }
    ]

    this.notebooks = [
      {
        color: COLORS.RED,
        name: 'User guide',
        chapters: [
          {
            color: COLORS.BLUE,
            name: 'Air Note',
            type: CHAPTER_TYPE.CHAPTER,
            pages: [0, 1]
          },
          {
            color: COLORS.BLUE,
            name: 'Air Note Group',
            type: CHAPTER_TYPE.GROUP,
            chapters: [
              {
                color: COLORS.BLUE,
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
