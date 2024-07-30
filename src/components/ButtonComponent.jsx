import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonComponent = ({onClick, text, disabled}) => {
  return (
    <div className='text-center p-3'>
        <Button variant='dark' disabled={disabled} onClick={onClick} >{text}</Button>
    </div>
  )
}

export default ButtonComponent;