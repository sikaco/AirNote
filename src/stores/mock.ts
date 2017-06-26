import { NoteType, ChapterType, Color, SyncState, NoteActionType } from './constants'
import { Book, NoteData } from './AppState'
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

export const mockForUi: any = {
  notebooks: [
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
    }
  ],
  allNoteData: [
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
  ],
  recents: [0, 1]
}
