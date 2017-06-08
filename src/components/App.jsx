import React, { Component } from 'react'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import Sidebar from './Sidebar'
import Pages from './Pages'
import Note from './Note'
import './app.less'

@observer
export default class App extends Component {
  render() {
    return (
      <div id="app">
        <Sidebar />
        <Pages />
        <Note />

        <DevTools/>
      </div>
    )
  }
}