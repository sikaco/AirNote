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
  arr: Array<NonLeafNode>,
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

function getChapterNode(nodeList: NonLeafNode[], path: NotePath): Chapter {
  let node = getNonLeafNodeByPath(nodeList, path)

  while (node.kind !== NodeKind.CHAPTER) {
    node = getNonLeafNodeByPath(node.chapters, [0])
  }

  return node
}

function getNotesOfNode(node: NonLeafNode): number[] {
  let notes: number[]

  switch (node.kind) {
    case NodeKind.BOOK:
    case NodeKind.CHAPTER_GROUP:
      notes = node.chapters
        .map(chapter => getNotesOfNode(chapter))
        .reduce((p, n) => {
          return p.concat(n)
        }, [])

      break
    case NodeKind.CHAPTER:
      notes = node.notes
      break
  }

  return notes
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
      .sort((p, n) => p.deletedTime.valueOf() - n.deletedTime.valueOf())
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
    newChapter.notes.push(noteIndex)

    const newBook = new Book(color, name)
    newBook.chapters.push(newChapter)

    // mount new notebook and focus first note of it
    this.notebooks.push(newBook)
    this.focusNoteList(newChapter.notes)
    this.focusNote(noteIndex)
  }

  @action createNewNote(noteType: NoteType) {
    const newNote = new NoteData(noteType)
    this.modifyNode(NoteAction.ADD, this.focusedPath, null, newNote)
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

  private addNode(path: NotePath, newNode: Node, index?: number) {
    switch (newNode.kind) {
      case NodeKind.BOOK:
        util.addToList(this.notebooks, newNode, index)
        break
      case NodeKind.CHAPTER_GROUP:
      case NodeKind.CHAPTER:
        const node = getNonLeafNodeByPath(this.notebooks, path)
        switch (node.kind) {
          case NodeKind.BOOK:
          case NodeKind.CHAPTER_GROUP:
            util.addToList(node.chapters, newNode, index)
            break
          case NodeKind.CHAPTER:
            break
          default:
            util.assertNever(node)
        }
        break
      case NodeKind.NOTE_DATA:
        const chapter = getChapterNode(this.notebooks, path)
        const noteIndex = this.addNoteData(newNode)
        util.addToList(chapter.notes, noteIndex, index)
        break
      default:
        util.assertNever(newNode)
    }
  }

  private delNote(index: number) {
    const deletedNoteData = this.allNoteData[index]
    deletedNoteData.deletedTime = moment()
    deletedNoteData.deleted = true
  }

  private delNode(path: NotePath, index: number) {
    const node = getNonLeafNodeByPath(this.notebooks, path)
    switch (node.kind) {
      case NodeKind.BOOK:
      case NodeKind.CHAPTER_GROUP:
        const deletedNode = node.chapters.splice(index, 1)[0]
        getNotesOfNode(deletedNode).map(this.delNote)
        break
      case NodeKind.CHAPTER:
        const deleteNote = node.notes.splice(index, 1)[0]
        this.delNote(deleteNote)
        break
      default:
        util.assertNever(node)
    }
  }

  private updateNode(path: NotePath, index: number, newNode: Node) {
    const superNode = getNonLeafNodeByPath(this.notebooks, path)
    switch (superNode.kind) {
      case NodeKind.BOOK:
      case NodeKind.CHAPTER_GROUP:
        const node = superNode.chapters[index]
        _.merge(node, newNode)
        break
      case NodeKind.CHAPTER:
        const noteData = this.allNoteData[superNode.notes[index]]
        _.merge(noteData, newNode)
        break
      default:
        util.assertNever(superNode)
    }
  }

  @action modifyNode(action: NoteAction, path: NotePath, index?: number, newNode?: Node) {
    switch (action) {
      case NoteAction.ADD:
        this.addNode(path, newNode, index)
        break
      case NoteAction.DELETE:
        this.delNode(path, index)
        break
      case NoteAction.UPDATE:
        this.updateNode(path, index, newNode)
        break
      default:
        util.assertNever(action)
    }
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
    this.recents = recents

    // todo: transform json to class instance if methods are added to classes
    this.notebooks = notebooks as Book[]

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
