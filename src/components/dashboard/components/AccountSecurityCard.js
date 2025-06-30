import React from 'react'

function AccountSecurityCard() {
    return (
        <div className='mx-3 row border p-3 bg-white h-100'>
            <div className='h3'>
                Account security
                <br />
                <span className='h4'>
                Two-Factor Authentication
                </span>
            </div>
            <p className='row grey1 fw-normal'>
                We care about the security of your account. Add two-step authorization and trust the security of your account to us.
            </p>
            <button className='btn bg-grey fw-500 fs-5 p-0 mt-5 mb-2 py-3 px-2 py-md-0 border'>
                Set up Two-Factor Authentication
            </button>
        </div>
    )
}

export default AccountSecurityCard