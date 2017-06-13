import React, { Component } from 'react'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import Sidebar from './Sidebar'
import Pages from './Pages'
import Note from './Note'
import i18nStore from '../global/i18nStore'
import appState from '../AppState'
import { COLOR, CHAPTER_TYPE } from '../global/constants'
import './app.less'

@observer
export default class App extends Component {
  static pushChapter() {
    const chapter = {
      color: COLOR.BLUE,
      name: 'Air Note',
      type: CHAPTER_TYPE.CHAPTER,
      pages: [0, 1]
    }

    appState.pushChapterToBook(chapter, 0)
  }

  render() {
    return (
      <div>
        <div id="app">
          <Sidebar />
          <Pages />
          <Note />
        </div>

        <div className="for-debug">
          <button onClick={() => i18nStore.toggleLanguage()}>Switch language</button>
          <button onClick={App.pushChapter}>push chapter</button>
        </div>
        <DevTools />
      </div>
    )
  }
}