import { observable, action, computed, useStrict } from 'mobx'
import { merge } from 'lodash'
import * as moment from 'moment'
import { NoteType, ChapterType, Color, SyncState, NoteActionType } from './constants'
useStrict(true)

export interface IBook {
  color: string
  name: string
  chapters: Array<IChapter | IChapterGroup>
}

export interface IChapter {
  color: string
  name: string
  type: ChapterType.CHAPTER
  notes: number[]
}

export interface IChapterGroup {
  color: string
  name: string
  type: ChapterType.GROUP
  chapters: Array<IChapter | IChapterGroup>
}

export interface INoteData {
  layer: number
  title: string
  contentType: NoteType
  content: string
  deleted: boolean
  deletedTime?: moment.Moment
  tags: string[]
  id: number
}

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
  // all note contents
  @observable allNoteData: INoteData[] = []

  // notebooks
  @observable notebooks: IBook[] = []

  // collections
  @observable recents: number[] = []

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

  // pages of note
  @observable showedNotes: number[] = []

  @computed get showedNoteData(): INoteData[] {
    return this.showedNotes.map(noteIndex => this.allNoteData[noteIndex])
  }

  @action showNotes(notes: number[]): void {
    this.showedNotes = notes
  }

  // modify note
  @action addNewNote(noteType: NoteType): void {
    const blankNote: INoteData = {
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

  @action modifyNoteInCurrentChapter(action: NoteActionType, noteI?: number, newNote?: INoteData) {
    let targetNote: INoteData = null

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
        merge(targetNote, newNote)
        break
    }
  }

  @action moveNote(fromPath: INotePath, destPath: INotePath) {
    // todo
  }

  @action modifyNote(action: NoteActionType, notePath: INotePath, newNote?: INoteData) {
    switch (action) {
      case NoteActionType.ADD:
        break
      case NoteActionType.DELETE:
        break
      case NoteActionType.UPDATE:
        break
    }
  }

  // sync info
  @observable syncInfo: ISyncInfo = {
    state: SyncState.DONE,
    lastSyncedTime: moment()
  }

  constructor() {
    this.getData()
  }

  @action getData(): void {
    // TODO: ajax

    this.allNoteData = [
      {
        layer: 0,
        title: 'Hello Notes',
        contentType: NoteType.HTML,
        content: 'Your first note',
        deleted: false,
        tags: ['note', 'blog'],
        id: 0   // TODO: every note should has a uniq id
      },
      {
        layer: 1,
        title: 'Hello Notes 2nd',
        contentType: NoteType.HTML,
        content: 'Your 2nd note',
        deleted: false,
        tags: ['note'],
        id: 1
      },
      {
        layer: 1,
        title: 'Hello Notes 2nd',
        contentType: NoteType.HTML,
        content: 'Your 2nd note',
        deleted: false,
        tags: [],
        id: 2
      },
      {
        layer: 1,
        title: 'Hello Notes in trash',
        contentType: NoteType.HTML,
        content: 'Your 2nd note',
        deleted: true,
        deletedTime: moment(),
        tags: [],
        id: 3
      },
    ]

    this.notebooks = [
      {
        color: Color.RED,
        name: 'User guide',
        chapters: [
          {
            color: Color.BLUE,
            name: 'Leanote',
            type: ChapterType.CHAPTER,
            notes: [0, 1]
          },
          {
            color: Color.BLUE,
            name: 'Explore',
            type: ChapterType.CHAPTER,
            notes: [2]
          },
        ]
      },
      {
        color: Color.RED,
        name: 'Start here',
        chapters: []
      },
      {
        color: Color.RED,
        name: 'Summer',
        chapters: []
      },
    ]

    /*this.notebooks = [
     {
     color: Color.RED,
     name: 'User guide',
     chapters: [
     {
     color: Color.BLUE,
     name: 'Air Note',
     type: ChapterType.CHAPTER,
     notes: [0, 1]
     },
     {
     color: Color.BLUE,
     name: 'Air Note Group',
     type: ChapterType.GROUP,
     chapters: [
     {
     color: Color.BLUE,
     name: 'Air Note',
     type: ChapterType.CHAPTER,
     notes: [2]
     }
     ]
     }
     ]
     }
     ]*/

    this.recents = [0, 1]
  }
}

export default new AppState()
export { AppState }
