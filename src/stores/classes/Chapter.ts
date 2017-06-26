import { ChapterType } from '../constants'

export class Chapter {
  color: string
  name: string
  type: ChapterType.CHAPTER
  notes: number[]

  constructor(color: string, name: string) {
    this.color = color
    this.name = name
    this.type = ChapterType.CHAPTER
    this.notes = []
  }

  addNote(note: number) {
    this.notes.push(note)
  }
}
