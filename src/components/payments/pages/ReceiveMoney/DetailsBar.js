import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../structure/CustomText';
import { handleCopy } from '../../../structure/handleCopy';

function DetailsBar({ setShowDetails, handleShow, handleActive }) {

    useEffect(() => {
        function handleKeyPress(event) {
            if (event.key === "Escape") {
                setShowDetails(false); // Call your function when "Esc" is pressed
            }
        }

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);
    
    return (
        <nav className="d-flex bg-white flex-column justify-content-start flex-start p-4 flex-1 border border-top-0 position-relative" id='sidebar'>
            <div className='mt-3 position-relative'>
                <h6 className='text-nowrap me-5'>Request Details</h6>
                <button
                    type="button"
                    className="btn-close btn-sm  position-absolute end-0 top-0 me-2"
                    onClick={() => {
                        handleShow(-1);
                        handleActive(-1);
                        setShowDetails(false);
                    }}
                />
            </div>

            <div className='border p-3 my-3 rounded-2 bg-blue10'>
                <div className='d-flex align-items-center'>
                    <div className='blue100 ms-1 me-4'>#550484684</div>
                    <div className='px-3 py-2 rounded-pill bg-blue100 text-white ms-4 me-1'>Pending</div>
                </div>
                <hr className='blue100' />
                <div>
                    <div className='my-2'>Alexandar McQueen</div>
                    <div className='grey1 fw-normal'>alexmac@gmail.com</div>
                    <div className='grey1 fw-normal'>Due by 14 July, 2023</div>
                </div>
                <hr className='blue100' />
                <div className='text-end'>
                    900.00 USD
                </div>
            </div>

            <button className='btn border rounded-4 mb-3 fw-500 blue100'>
                <img src="/draganddrop.svg" className='me-2' />
                Download
            </button>

            <div className="accordion accordion-flush" id="requestMoneyDetails">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                        <button
                            className="accordion-button collapsed fw-500"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne"
                            aria-expanded="false"
                            aria-controls="flush-collapseOne"
                        >
                            PAYMENT LINK
                        </button>
                    </h2>
                    <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#requestMoneyDetails"
                    >
                        <div className="d-flex my-3">
                            <div className='d-flex border-bottom'>
                                <div className='d-flex'>
                                    <img src="/payments/payment_link.svg" width={40} className='border-end my-auto px-2' />
                                </div>
                                <div className="input-group containertext w-100 h-100">
                                    <CustomTextField value="place your link here" readOnly={true} />
                                </div>
                            </div>
                            <button className='btn bg-blue100 text-white fw-500' onClick={(event) => { handleCopy(event, "place your link here") }}>
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingTwo">
                        <button
                            className="accordion-button btn-accordion collapsed fw-500 text-decoration-none"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseTwo"
                            aria-expanded="false"
                            aria-controls="flush-collapseTwo"
                        >
                            ATTACH DOCUMENTS
                        </button>
                    </h2>
                    <div
                        id="flush-collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingTwo"
                        data-bs-parent="#requestMoneyDetails"
                    >
                        <div className="d-flex my-3 align-items-center justify-content-between bg-blue10 py-2 border rounded-2">
                            <img src="/payments/attachment.svg" width={40} className='px-2' />
                            <p className='fw-500 m-0'>PDF</p>
                            <p className='fw-normal m-0'>Invoice #1-0046</p>
                            <img src="/payments/share.svg" width={40} className='px-2' />
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingThree">
                        <button
                            className="accordion-button collapsed fw-500"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseThree"
                            aria-expanded="false"
                            aria-controls="flush-collapseThree"
                        >
                            HISTORY
                        </button>
                    </h2>
                    <div
                        id="flush-collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingThree"
                        data-bs-parent="#requestMoneyDetails"
                    >
                        <div className="my-3 ms-1">
                            <div className='row'>
                                <img src='/payments/check_double.svg' className='col-1' />
                                <div className='col-9 grey1 ms-2'>
                                    8 July
                                </div>
                            </div>
                            <div className='row'>
                                <img src='/payments/line.svg' className='col-1' />
                                <div className='col-9 ms-2 text-nowrap'>
                                    You sent a payment request
                                </div>
                            </div>

                            <div className='row mt-1'>
                                <img src='/payments/check_double_pending.svg' className='col-1' />
                                <div className='col-9 grey1 ms-2'>
                                    8 July
                                </div>
                            </div>
                            <div className='row mb-1'>
                                <img src='/payments/line_pending.svg' className='col-1' />
                                <div className='col-9 ms-2 text-nowrap'>
                                    Customer sent the payment
                                </div>
                            </div>

                            <div className='row'>
                                <img src='/payments/check_double_pending.svg' className='col-1' />
                                <div className='col-9 grey1 ms-2'>
                                    8 July
                                </div>
                            </div>
                            <div className='row'>
                                <img src='/payments/line_pending.svg' className='col-1' />
                                <div className='col-9 ms-2 text-nowrap'>
                                    Payment deposited
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <button className='btn border rounded-3 my-2 py-3 bg-green100 text-white fw-500'>
                <img src="/payments/markAsPaid.svg" className='me-1' />
                Mark as Paid
            </button>

            <button className='btn border rounded-3 my-2 py-3 fw-500 green100'>
                <img src="/payments/cancelRequest.svg" className='me-1' />
                Cancel Request
            </button>

            <button className='btn border rounded-3 my-2 py-3 fw-500 yellow100'>
                <img src="/payments/notification.svg" className='me-1' />
                Send Reminder
            </button>


        </nav>
    )
}

export default DetailsBar