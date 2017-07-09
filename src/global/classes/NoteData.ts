import * as moment from 'moment'
import { NoteType, NodeKind } from '../constants'

export interface INoteData {
  kind: NodeKind.NOTE_DATA
  layer: number
  title: string
  contentType: NoteType
  content: string
  deleted: boolean
  deletedTime?: moment.Moment
  tags: string[]
  readonly id: number
}

export class NoteData implements INoteData {
  kind: NodeKind.NOTE_DATA
  layer: number
  title: string
  contentType: NoteType
  content: string
  deleted: boolean
  deletedTime?: moment.Moment
  tags: string[]
  readonly id: number

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
