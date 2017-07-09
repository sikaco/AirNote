import { NoteType, ChapterType, Color, SyncState, NoteAction, NodeKind } from './constants'
import { IBook, INoteData } from './classes'
import * as moment from 'moment'

const complexNoteBooks = [
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

interface MockData {
  notebooks: IBook[]
  allNoteData: INoteData[]
  recents: number[]
}

export const mockForUi: MockData = {
  notebooks: [
    {
      kind: NodeKind.BOOK,
      color: Color.RED,
      name: 'User guide',
      id: 1,
      chapters: [
        {
          kind: NodeKind.CHAPTER,
          color: Color.BLUE,
          name: 'Leanote',
          type: ChapterType.CHAPTER,
          id: 2,
          notes: [0, 1]
        },
        {
          kind: NodeKind.CHAPTER,
          color: Color.BLUE,
          name: 'Explore',
          type: ChapterType.CHAPTER,
          id: 3,
          notes: [2]
        },
      ]
    },
    {
      kind: NodeKind.BOOK,
      color: Color.RED,
      name: 'Start here',
      id: 4,
      chapters: []
    },
    {
      kind: NodeKind.BOOK,
      color: Color.RED,
      name: 'Summer',
      id: 5,
      chapters: []
    }
  ],
  allNoteData: [
    {
      kind: NodeKind.NOTE_DATA,
      layer: 0,
      title: 'Hello Notes',
      contentType: NoteType.HTML,
      content: 'Your first note',
      deleted: false,
      tags: ['note', 'blog'],
      id: 6
    },
    {
      kind: NodeKind.NOTE_DATA,
      layer: 1,
      title: 'Hello Notes 2nd',
      contentType: NoteType.HTML,
      content: 'Your 2nd note',
      deleted: false,
      tags: ['note'],
      id: 7
    },
    {
      kind: NodeKind.NOTE_DATA,
      layer: 1,
      title: 'Hello Notes 2nd',
      contentType: NoteType.HTML,
      content: 'Your 2nd note',
      deleted: false,
      tags: [],
      id: 8
    },
    {
      kind: NodeKind.NOTE_DATA,
      layer: 1,
      title: 'Hello Notes in trash',
      contentType: NoteType.HTML,
      content: 'Your 2nd note',
      deleted: true,
      deletedTime: moment(),
      tags: [],
      id: 9
    },
  ],
  recents: [0, 1]
}
