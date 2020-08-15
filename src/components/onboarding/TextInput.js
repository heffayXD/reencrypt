import React from 'react'

const TextInput = props => {
  return (
    <div className='text-input'>
      <input
        type={props.type || 'text'}
        value={props.value}
        placeholder={props.placeholder || ''}
        name={props.name || ''}
        onChange={props.onChange}
      />
    </div>
  )
}

export default TextInput
