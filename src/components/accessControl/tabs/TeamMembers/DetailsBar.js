import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../structure/CustomText';
import { handleCopy } from '../../../structure/handleCopy';
import { RxCheckCircled, RxCrossCircled } from 'react-icons/rx';
import CustomSelect from '../../../structure/CustomSelect';

function DetailsBar({ setShowDetails, handleShow, handleActive, data }) {

    const options = [
        { value: 'Admin', label: "Admin" },
        { value: 'Finance', label: "Finance" },
        { value: 'Employee', label: "Employee" }
    ]

    const [val, setVal] = useState()
    const [value, setValue] = useState()

    useEffect(()=>{
        setVal({label: data?.role, value:data?.role?.toLowerCase()})
    }, [data?.role])

    useEffect(()=> {
        setVal({label: value, value:value})
    }, [value])

    const colorList1 = {
        // pending: " blue100 bg-blue10",
        // active: " green100 bg-green10",
        // inactive: " yellow100 bg-yellow10",
        Employee: " bg-blue10",
        Admin: " bg-green10",
        Finance: " bg-yellow10"
    }
    const colorList2 = {
        // pending: " blue100 bg-blue10",
        // active: " green100 bg-green10",
        // inactive: " yellow100 bg-yellow10",
        Employee: " bg-blue100",
        Admin: " bg-green100",
        Finance: " bg-yellow100"
    }
    const colorList3 = {
        // pending: " blue100 bg-blue10",
        // active: " green100 bg-green10",
        // inactive: " yellow100 bg-yellow10",
        Employee: " blue100",
        Admin: " green100",
        Finance: " yellow100"
    }

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

            <div className={'border p-3 my-3 rounded-2' + colorList1[data?.role]}>
                <div className='d-flex align-items-center'>
                    <div className={'ms-1 me-4' + colorList3[data?.role]}>#34345{data?.id}</div>
                    <div className={'px-3 py-2 rounded-pill text-white ms-4 me-1' + colorList2[data?.role]}>{data?.role}</div>
                </div>
                <hr className='blue100' />
                <div>
                    <div className='my-2'>{data?.username}</div>
                    <div className='grey1 fw-normal'>{data?.username?.split(" ")[0].toLowerCase()}634@stylopay.com</div>
                    <div className='grey1 fw-normal'>Created by {data?.createdBy}</div>
                </div>
            </div>

            {data?.role!=="Admin" && <div className="accordion accordion-flush" id="requestMoneyDetails">
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
                            CHANGE ROLE
                        </button>
                    </h2>
                    <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#requestMoneyDetails"
                    >
                        <div className="d-flex my-3">
                            <div className='d-flex border-bottom w-100'>
                                <div className="input-group containertext w-100 h-100">
                                    <CustomSelect options={options} setValue={setValue} value={val} />
                                </div>
                            </div>
                            <button className='btn bg-blue100 text-white fw-500'>
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>}

            {data?.role === "Admin" ?
                <></>
                :
                data?.status === "active" ?
                    <button className='btn border rounded-3 my-2 py-3 fw-500 yellow100'>
                        <RxCrossCircled className='me-1 yellow100 fs-4' />
                        De-activate Account
                    </button>
                    :
                    data?.status === "inactive" ?
                        <button className='btn border rounded-3 my-2 py-3 fw-500 green100'>
                            <RxCheckCircled className='me-1 green100 fs-4' />
                            Activate Account
                        </button> : <button className='btn border rounded-3 my-2 py-3 fw-500 blue100'>
                            <RxCheckCircled className='me-1 blue100 fs-4' />
                            Approve Account
                        </button>}
        </nav>
    )
}

export default DetailsBar