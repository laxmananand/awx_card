import React from 'react'
import CustomDate from '../../structure/CustomDate'
import CustomSelect from '../../structure/CustomSelect'

function  Billdetails({ setCurrentState }) {
    return (
        <div>
            <div className='d-flex align-items-center my-4'>
                <p className='m-0 mx-3 blue100 fw-500'>1. Details</p>
                <img src="/payments/lineH_pending.svg" />
                <p className='m-0 mx-3 grey1 fw-normal'>2. Documents</p>
                <img src="/payments/lineH_pending.svg" />
                <p className='m-0 mx-3 grey1 fw-normal'>3. Review</p>
            </div>

            <div className='d-flex'>
                <div className='d-flex border-bottom mb-4 w-50 me-2'>
                    <div className='d-flex'>
                        <img src="/payments/requestNumber.svg" width={40} className='border-end my-auto px-2' />
                    </div>
                    <div className="input-group containertext w-100 h-100">
                        <p>abcd</p>
                    </div>
                </div>

                <div className='d-flex border-bottom mb-4 w-50 ms-2'>
                    <div className='d-flex'>
                        <img src="/payments/money.svg" width={40} className='border-end my-auto px-2' />
                    </div>
                    <div className="input-group containertext w-100 h-100">
                        <div className="w-25">
                            <CustomSelect placeholder="SBD" />
                        </div>
                        <p>abcd</p>
                    </div>
                </div>
            </div>

            <div className='d-flex'>
                <CustomDate className="border-bottom w-50 me-2" label="Due Date" />
                <CustomDate className="border-bottom w-50 ms-2" label="Expiry Date" />
            </div>
            <div className='my-4'>
                <p>abcd</p>
            </div>

            <div className='d-flex justify-content-between mt-5'>
                <div>
                    <button className='btn fw-500 green100 border me-2'>Save as Draft
                        <img src='/payments/save.svg' className='ms-1' />
                    </button>
                    <button className='btn fw-500 yellow100 border me-2'>Delete
                        <img src='/payments/delete.svg' className='ms-1' />
                    </button>
                </div>

                <div>
                    <button className='btn fw-500 bg-green100 text-white' onClick={() => setCurrentState("documents")}>Next to Details &gt;</button>
                </div>
            </div>
        </div>
    )
}

export default Billdetails