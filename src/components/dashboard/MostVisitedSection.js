import React from 'react'
import { Link } from 'react-router-dom'

function MostVisitedSection() {
    return (
        <div className='m-3 p-3 border bg-white'>
            <div className='d-flex align-items-center'>
                <img src='/mostVisitSection.svg' className='me-2' />
                Most visited sections

            </div>

            <div className='d-flex mt-3 overflow-auto'>
                <Link to="/expense/corporate-cards" className='text-decoration-none d-flex flex-column justify-content-center bg-light m-2 p-3'>
                    <div className='mx-auto'>
                        <img className='bg-yellow10 p-2 rounded m-2' src="/expense/cards.svg" />
                    </div>
                    <p className='text-center text-dark m-0'>Corporate Cards</p>
                </Link>
                <Link to="/payments/beneficiaries" className='text-decoration-none text-dark d-flex flex-column justify-content-center bg-light m-2 p-3'>
                    <div className='mx-auto'>
                        <img className='bg-blue10 p-2 rounded m-2' src="/payments/beneficiaries.svg" />
                    </div>
                    <p className='text-center m-0'>Beneficiaries</p>
                </Link>
                <Link to="/expense/bills" className='text-decoration-none text-dark d-flex flex-column justify-content-center bg-light m-2 p-3'>
                    <div className='mx-auto'>
                        <img className='bg-green10 p-2 rounded m-2' src="/expense/bills.svg" />
                    </div>
                    <p className='text-center m-0'>Bills</p>
                </Link>
                <Link to="/expense/invoices" className='text-decoration-none text-dark d-flex flex-column justify-content-center bg-light m-2 p-3'>
                    <div className='mx-auto'>
                        <img className='bg-blue10 p-2 rounded m-2' src="/expense/invoices.svg" />
                    </div>
                    <p className='text-center m-0'>Invoices</p>
                </Link>
            </div>
        </div>
    )
}

export default MostVisitedSection