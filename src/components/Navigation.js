import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Toolbar from './Toolbar'
import Login from '../views/Login'
import Credentials from '../views/Credentials'
import Settings from '../views/Settings'

const Navigation = () => {
  return (
    <Router>
      <Toolbar />
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <Route path='/credentials'>
          <Credentials />
        </Route>
        <Route path='/settings'>
          <Settings />
        </Route>
      </Switch>
    </Router>
  )
}

export default Navigation
