import { observable, action, computed, useStrict } from 'mobx'
import { NoteType, ChapterType, Color, SyncState } from './constants'
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
  tags: string[]
  id: number
}

export interface INotesOfTags {
  [tag: string]: number[]
}

export interface ISyncInfo {
  state: SyncState
  lastSyncedTime: Date
}

class AppState {
  // all note contents
  @observable allNoteData: INoteData[] = []

  // notebooks
  @observable notebooks: IBook[] = []

  // collections
  @observable recents: number[] = []

  @computed get notesInTrash(): number[] {
    const deletedNotes: number[] = []
    this.allNoteData.forEach((note, i) => {
      if (note.deleted) {
        deletedNotes.push(i)
      }
    })

    return deletedNotes
  }

  @computed get notesOfTags(): INotesOfTags {
    let notesOfTags: INotesOfTags = {}
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

  @action addNewNote(noteType: NoteType): void {
    const blankNote: INoteData = {
      layer: 0,
      title: 'Untitled Note', // todo: need be ''
      contentType: noteType,
      content: '',
      deleted: false,
      tags: [],
      id: 0
    }

    this.allNoteData.push(blankNote)

    // todo: modified notebooks structure

    console.log(this.showedNoteData.slice())
  }

  @action
  private noteCURD() {

  }

  // sync info
  @observable syncInfo: ISyncInfo = {
    state: SyncState.DONE,
    lastSyncedTime: new Date
  }

  constructor() {
    this.getData()
  }

  @action getData(): void {
    //TODO: ajax

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
      }
    ]

    this.notebooks = [
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
    ]

    this.recents = [0, 1]
  }
}

export default new AppState()
