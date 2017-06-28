import { observable, action, computed, useStrict, toJS } from 'mobx'
import _ from 'lodash'
import * as moment from 'moment'

import { NoteType, SyncState, NoteAction } from './constants'
import { Book, Chapter, ChapterGroup, NoteData } from './classes'
import * as util from './util'
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

type NotePath = Array<number>
type Node = Book | Chapter | ChapterGroup | NoteData

class AppState {
  @observable allNoteData: NoteData[] = [] // all note contents
  @observable notebooks: Book[] = [] // notebooks
  @observable recents: number[] = []  // collections
  @observable syncInfo: ISyncInfo = { // sync info
    state: SyncState.DONE,
    lastSyncedTime: null
  }

  private static setId2NotePathMap(
    arr: Array<Book | ChapterGroup | Chapter>, m: Map<number, NotePath>,
    parentPath: NotePath = []
  ): void {
    arr.forEach((node, i) => {
      const path = parentPath.concat([i])
      m.set(node.id, path)

      let subNodes = (node as Book | ChapterGroup).chapters
      if (subNodes && subNodes.length > 0) {
        this.setId2NotePathMap(subNodes, m, path)
      }
    })
  }

  @computed get id2NotePathMap(): Map<number, NotePath> {
    const m: Map<number, NotePath> = new Map()

    AppState.setId2NotePathMap(toJS(this.notebooks), m)

    return m
  }

  @observable private focusedPath: NotePath = null
  @observable private focusedNoteList: number[] = []  // pages of note
  @computed get focusedNoteDataList(): NoteData[] {
    return this.focusedNoteList.map(noteIndex => this.allNoteData[noteIndex])
  }

  @observable private focusedNote: number = null  // current showed note
  @computed get focusedNoteData(): NoteData {
    return this.allNoteData[this.focusedNote]
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

  /**
   * actions
   */

  @action addBook(color: string, name: string) {  // todo
    const noteData = new NoteData(NoteType.HTML)
    this.allNoteData.push(noteData)
    const noteIndex = this.allNoteData.length - 1

    const newChapter = new Chapter('red', '') // todo: chapterColor should be random in a set
    newChapter.addNote(noteIndex)

    const newBook = new Book(color, name)
    newBook.addChapter(newChapter)

    // mount new notebook and focus first note of it
    this.notebooks.push(newBook)
    this.focusNoteList(newChapter.notes)
    this.focusNote(noteIndex)
  }

  @action createNewNote(noteType: NoteType) {
    const newNote = new NoteData(noteType)
    this.modifyNode(NoteAction.ADD, this.focusedPath, newNote)
  }

  /*
   focus
   */

  @action focusNoteList(notes: number[], currentPath?: NotePath) {
    this.focusedNoteList = notes
    if (currentPath) {
      this.focusedPath = currentPath
    }
  }

  @action focusNote(noteIndex: number) {
    this.focusedNote = noteIndex
  }

  /*
   modified
   */

  @action modifyNode(action: NoteAction, path: NotePath, newNode?: Node) {
    switch (action) {
      case NoteAction.ADD:
        break
      case NoteAction.DELETE:
        break
      case NoteAction.UPDATE:
        break
      default:
        util.assertNever(action)
    }

    let targetNote: NoteData = null

    /*switch (action) {   // todo
     case NoteAction.ADD:
     this.allNoteData.push(newNode)
     this.focusedNoteList.push(this.allNoteData.length - 1)
     break
     case NoteAction.DELETE:
     targetNote = this.allNoteData[this.focusedNoteList[noteI]]
     targetNote.deleted = true
     targetNote.deletedTime = moment()

     this.focusedNoteList.splice(noteI, 1)
     break
     case NoteAction.UPDATE:
     targetNote = this.allNoteData[this.focusedNoteList[noteI]]
     _.merge(targetNote, newNode)
     break
     }*/
  }

  @action moveNode(fromPath: NotePath, toPath: NotePath) {
    /*if (fromI === destI) { return }
     if (fromI < destI) {
     this.focusedNoteList.splice(destI, 0, this.focusedNoteList[fromI])
     this.focusedNoteList.splice(fromI, 1)
     } else {
     const noteArr = this.focusedNoteList.splice(fromI, 1)
     this.focusedNoteList.splice(destI, 0, noteArr[0])
     }*/
  }

  constructor() {
    this.getData()
  }

  @action getData() {
    const {allNoteData, notebooks, recents} = mockForUi
    this.allNoteData = allNoteData
    this.notebooks = notebooks
    this.recents = recents

    this.syncInfo = {
      state: SyncState.DONE,
      lastSyncedTime: moment()
    }
  }
}

export default new AppState()
export { AppState }
