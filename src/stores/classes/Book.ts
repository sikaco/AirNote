import { Chapter } from './Chapter'
import { ChapterGroup } from './ChapterGroup'

export class Book {
  color: string
  name: string
  chapters: Array<Chapter | ChapterGroup>

  constructor(color: string, name: string) {
    this.color = color
    this.name = name
    this.chapters = []
  }

  addChapter(chapter: Chapter) {
    this.chapters.push(chapter)
  }
}
