import { observable, action, computed, useStrict } from 'mobx'
import _ from 'lodash'
import * as moment from 'moment'

import { NoteType, SyncState, NoteActionType } from './constants'
import { Book, Chapter, NoteData } from './classes'
import { mockForUi } from './mock'
useStrict(true)

export * from './classes'
export interface INotesOfTags {
  [tag: string]: number[]
}

export interface ISyncInfo {
  state: SyncState
  lastSyncedTime: moment.Moment
}

export interface INotePath {
  [index: number]: { path: number | string }
}

class AppState {
  @observable allNoteData: NoteData[] = [] // all note contents
  @observable notebooks: Book[] = [] // notebooks
  @observable recents: number[] = []  // collections
  @observable showedNotes: number[] = []  // pages of note
  @observable syncInfo: ISyncInfo = { // sync info
    state: SyncState.DONE,
    lastSyncedTime: null
  }

  @computed get notesInTrash(): number[] {
    const dataWithIndex: {
      deletedTime: moment.Moment
      index: number
    }[] = []

    this.allNoteData.forEach((noteData, i) => {
      if (noteData.deleted) {
        dataWithIndex.push({
          deletedTime: noteData.deletedTime,
          index: i
        })
      }
    })

    return dataWithIndex
      .sort((p, n) => Number(p.deletedTime) - Number(n.deletedTime))
      .map(note => note.index)
  }

  @computed get notesOfTags(): INotesOfTags {
    const notesOfTags: INotesOfTags = {}
    this.allNoteData.forEach((note, i) => {
      note.tags.forEach(tag => {
        notesOfTags[tag] = notesOfTags[tag] || []
        notesOfTags[tag].push(i)
      })
    })

    return notesOfTags
  }

  @computed get showedNoteData(): NoteData[] {
    return this.showedNotes.map(noteIndex => this.allNoteData[noteIndex])
  }

  /**
   * actions
   */

  @action addBook(color: string, name: string) {
    const noteData = new NoteData(NoteType.HTML)
    this.allNoteData.push(noteData)

    // todo: chapterColor should be random in a set
    const chapter = new Chapter('red', '')
    chapter.addNote(this.allNoteData.length - 1)

    const book = new Book(color, name)
    book.addChapter(chapter)

    this.notebooks.push(book)
  }

  /*
   chapters
   */

  /*
   notes
   */

  @action showNotes(notes: number[]) {
    this.showedNotes = notes
  }

  @action addNewNote(noteType: NoteType) {
    const blankNote: NoteData = {
      layer: 0,
      title: 'Untitled Note', // todo: For debug now. After debugged, it will be ''.
      contentType: noteType,
      content: '',
      deleted: false,
      tags: [],
      id: 0
    }

    this.modifyNoteInCurrentChapter(NoteActionType.ADD, null, blankNote)
  }

  @action moveNoteInCurrentChapter(fromI: number, destI: number) {
    if (fromI === destI) { return }
    if (fromI < destI) {
      this.showedNotes.splice(destI, 0, this.showedNotes[fromI])
      this.showedNotes.splice(fromI, 1)
    } else {
      const noteArr = this.showedNotes.splice(fromI, 1)
      this.showedNotes.splice(destI, 0, noteArr[0])
    }
  }

  @action modifyNoteInCurrentChapter(action: NoteActionType, noteI?: number, newNote?: NoteData) {
    let targetNote: NoteData = null

    switch (action) {
      case NoteActionType.ADD:
        this.allNoteData.push(newNote)
        this.showedNotes.push(this.allNoteData.length - 1)
        break
      case NoteActionType.DELETE:
        targetNote = this.allNoteData[this.showedNotes[noteI]]
        targetNote.deleted = true
        targetNote.deletedTime = moment()

        this.showedNotes.splice(noteI, 1)
        break
      case NoteActionType.UPDATE:
        targetNote = this.allNoteData[this.showedNotes[noteI]]
        _.merge(targetNote, newNote)
        break
    }
  }

  @action moveNote(fromPath: INotePath, destPath: INotePath) {
    // todo
  }

  @action modifyNote(action: NoteActionType, notePath: INotePath, newNote?: NoteData) {
    switch (action) {
      case NoteActionType.ADD:
        break
      case NoteActionType.DELETE:
        break
      case NoteActionType.UPDATE:
        break
    }
  }

  constructor() {
    this.getData()
  }

  @action getData() {
    // const {allNoteData, notebooks, recents} = mockForUi
    // this.allNoteData = allNoteData
    // this.notebooks = notebooks
    // this.recents = recents

    // this.syncInfo = {
    //   state: SyncState.DONE,
    //   lastSyncedTime: moment()
    // }
  }
}

export default new AppState()
export { AppState }
