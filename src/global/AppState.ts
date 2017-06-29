import { observable, action, computed, useStrict, toJS } from 'mobx'
import _ from 'lodash'
import * as moment from 'moment'

import { NoteType, SyncState, NoteAction, NodeKind } from './constants'
import { Book, Chapter, ChapterGroup, NoteData } from './classes'
import * as util from './util'
import { mockForUi } from './mock'
useStrict(true)

interface INotesOfTags {
  [tag: string]: number[]
}

interface ISyncInfo {
  state: SyncState
  lastSyncedTime: moment.Moment
}

type NotePath = Array<number>
type NonLeafNode = Book | Chapter | ChapterGroup
type Node = NonLeafNode | NoteData
type Id2PathMap = Map<number, NotePath>


// todo: will be optimised
function getId2NotePathMap(
  arr: Array<Book | ChapterGroup | Chapter>,
  map: Id2PathMap = new Map(),
  parentPath: NotePath = []
): Id2PathMap {
  // `for` faster then `forEach`
  for (let i = 0, len = arr.length; i < len; i++) {
    const path = parentPath.concat([i])
    const node = arr[i]
    map.set(node.id, path)

    let subNodes = (node as Book | ChapterGroup).chapters
    if (subNodes && subNodes.length > 0) {
      getId2NotePathMap(subNodes, map, path)
    }
  }

  return map
}

function getNonLeafNodeByPath(arr: Array<NonLeafNode>, path: NotePath): NonLeafNode {
  let subArr: Array<NonLeafNode> = arr
  let node: NonLeafNode

  for (let i = 0, len = path.length; i < len; i++) {
    node = subArr[path[i]]
    switch (node.kind) {
      case NodeKind.BOOK:
      case NodeKind.CHAPTER_GROUP:
        subArr = node.chapters
        break
      case NodeKind.CHAPTER:
        // the most deep in CHAPTER
        return node
      default:
        util.assertNever(node)
    }
  }

  return node
}

class AppState {
  @observable allNoteData: NoteData[] = [] // all note contents
  @observable notebooks: Book[] = [] // notebooks
  @observable recents: number[] = []  // collections
  @observable syncInfo: ISyncInfo = { // sync info
    state: SyncState.DONE,
    lastSyncedTime: null
  }

  @computed get id2NotePathMap(): Id2PathMap {
    return getId2NotePathMap(toJS(this.notebooks))
  }

  @observable private focusedPath: NotePath = null
  @observable private focusedNoteList: number[] = []  // pages of note
  @computed get focusedNoteDataList(): NoteData[] {
    return this.focusedNoteList.map(noteIndex => this.allNoteData[noteIndex])
  }

  @observable private focusedNote: number = null  // current showed note
  @computed get focusedNoteData(): NoteData {
    return this.allNoteData[this.focusedNote]
  }

  @computed get notesInTrash(): number[] {
    const dataWithIndex: {
      deletedTime: moment.Moment
      index: number
    }[] = []

    this.allNoteData.forEach((noteData, i) => {
      if (noteData.deleted) {
        dataWithIndex.push({
          deletedTime: noteData.deletedTime,
          index: i
        })
      }
    })

    return dataWithIndex
      .sort((p, n) => Number(p.deletedTime) - Number(n.deletedTime))
      .map(note => note.index)
  }

  @computed get notesOfTags(): INotesOfTags {
    const notesOfTags: INotesOfTags = {}
    this.allNoteData.forEach((note, i) => {
      note.tags.forEach(tag => {
        notesOfTags[tag] = notesOfTags[tag] || []
        notesOfTags[tag].push(i)
      })
    })

    return notesOfTags
  }

  /**
   * actions
   */

  @action addBook(color: string, name: string) {  // todo
    const noteIndex = this.addNoteData(new NoteData(NoteType.HTML))

    const newChapter = new Chapter('red', '') // todo: chapterColor should be random in a set
    newChapter.addNote(noteIndex)

    const newBook = new Book(color, name)
    newBook.addChapter(newChapter)

    // mount new notebook and focus first note of it
    this.notebooks.push(newBook)
    this.focusNoteList(newChapter.notes)
    this.focusNote(noteIndex)
  }

  @action createNewNote(noteType: NoteType) {
    const newNote = new NoteData(noteType)
    this.modifyNode(NoteAction.ADD, this.focusedPath, newNote)
  }

  /*
   focus
   */

  @action focusNoteList(notes: number[], currentPath?: NotePath) {
    this.focusedNoteList = notes
    if (currentPath) {
      this.focusedPath = currentPath
    }
  }

  @action focusNote(noteIndex: number) {
    this.focusedNote = noteIndex
  }

  /*
   modified
   */

  private addNoteData(note: NoteData): number {
    this.allNoteData.push(note)
    return this.allNoteData.length - 1
  }

  private getChapterNode(path: NotePath): Chapter {
    let node = getNonLeafNodeByPath(this.notebooks, path)
    while (node.kind !== NodeKind.CHAPTER) {
      node = getNonLeafNodeByPath(node.chapters, [0])
    }

    return node
  }

  private addNode(path: NotePath, newNode: Node) {
    switch (newNode.kind) {
      case NodeKind.BOOK:
        this.notebooks.push(newNode)
        break
      case NodeKind.CHAPTER_GROUP:
      case NodeKind.CHAPTER:
        const node = getNonLeafNodeByPath(this.notebooks, path)
        switch (node.kind) {
          case NodeKind.BOOK:
          case NodeKind.CHAPTER_GROUP:
            node.chapters.push(newNode)
            break
          case NodeKind.CHAPTER:
            break
          default:
            util.assertNever(node)
        }

        break
      case NodeKind.NOTE_DATA:
        const chapter = this.getChapterNode(path)
        const noteIndex = this.addNoteData(newNode)
        chapter.notes.push(noteIndex)
        break
      default:
        util.assertNever(newNode)
    }
  }

  @action modifyNode(action: NoteAction, path: NotePath, newNode?: Node) {
    switch (action) {
      case NoteAction.ADD:
        this.addNode(path, newNode)
        break
      case NoteAction.DELETE:
        break
      case NoteAction.UPDATE:
        break
      default:
        util.assertNever(action)
    }

    let targetNote: NoteData = null
    /*
    switch (action) {   // todo
      case NoteAction.ADD:
        this.allNoteData.push(newNode)
        this.focusedNoteList.push(this.allNoteData.length - 1)
        break
      case NoteAction.DELETE:
        targetNote = this.allNoteData[this.focusedNoteList[noteI]]
        targetNote.deleted = true
        targetNote.deletedTime = moment()

        this.focusedNoteList.splice(noteI, 1)
        break
      case NoteAction.UPDATE:
        targetNote = this.allNoteData[this.focusedNoteList[noteI]]
        _.merge(targetNote, newNode)
        break
    }
    */
  }

  @action moveNode(fromPath: NotePath, toPath: NotePath) {
    /*
    if (fromI === destI) { return }
    if (fromI < destI) {
      this.focusedNoteList.splice(destI, 0, this.focusedNoteList[fromI])
      this.focusedNoteList.splice(fromI, 1)
    } else {
      const noteArr = this.focusedNoteList.splice(fromI, 1)
      this.focusedNoteList.splice(destI, 0, noteArr[0])
    }
    */
  }

  constructor() {
    this.getData()
  }

  @action getData() {
    const {allNoteData, notebooks, recents} = mockForUi
    this.allNoteData = allNoteData
    this.notebooks = notebooks
    this.recents = recents

    this.syncInfo = {
      state: SyncState.DONE,
      lastSyncedTime: moment()
    }
  }
}

export * from './classes'
export default new AppState()
export {
  AppState,
  INotesOfTags,
  ISyncInfo
}
