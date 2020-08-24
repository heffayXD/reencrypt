import React from 'react'

const Modal = props => {
  const { hidden, setHidden } = props

  const handleExit = e => {
    console.log('clicked')
    setHidden(true)
  }

  return (
    <div className={hidden ? 'modal hidden' : 'modal'}>
      <div className='modal-content'>
        {props.children}
      </div>
      <div className='modal-overlay' onClick={handleExit} />
    </div>
  )
}

export default Modal
