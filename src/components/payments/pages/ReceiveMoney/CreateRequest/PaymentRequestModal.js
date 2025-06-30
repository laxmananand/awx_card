import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../../structure/CustomText'

function PaymentRequestModal() {
    const handleCopy = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            alert('Text copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    };
    return (
        <>
            {/* Button trigger modal */}
                    {/* <button className='btn fw-500 bg-green100 text-white' onClick={() => setCurrentState("")}></button> */}
            <button
                type="button"
                className='btn bg-green100 text-white border w-100 rounded-3 d-flex align-items-center justify-content-center py-2 fw-500'
                data-bs-toggle="modal"
                data-bs-target="#AddNewAccountModal"
            >
                Next to Details &gt;
            </button>
            {/* Modal */}
            <div
                className="modal fade"
                id="AddNewAccountModal"
                tabIndex={-1}
                aria-labelledby="AddNewAccountModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered position-relative">
                    <div className="modal-content p-5">
                        <button
                            type="button"
                            className="btn-close position-absolute end-0 top-0 m-4"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                        <div className='d-flex justify-content-center'>
                            <img src='/payments/requestSuccess.svg' />
                        </div>
                        <div className='d-flex flex-column'>
                            <p className='text-center my-2'>Payment request 9791447 was sent to</p>
                            <h6 className='m-0 bg-light d-inline-block mx-auto border p-2 rounded'>Alexander McQueen</h6>
                        </div>

                        <p className='fw-normal my-3'>Share direct link with your payer</p>
                        <div className="d-flex my-3 w-100">
                            <div className='d-flex border-bottom flex-fill'>
                                <div className='d-flex'>
                                    <img src="/payments/payment_link.svg" width={40} className='border-end my-auto px-2' />
                                </div>
                                <div className="input-group containertext">
                                    <CustomTextField value="place your link here" readOnly={true} />
                                </div>
                            </div>
                            <button className='btn bg-blue100 text-white fw-500' onClick={() => { handleCopy("place your link here") }}>
                                Copy
                            </button>
                        </div>


                        <button className='bg-green100 text-white py-3 my-2 rounded-3 fw-500 btn'>Manage payment requests</button>
                        <button className='border green100 text-white py-3 my-2 rounded-3 fw-500 btn'>Request another payment</button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default PaymentRequestModal