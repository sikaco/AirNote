import { observable, action } from 'mobx'

class AppState {
  @observable allNotePages = []
  @observable notebooks = []

  constructor() {
    this.getData()
  }

  @action getData() {
    //TODO: ajax

    this.allNotePages = [
      {
        layer: 0,
        title: 'Hello Notes',
        contentType: 'html',
        content: "Your first note"
      },
      {
        layer: 1,
        title: 'Hello Notes 2nd',
        contentType: 'html',
        content: "Your 2nd note"
      }
    ]

    this.notebooks = [
      {
        name: 'User guide',
        sub: [
          {
            name: 'Air Note',
            sub: null,
            pages: [0, 1]
          }
        ]
      }
    ]
  }
}

export default new AppState()
