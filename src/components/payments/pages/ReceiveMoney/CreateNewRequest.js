import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../structure/CustomText';
import CustomSelect from '../../../structure/CustomSelect';
// import CustomSelect from './CustomSelect'


function EachPayer() {
    return (
        <a href="/payments/request-money/create-request" className='d-flex justify-content-between align-items-center m-1 text-decoration-none blueHover p-2 rounded-3' role='button'>
            <div className='d-flex align-items-center'>
                <div className='bg-info p-3 rounded-circle me-2 text-white'>
                    NA
                </div>
                <div>
                    <div className='text-dark'>
                        Natalie Portman
                    </div>
                    <div className='grey1'>
                        nataliport@gmail.com
                    </div>
                </div>
            </div>
            <a
                className='nav-link'
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <img src="/threeDotsH.svg" />
            </a>
            <ul className="dropdown-menu py-4 px-2  " aria-labelledby="navbarDropdown">
                <li>
                    <a className="dropdown-item fw-500" href="#" onClick={() => { setShowDetails(true) }}>
                        Details
                    </a>
                </li>
                <li>
                    <a className="dropdown-item fw-500" href="#">
                        Send Money
                    </a>
                </li>
                <li>
                    <a className="dropdown-item fw-500" href="#">
                        Request Money
                    </a>
                </li>
                <li>
                    <a className="dropdown-item fw-500" href="#">
                        <img src='/sidebar/profile/profile.svg' className='me-2' />
                        Edit
                    </a>
                </li>
                <li>
                    <a className="dropdown-item fw-500" href="#">
                        <img src='/sidebar/profile/profile.svg' className='me-2' />
                        Delete
                    </a>
                </li>
            </ul>
        </a>
    )
}


function CreateNewRequest() {

    const options = [
        { value: 'vanilla', label: 'Vanilla' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'caramel', label: 'Caramel' },
        { value: 'mint', label: 'Mint' },
        { value: 'blueberry', label: 'Blueberry' },
        { value: 'raspberry', label: 'Raspberry' },
        { value: 'hazelnut', label: 'Hazelnut' },
        { value: 'peanut_butter', label: 'Peanut Butter' },
        { value: 'coconut', label: 'Coconut' },
        { value: 'lemon', label: 'Lemon' },
        { value: 'coffee', label: 'Coffee' },
        { value: 'pistachio', label: 'Pistachio' },
        { value: 'banana', label: 'Banana' },
        { value: 'butterscotch', label: 'Butterscotch' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'almond', label: 'Almond' },
        { value: 'cinnamon', label: 'Cinnamon' },
        { value: 'honey', label: 'Honey' },
        { value: 'orange', label: 'Orange' },
        { value: 'maple', label: 'Maple' }
    ]
    const [isBusiness, setIsBusiness] = useState(false);

    return (
        <>
            {/* Button trigger modal */}
            <button
                type="button"
                className='btn bg-green100 text-white border w-100 rounded-3 d-flex align-items-center justify-content-center py-2 fw-500'
                data-bs-toggle="modal"
                data-bs-target="#AddNewAccountModal"
            >
                <span className='h3 m-0'>+&nbsp;</span>New Request
            </button>
            {/* Modal */}
            <div
                className="modal fade"
                id="AddNewAccountModal"
                tabIndex={-1}
                aria-labelledby="AddNewAccountModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-5">
                        <div className='d-flex justify-content-between my-2'>
                            <h5 className='text-dark'>
                                Creating Request
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>

                        <h5 className='text-dark my-3'>Select Payer</h5>
                        <form className="d-flex col-lg-6 border rounded-3 my-2 my-lg-0 w-100">
                            <button className="btn" type="submit" disabled>
                                <img src='/search.svg' />
                            </button>
                            <input
                                className="form-control border-0"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                        </form>

                        <div className='d-flex align-items-center'>
                            <img src='/plus_blue.svg' className='bg-blue10 p-3 my-3 rounded-circle' />

                            <p className='blue100 m-0 ms-3'>New Payer</p>
                        </div>

                        <hr className='text-dark mt-0' />

                        <div className='overflow-auto' style={{maxHeight: "50vh"}}>
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                            <EachPayer />
                        </div>


                    </div>
                </div>
            </div>
        </>

    )
}

export default CreateNewRequest