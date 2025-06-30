import React, { useDebugValue, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

function DetailsBar() {
    const [isHide, setIsHide] = useState(false);
    const [url, setUrl] = useState("");
    const location = useLocation();

    useEffect(() => {
        setUrl(location.pathname);
    }, [location.pathname])

    useEffect(() => {
        const accountsButton = document.getElementById("accounts-collapse");
        const paymentsButton = document.getElementById("payments-collapse");
        const expenseButton = document.getElementById("expense-collapse");
        const settingsButton = document.getElementById("settings-collapse");

        if (accountsButton) {
            if (url.startsWith("/accounts")) {
                accountsButton.classList.add("show");
            } else {
                accountsButton.classList.remove("show");
            }
        }
        if (paymentsButton) {
            if (url.startsWith("/payments")) {
                paymentsButton.classList.add("show");
            } else {
                paymentsButton.classList.remove("show");
            }
        }
        if (expenseButton) {
            if (url.startsWith("/expense")) {
                expenseButton.classList.add("show");
            } else {
                expenseButton.classList.remove("show");
            }
        }
        if (settingsButton) {
            if (url.startsWith("/settings")) {
                settingsButton.classList.add("show");
            } else {
                settingsButton.classList.remove("show");
            }
        }
    }, [url])


    return (
        <nav className="d-flex bg-white flex-column justify-content-start flex-start p-4 flex-1 border border-top-0 position-relative" id='sidebar'>
            <div className='mt-3 position-relative'>
                <h6 className='text-nowrap me-5'>Bank Account Details</h6>
                <button
                    type="button"
                    className="btn-close btn-sm  position-absolute end-0 top-0 me-2"
                />
            </div>

            <div className='d-flex border p-3 justify-content-center align-items-center mt-2 rounded-2'>
                <img src='/flag.svg' />
                <p className='my-auto ms-2 me-5'>
                    <span className='text-nowrap grey1'>
                        Bank Universal
                    </span>
                    <br />
                    <span className='text-nowrap'>
                        Dollar USA, USD
                    </span>
                </p>
            </div>



        </nav>
    )
}

export default DetailsBar