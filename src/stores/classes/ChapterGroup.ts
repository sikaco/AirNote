import { ChapterType } from '../constants'
import { Chapter } from './Chapter'

export class ChapterGroup {
  color: string
  name: string
  type: ChapterType.GROUP
  chapters: Array<Chapter | ChapterGroup>

  constructor(color: string, name: string) {
    this.color = color
    this.name = name
    this.type = ChapterType.GROUP
    this.chapters = []
  }
}
