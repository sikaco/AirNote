import * as moment from 'moment'
import { ChapterType, NodeKind } from '../constants'
import { Chapter, IChapter } from './Chapter'

export interface IChapterGroup {
  kind: NodeKind.CHAPTER_GROUP
  color: string
  name: string
  type: ChapterType.GROUP
  chapters: Array<IChapter | IChapterGroup>
  readonly id: number
}

export class ChapterGroup implements IChapterGroup {
  kind: NodeKind.CHAPTER_GROUP
  color: string
  name: string
  type: ChapterType.GROUP
  chapters: Array<Chapter | ChapterGroup>
  readonly id: number

  constructor(color: string, name: string) {
    this.color = color
    this.name = name
    this.type = ChapterType.GROUP
    this.chapters = []
    this.id = moment().valueOf()
  }
}
