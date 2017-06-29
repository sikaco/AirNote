import * as moment from 'moment'
import { NoteType, NodeKind } from '../constants'

export class NoteData {
  kind: NodeKind.NOTE_DATA
  layer: number
  title: string
  contentType: NoteType
  content: string
  deleted: boolean
  deletedTime?: moment.Moment
  tags: string[]
  id: number

  constructor(contentType: NoteType) {
    this.layer = 0
    this.title = ''
    this.contentType = contentType
    this.content = ''
    this.deleted = false
    this.tags = []
    this.id = moment().valueOf()
  }
}
