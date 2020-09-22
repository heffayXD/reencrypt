import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Login from '../views/Login'
import Credentials from '../views/Credentials'

const Navigation = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <Route path='/credentials'>
          <Credentials />
        </Route>
      </Switch>
    </Router>
  )
}

export default Navigation
