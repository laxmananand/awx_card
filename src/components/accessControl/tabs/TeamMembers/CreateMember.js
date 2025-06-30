import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../structure/CustomText';
import CustomSelect from '../../../structure/CustomSelect';
import NumberField from '../../../structure/NumberField';
// import CustomSelect from './CustomSelect'

function CreateMember({autoOpen}) {

    useEffect(()=>{
        if(autoOpen) {
            document.getElementById("newTeamMember").click()
        }
    }, [autoOpen])

    return (
        <>
            {/* Button trigger modal */}
            <button
                type="button"
                className='btn bg-blue100 text-white border w-100 rounded-3 d-flex align-items-center justify-content-center py-2 fw-500'
                data-bs-toggle="modal"
                data-bs-target="#AddNewAccountModal"
                id='newTeamMember'
            >
                <span className='h3 m-0'>+&nbsp;</span>
                New Team Member
            </button>
            {/* Modal */}
            <div
                className="modal fade"
                id="AddNewAccountModal"
                tabIndex={-1}
                aria-labelledby="AddNewAccountModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content p-5 text-center">
                        <div className='d-flex justify-content-between my-2'>
                            <h5 className='text-dark'>
                                Add Team Member
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>


                        <div className='d-flex my-2'>
                            <img src='/payments/createBeneficiaries.svg' className='mx-auto' />
                        </div>

                        <>

                            <h5 className='text-dark mb-4'>Member Info</h5>

                            <form className='overflow-auto border py-3 px-2 rounded-4' style={{ maxHeight: "50vh" }}>
                                <div className='d-flex'>
                                    <div className='d-flex border-bottom mb-4 w-50 me-1'>
                                        <div className='d-flex'>
                                            <img src="/payments/name.svg" width={40} className='border-end my-auto px-2' />
                                        </div>
                                        <div className="input-group containertext w-100 h-100">
                                            <CustomTextField label={"Name"} />
                                        </div>
                                    </div>

                                    <div className='d-flex border-bottom mb-4 w-50 ms-1'>
                                        <div className='d-flex'>
                                            <img src="/payments/email.svg" width={40} className='border-end my-auto px-2' />
                                        </div>
                                        <div className="input-group containertext w-100 h-100">
                                            <CustomTextField label={"Email"} />
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex'>
                                    <div className='d-flex mb-4 w-100 me-1'>
                                        <div className='d-flex border-bottom'>
                                            <img src="/payments/phone.svg" width={40} className='border-end my-auto px-2' />
                                        </div>
                                        <div className="input-group containertext w-100 h-100 d-flex flex-nowrap">
                                            <div className="w-25 border-bottom">
                                                <CustomSelect placeholder="Code" />
                                            </div>
                                            <CustomTextField label="Phone" className="ms-2  w-75 border-bottom" />
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex'>
                                    <div className='d-flex border-bottom mb-4 w-100 me-1'>
                                        <div className='d-flex'>
                                            <img src="/payments/iban.svg" width={40} className='border-end my-auto px-2' />
                                        </div>
                                        <div className="input-group containertext w-100 h-100">
                                            <CustomTextField label="Role" />
                                        </div>
                                    </div>
                                    <div className='d-flex border-bottom mb-4 w-100 ms-1'>
                                        <div className='d-flex'>
                                            <img src="/payments/iban.svg" width={40} className='border-end my-auto px-2' />
                                        </div>
                                        <div className="input-group containertext w-100 h-100">
                                            <CustomTextField label="Designation" />
                                        </div>
                                    </div>
                                </div>

                            </form>
                            <button data-bs-dismiss="modal" className='btn bg-green100 fw-500 text-white py-3 w-100 mt-3' >Send Invite</button>

                        </>

                    </div>
                </div>
            </div>
        </>

    )
}

export default CreateMember