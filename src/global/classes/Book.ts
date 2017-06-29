import * as moment from 'moment'
import { Chapter } from './Chapter'
import { ChapterGroup } from './ChapterGroup'
import { NodeKind } from '../constants'

export class Book {
  kind: NodeKind.BOOK
  color: string
  name: string
  chapters: Array<Chapter | ChapterGroup>
  id: number

  constructor(color: string, name: string) {
    this.color = color
    this.name = name
    this.chapters = []
    this.id = moment().valueOf()
  }

  addChapter(chapter: Chapter) {
    this.chapters.push(chapter)
  }
}
