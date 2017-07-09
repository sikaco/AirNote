import * as moment from 'moment'
import { Chapter, IChapter } from './Chapter'
import { ChapterGroup, IChapterGroup } from './ChapterGroup'
import { NodeKind } from '../constants'

export interface IBook {
  kind: NodeKind.BOOK
  color: string
  name: string
  chapters: Array<IChapter | IChapterGroup>
  readonly id: number
}

export class Book implements IBook {
  kind: NodeKind.BOOK
  color: string
  name: string
  chapters: Array<Chapter | ChapterGroup>
  readonly id: number

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
