import 'regenerator-runtime'
import React from 'react'
import { render } from 'react-dom'
import './scss/index.scss'
import { Provider } from 'react-redux'
import { configureStore } from './store'
import App from './App'

const store = configureStore()

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))
