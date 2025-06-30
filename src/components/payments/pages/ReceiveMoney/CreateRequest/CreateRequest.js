import React, { useState } from 'react'
import PaymentRequestModal from './PaymentRequestModal'
import BreadCrumbs from '../../../../structure/BreadCrumbs'
import Details from './Details';
import Documents from './Documents';
import Review from './Review';

function CreateRequest() {
    const [currentState, setCurrentState] = useState("details");

    return (
        <div>
            <BreadCrumbs data={{ backurl: "/payments/request-money", name: "Creating Request", info: true, img: "/arrows/arrowLeft.svg" }} />

            <div className='bg-white m-3 p-4 border rounded-3'>
                <h6>New Request for &nbsp;
                    <span className='m-0 bg-light d-inline-block mx-auto border p-2 rounded'>Alexander McQueen</span></h6>


                    {
                        currentState==="details" ? <Details setCurrentState={setCurrentState}/> : currentState==="documents" ? <Documents setCurrentState={setCurrentState}/> : currentState==="review" ? <Review setCurrentState={setCurrentState}/> : ""
                    }


            </div>
        </div>
    )
}

export default CreateRequest