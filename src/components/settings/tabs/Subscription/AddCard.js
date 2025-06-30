import React, { useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addStripePaymentMethodAPI } from '../../../../@redux/action/subscription';

const stripePromise = loadStripe(process.env.VITE_stripe_pub_key);

const cardElementOptions = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#f00',
            iconColor: '#fa755a',
        },
    },
};

function AddCard() {
    const closeRef = useRef()

    return (
        <div
            className="modal fade"
            id="addPaymentCard"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="addPaymentCardLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addPaymentCardLabel">
                            Add Card
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            ref={closeRef}
                        />
                    </div>
                    <div className="modal-body">
                        <Elements stripe={stripePromise}>
                            <CustomCardForm closeRef={closeRef} />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomCardForm({ closeRef }) {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            toast.error(error.message);
        } else {
            dispatch(addStripePaymentMethodAPI(paymentMethod.id, closeRef))
            elements.getElement(CardNumberElement).clear();
            elements.getElement(CardExpiryElement).clear();
            elements.getElement(CardCvcElement).clear();
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label className='mb-2'>Card Number</label>
                <CardNumberElement options={cardElementOptions} />
                <hr className='mt-1' />
            </div>

            <div className='d-flex'>

                <div className='mb-3 w-50 me-1'>
                    <label className='mb-2'>Expiration Date</label>
                    <CardExpiryElement options={cardElementOptions} />
                    <hr className='mt-1' />
                </div>

                <div className='mb-3 w-50 ms-1'>
                    <label className='mb-2'>CVC/CVC</label>
                    <CardCvcElement options={cardElementOptions} />
                    <hr className='mt-1' />
                </div>
            </div>

            <button type="submit" className='btn btn-action rounded-pill fw-500 mx-auto' disabled={!stripe}>
                Submit Payment
            </button>
        </form>
    );
}

export default AddCard;
