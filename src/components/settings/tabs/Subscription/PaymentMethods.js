import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaCreditCard } from "react-icons/fa";
import AddCard from './AddCard';
import { getStripePaymentMethodsAPI, removeStripePaymentMethodAPI, setDefaultStripePaymentMethodAPI } from '../../../../@redux/action/subscription';

function PaymentMethods() {
    const paymentMethods = useSelector((state) => state.subscription?.paymentMethods);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getStripePaymentMethodsAPI())
    }, [])


    return (
        <div className='w-100 mt-5'>
            {paymentMethods?.length > 0 && <div className='d-flex justify-content-end'>
                <div className="mt-4 mb-3 fs-5">Payment Method</div>
                <button type="button" className='btn btn-dark ms-auto my-auto' data-bs-toggle="modal" data-bs-target="#addPaymentCard">Add Card</button>
            </div>}

            {paymentMethods?.map(method => (
                <div key={method.id} className="w-100 border p-3 d-flex align-items-center mb-2" style={{ borderRadius: "32px" }}>
                    <div className="bg-green10 rounded-4 d-block p-3">
                        <FaCreditCard size={20} className='green100' />
                    </div>

                    <div className="flex-fill ms-3">
                        <p className="fw-normal m-0 green100">{method.brand} •••• {method.last4}</p>
                        <p className="m-0">
                            Valid until {method.exp_month}/{method.exp_year}
                        </p>
                    </div>


                    {!method.isDefault && <button type="button" className='btn btn-outline-dark me-2' onClick={()=>dispatch(setDefaultStripePaymentMethodAPI(method.id))}>
                        Add to Default
                    </button>}

                    {!method.isDefault && <button type="button" className='btn btn-danger' onClick={()=>dispatch(removeStripePaymentMethodAPI(method.id))}>
                        Remove
                    </button>}
                    

                    {method.isDefault && <button type="button" className='btn btn-outline-info rounded-pill' disabled>
                        Default
                    </button>}
                </div>
            ))
            }



            <AddCard />

        </div>
    )
}

export default PaymentMethods