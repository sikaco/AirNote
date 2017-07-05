import * as moment from 'moment'
import { ChapterType, NodeKind } from '../constants'
import { Chapter } from './Chapter'

export class ChapterGroup {
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
