import React from 'react'

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

function Documents({ setCurrentState }) {
    return (
        <div>
            <div className='d-flex align-items-center my-4'>
                <p className='m-0 mx-3 blue100 fw-normal'>1. Details</p>
                <img src="/payments/lineH.svg" />
                <p className='m-0 mx-3 blue100 fw-500'>2. Documents</p>
                <img src="/payments/lineH_pending.svg" />
                <p className='m-0 mx-3 grey1 fw-normal'>3. Review</p>
            </div>

            <div className='opacity-50 m-3' onClick={() => setCurrentState("details")} role='button'>
                <img src='/arrows/arrowLeft.svg' width={10} />
                &nbsp; back
            </div>

            <div className='my-4'>
                <p className='m-0'>Attach documents <span className='grey1'>(Optional)</span></p>
                <p className='fw-normal'>You can add your invoice or work contract to your payment request.</p>

                <div className='bg-blue10 d-flex flex-column justify-content-center py-4 border-activeBlue' style={{ borderStyle: "dotted" }}>
                    <div className='d-flex'>
                        <img src="/draganddrop.svg" className='mx-auto' />
                    </div>
                    <p className='fw-normal text-center'>
                        Drag & Drop or <span className='fw-500 blue100'>Browse</span>
                    </p>
                </div>

                <p className='fw-normal grey1 m-0 mt-2'>Accepted Formats: jpg, png, pdf</p>
                <p className='fw-normal grey1'>Max Size: 5MB</p>
            </div>

            <Attachment/>
            <Attachment/>

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
                    <button className='btn fw-500 bg-green100 text-white' onClick={() => setCurrentState("review")}>Next to Details &gt;</button>
                </div>
            </div>
        </div>
    )
}

export default Documents