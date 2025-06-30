import React from 'react'
import PaymentRequestModal from './PaymentRequestModal'

function Attachment() {
    return (
        <div className="d-flex my-3 align-items-center justify-content-between bg-blue10 py-2 border rounded-2">
            <div className='d-flex'>
                <img src="/payments/attachment.svg" width={40} className='px-2 me-2' />
                <p className='fw-500 m-0 me-2'>PDF</p>
                <p className='fw-normal m-0'>Invoice #1-0046</p>
            </div>
            <img src="/delete_blue.svg" width={40} className='px-2' />
        </div>
    )
}

function Review({ setCurrentState }) {
    return (
        <div>
            <div className='d-flex align-items-center my-4'>
                <p className='m-0 mx-3 blue100 fw-normal'>1. Details</p>
                <img src="/payments/lineH.svg" />
                <p className='m-0 mx-3 blue100 fw-normal'>2. Documents</p>
                <img src="/payments/lineH.svg" />
                <p className='m-0 mx-3 blue100 fw-500'>3. Review</p>
            </div>

            <div className='opacity-50 m-3' onClick={() => setCurrentState("documents")} role='button'>
                <img src='/arrows/arrowLeft.svg' width={10} />
                &nbsp; back
            </div>

            <div className='border my-3 pt-3 pb-2 px-4'>
                <p>PAYER</p>
                <div className='d-flex justify-content-between fw-normal'>
                    <p>Name:</p>
                    <p>Alexander McQueen</p>
                </div>
                <div className='d-flex justify-content-between fw-normal'>
                    <p>Email:</p>
                    <p>alexmac@gmail.com</p>
                </div>

                <hr />

                <p>PAYMENT DETAILS</p>
                <div className='d-flex justify-content-between fw-normal'>
                    <p>Request Number:</p>
                    <p className='fw-500'>#1-0046</p>
                </div>
                <div className='d-flex justify-content-between fw-normal'>
                    <p>Due on:</p>
                    <p className='fw-500'>26 July, 2023</p>
                </div>

                <hr />

                <p>ATTACH DOCUMENTS</p>
                <Attachment/>
                <Attachment/>

                <hr />

                <div className='d-flex justify-content-between fw-normal'>
                    <p>Total:</p>
                    <p className='fw-500'>3,500.00 SGD</p>
                </div>
            </div>

            <div className='d-flex justify-content-between mt-4'>
                <div>
                    <button className='btn fw-500 green100 border me-2'>Save as Draft
                        <img src='/payments/save.svg' className='ms-1' />
                    </button>
                    <button className='btn fw-500 yellow100 border me-2'>Delete
                        <img src='/payments/delete.svg' className='ms-1' />
                    </button>
                </div>



                <div>
                    <PaymentRequestModal />
                </div>
            </div>
        </div>
    )
}

export default Review