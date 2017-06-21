import * as React from 'react'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import Sidebar from './Sidebar'
import Pages from './Pages'
import Note from './Note'
import i18nStore from '../stores/I18nStore'
import './app.less'

@observer
export default class App extends React.Component<any, void> {
  render() {
    return (
      <div id="app-wrap">
        <div id="app">
          <Sidebar />
          <Pages />
          <Note />
        </div>

        <div className="for-debug">
          <button onClick={() => i18nStore.toggleLanguage()}>Switch language</button>
          <DevTools />
        </div>
      </div>
    )
  }
}