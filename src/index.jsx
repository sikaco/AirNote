import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'
import appState from './AppState'

function renderApp(App, appState) {
  render(
    <AppContainer>
      <App appState={appState}/>
    </AppContainer>,
    document.getElementById('root')
  )
}

renderApp(App, appState)

if (module.hot) {
  module.hot.accept()
}
