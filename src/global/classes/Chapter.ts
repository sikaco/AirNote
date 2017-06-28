import * as moment from 'moment'
import { ChapterType } from '../constants'

export class Chapter {
  kind: 'chapter'
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
