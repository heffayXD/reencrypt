import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ListSort from './ListSort'
import ListItem from './ListItem.js'

const InputList = props => {
  const [sort, setSort] = useState({ active: '', direction: 'asc' })
  const { credentials, search } = useSelector(state => {
    return {
      credentials: state.credentials.present,
      search: state.search
    }
  })
  const dispatch = useDispatch()

  /**
   * Handles updating credentials on change
   * @param {object} obj
   */
  const handleChange = obj => {
    dispatch({ type: 'UPDATE_CREDENTIALS', credentials: obj })
  }

  /**
   * Handles deleting credentials
   * @param {int} id
   */
  const handleDelete = id => {
    dispatch({ type: 'DELETE_CREDENTIALS', id })
  }

  /**
   * Handles sorting items
   * @param {object} newSort
   */
  const handleSort = newSort => {
    const sorted = credentials.sort((a, b) => {
      const formattedA = a[newSort.active].toUpperCase()
      const formattedB = b[newSort.active].toUpperCase()

      return formattedA > formattedB ? 1 : -1
    })

    const result = newSort.direction === 'desc' ? sorted.reverse() : sorted

    setSort(newSort)
    dispatch({ type: 'SET_CREDENTIALS', credentials: result })
  }

  /**
   * Retrieves the List Items
   * @return {array}
   */
  const getListItems = () => {
    return credentials.filter(val => {
      if (!search.enabled || !search.value.length) return true

      return (
        val.title.toLowerCase().includes(search.value) ||
        val.username.toLowerCase().includes(search.value) ||
        val.password.toLowerCase().includes(search.value)
      )
    }).map((obj, index) => (
      <ListItem
        key={index}
        credentials={obj}
        setCredentials={handleChange}
        handleDelete={handleDelete}
      />
    ))
  }

  return (
    <ul id='input-list'>
      <ListSort sort={sort} handleSort={handleSort} />
      {getListItems()}
    </ul>
  )
}

export default InputList
