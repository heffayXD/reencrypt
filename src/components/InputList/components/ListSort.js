import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const ListSort = props => {
  const { active, direction } = props.sort

  /**
   * Handles click event for sorting
   * @param {string} type
   */
  const handleClick = type => {
    if (type === active) {
      props.handleSort({
        ...props.sort,
        direction: direction === 'asc' ? 'desc' : 'asc'
      })
    } else {
      props.handleSort({
        active: type,
        direction: 'asc'
      })
    }
  }

  return (
    <li id='list-sort'>
      <div className='legend-item' onClick={() => { handleClick('title') }}>
        Title
        <FontAwesomeIcon
          className={`legend-icon ${active === 'title' ? 'active' : ''}`}
          icon={active === 'title' && direction === 'desc' ? faChevronUp : faChevronDown}
        />
      </div>
      <div className='legend-item' onClick={() => { handleClick('username') }}>
        Username
        <FontAwesomeIcon
          className={`legend-icon ${active === 'username' ? 'active' : ''}`}
          icon={active === 'username' && direction === 'desc' ? faChevronUp : faChevronDown}
        />
      </div>
      <div className='legend-item no-hover'>
        Password
      </div>
    </li>
  )
}

export default ListSort
