import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Login from '../views/Login'

const Navigation = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        {/* <Route path='/settings'>

        </Route> */}
      </Switch>
    </Router>
  )
}

export default Navigation
