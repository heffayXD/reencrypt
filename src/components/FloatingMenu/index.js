import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './floating-menu.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSave, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

import { useFocus, useSave } from '../../hooks/helpers'

const FloatingMenu = props => {
  const dispatch = useDispatch()
  const focusList = useFocus('credentials-list')
  const focusSearch = useFocus('search', true)
  const handleSave = useSave()
  const { credentials, search } = useSelector(state => {
    return {
      credentials: state.credentials,
      search: state.search
    }
  })

  /**
   * Handles adding a new item
   */
  const handleAdd = () => {
    dispatch({ type: 'ADD_CREDENTIALS', credentials: { title: '', username: '', password: '' } })
  }

  /**
   * Handles the search input
   * @param {object} e
   */
  const handleSearch = e => {
    dispatch({ type: 'UPDATE_SEARCH', value: e.target.value })
  }

  /**
   * Handles checking to see if esc key pressed
   * @param {object} e
   */
  const handleSearchEsc = e => {
    if (e.keyCode !== 27) return

    dispatch({ type: 'ENABLE_SEARCH', enabled: false })
    focusList()
  }

  /**
   * Handles toggling the search
   * @param {object} e
   */
  const handleSearchToggle = e => {
    dispatch({ type: 'ENABLE_SEARCH', enabled: !search.enabled })

    if (!search.enabled) {
      focusSearch()
    }
  }

  return (
    <div id='floating-menu'>
      {credentials.unsaved ? (
        <div className='floating-save button' title='Save' onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} />
          <div className='overlay dp01' />
        </div>
      ) : ''}
      {search.enabled ? (
        <div className='floating-search' title='Search'>
          <input
            id='search'
            name='search'
            type='text'
            value={search.value}
            onChange={handleSearch}
            onKeyDown={handleSearchEsc}
          />
          <div className='overlay dp02' />
        </div>
      ) : ''}
      <div className='floating-search-toggle button' title={search.enabled ? 'Close Search' : 'Open Search'} onClick={handleSearchToggle}>
        <FontAwesomeIcon icon={search.enabled ? faTimes : faSearch} />
        <div className='overlay dp02' />
      </div>
      {!search.enabled ? (
        <div className='floating-add button' title='Add' onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} />
          <div className='overlay dp02' />
        </div>
      ) : ''}
    </div>
  )
}

export default FloatingMenu
