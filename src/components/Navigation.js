import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import CredentialList from '../views/CredentialList'
import Settings from '../views/Settings'
import LoadFile from '../views/LoadFile'
import CreateFile from '../views/CreateFile'
import { useSelector } from 'react-redux'

const Navigation = props => {
  const loaded = useSelector(state => state.config.loaded)

  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          {loaded ? <CredentialList /> : <LoadFile />}
        </Route>
        {loaded ? '' : (
          <Route path='/create'>
            <CreateFile />
          </Route>
        )}
        <Route path='/settings'>
          <Settings />
        </Route>
      </Switch>
    </Router>
  )
}

export default Navigation
