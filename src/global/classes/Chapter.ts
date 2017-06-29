import * as moment from 'moment'
import { ChapterType, NodeKind } from '../constants'

export class Chapter {
  kind: NodeKind.CHAPTER
  color: string
  name: string
  type: ChapterType.CHAPTER
  notes: number[]
  id: number

  constructor(color: string, name: string) {
    this.color = color
    this.name = name
    this.type = ChapterType.CHAPTER
    this.notes = []
    this.id = moment().valueOf()
  }

  addNote(note: number) {
    this.notes.push(note)
  }
}
