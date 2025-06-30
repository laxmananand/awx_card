import React from 'react'
import { useDispatch } from 'react-redux'
import { closeLoader, openLoader } from '../@redux/features/common'

function LoaderTest() {
  const dispatch = useDispatch()

  const APICall = () => {
    //loader start
    dispatch(openLoader())

    // API Call goes here
    setTimeout(() => {

      //after receiving response just write this line of code
      //loader end
      dispatch(closeLoader())
    }, 3000)
  }

  return (
    <div>

      <button onClick={APICall}>Api Call</button>

    </div>
  )
}

export default LoaderTest