enum NoteType {HTML, MARK_DOWN}
enum ChapterType {CHAPTER, GROUP}
enum SyncState {DONE, DOING, FAILED}
enum NoteAction {ADD, UPDATE, DELETE}
enum NodeKind {BOOK, CHAPTER, CHAPTER_GROUP, NOTE_DATA}

const Color = {
  BLUE: 'blue',
  RED: 'red',
  BLACK: 'black',
}

export {
  NoteType,
  ChapterType,
  SyncState,
  NoteAction,
  NodeKind,
  Color,
}
