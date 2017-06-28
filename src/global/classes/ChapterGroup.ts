import * as moment from 'moment'
import { ChapterType } from '../constants'
import { Chapter } from './Chapter'

export class ChapterGroup {
  kind: 'chapterGroup'
  color: string
  name: string
  type: ChapterType.GROUP
  chapters: Array<Chapter | ChapterGroup>
  id: number

  constructor(color: string, name: string) {
    this.color = color
    this.name = name
    this.type = ChapterType.GROUP
    this.chapters = []
    this.id = moment().valueOf()
  }
}
