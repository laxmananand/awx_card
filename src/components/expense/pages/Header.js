import React from 'react'

function Header() {
  return (
    <div className='bg-yellow10 p-3 m-3 rounded-3 d-flex align-items-center'>
      <img src="/lock_1.svg"/>
      <h6 className='me-auto my-0 ms-2'>Add business details to Activate Your Account and unlock all the features</h6>
      <button className='btn bg-white yellow100 ms-3'>ACTIVATE ACCOUNT</button>
    </div>
  )
}

export default Header