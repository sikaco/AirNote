import React, {Component} from 'react'
import {observer} from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import Sidebar from './components/Sidebar'
import Pages from './components/Pages'
import Note from './components/Note'

@observer
export default class App extends Component {
  render() {
    return (
      <div>
        <Sidebar />
        <Pages />
        <Note />

        <DevTools/>
      </div>
    )
  }
}