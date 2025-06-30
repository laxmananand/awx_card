import React, { useDebugValue, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

function SideBar() {
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
                handleIconClick("accounts", true)
            } else {
                accountsButton.classList.remove("show");
            }
        }
        if (paymentsButton) {
            if (url.startsWith("/payments")) {
                paymentsButton.classList.add("show");
                handleIconClick("payments", true)
            } else {
                paymentsButton.classList.remove("show");
            }
        }
        if (expenseButton) {
            if (url.startsWith("/expense")) {
                expenseButton.classList.add("show");
                handleIconClick("expense", true)
            } else {
                expenseButton.classList.remove("show");
            }
        }
        if (settingsButton) {
            if (url.startsWith("/settings")) {
                settingsButton.classList.add("show");
                handleIconClick("settings", true)
            } else {
                settingsButton.classList.remove("show");
            }
        }
    }, [url])

    const [isRotatedAccounts, setIsRotatedAccounts] = useState(false);
    const [isRotatedPayments, setIsRotatedPayments] = useState(false);
    const [isRotatedExpense, setIsRotatedExpense] = useState(false);
    const [isRotatedSettings, setIsRotatedSettings] = useState(false);

    const handleIconClick = (type, prevState) => {
        if (type === "accounts") {
            setIsRotatedAccounts(true && prevState);
            setIsRotatedPayments(false);
            setIsRotatedExpense(false);
            setIsRotatedSettings(false);
        } else if (type === "payments") {
            setIsRotatedAccounts(false);
            setIsRotatedPayments(true && prevState);
            setIsRotatedExpense(false);
            setIsRotatedSettings(false);
        } else if (type === "expense") {
            setIsRotatedAccounts(false);
            setIsRotatedPayments(false);
            setIsRotatedExpense(true && prevState);
            setIsRotatedSettings(false);
        } else if (type === "settings") {
            setIsRotatedAccounts(false);
            setIsRotatedPayments(false);
            setIsRotatedExpense(false);
            setIsRotatedSettings(true && prevState);
        }
    };


    return (
        <nav className="d-flex bg-green flex-column justify-content-between flex-start px-3 flex-1" style={{ height: "100vh" }} id='sidebar'>
            <ul className="p-0 list-unstyled accordion overflow-auto flex-fill" id='sidebarAccordion'>
                <Link
                    to="/"
                    className="d-inline-block my-4"
                >
                    <img alt="" src="/logo.svg" />

                </Link>
                <div className='bg-gainsboro my-1' style={{ "height": "0.06rem" }} />
                <li className="bg-white rounded-4 my-3">
                    <Link to="/" className={(url === "/" ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                        <img
                            className=""
                            alt=""
                            src="/sidebar/dashboard.svg"
                        />
                        <div className={isHide ? "d-none" : "h6 m-0 ms-2"}>Dashboard</div>
                    </Link>
                </li>

                <li className="bg-white rounded-4 d-flex">
                    <Link to="/accounts" className={(url === "/accounts" ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" + (isHide ? "center" : "start")} aria-expanded={false && url.startsWith("/accounts")} >
                        <img
                            className=""
                            alt=""
                            src="/sidebar/accounts.svg"
                        />
                        <div className={isHide ? "d-none" : "m-0 ms-2"}>Accounts</div>
                    </Link>
                    <img role='button' data-bs-toggle="collapse" data-bs-target="#accounts-collapse" aria-expanded="false" aria-controls="accounts-collapse" onClick={() => {
                        handleIconClick("accounts", !isRotatedAccounts);
                    }}
                        className={`${isRotatedAccounts ? 'rotate180 ' : ''
                            }${(url === '/accounts' ? 'opacity-75 fw-bolder ' : '')}bg-green pe-2`} src="/arrows/arrowDown.svg" />
                </li>
                <div className="collapse ps-3" id="accounts-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" >
                        <li className="bg-white rounded-4">
                            <Link to="/accounts/global-accounts" className={(url.startsWith("/accounts/global-accounts") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/accounts/globalAccounts.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Global Accounts</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/accounts/conversion" className={(url.startsWith("/accounts/conversion") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/accounts/currencyConversion.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Conversion</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/accounts/statements" className={(url.startsWith("/accounts/statements") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/accounts/accountStatement.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Statements</div>
                            </Link>
                        </li>
                    </ul>
                </div>

                <li className="bg-white rounded-4 d-flex my-3">
                    <Link to="/payments" className={(url === "/payments" ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" + (isHide ? "center" : "start")} aria-expanded={false && url.startsWith("/payments")}>
                        <img
                            className=""
                            alt=""
                            src="/sidebar/payments.svg"
                        />
                        <div className={isHide ? "d-none" : "m-0 ms-2"}>Payments</div>
                    </Link>
                    <img role='button' data-bs-toggle="collapse" data-bs-target="#payments-collapse" aria-expanded="false" aria-controls="payments-collapse" onClick={() => {
                        handleIconClick("payments", !isRotatedPayments);
                    }}
                        className={`${isRotatedPayments ? 'rotate180 ' : ''
                            }${(url === '/payments' ? 'opacity-75 fw-bolder ' : '')}bg-green pe-2`} src="/arrows/arrowDown.svg" />
                </li>
                <div className="collapse ps-3" id="payments-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li className="bg-white rounded-4">
                            <Link to="/payments/beneficiaries" className={(url.startsWith("/payments/beneficiaries") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/payments/beneficiaries.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Beneficiaries</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/payments/request-money" className={(url.startsWith("/payments/request-money") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/payments/requestMoney.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Request Money</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/payments/send-money" className={(url.startsWith("/payments/send-money") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/payments/sendMoney.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Send Money</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/payments/transactions" className={(url.startsWith("/payments/transactions") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/payments/transactions.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Transactions</div>
                            </Link>
                        </li>
                    </ul>
                </div>


                <li className="bg-white rounded-4 d-flex my-3">
                    <Link to="/expense" className={(url === "/expense" ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" + (isHide ? "center" : "start")} aria-expanded={false && url.startsWith("/expense")}>
                        <img
                            className=""
                            alt=""
                            src="/sidebar/expense.svg"
                        />
                        <div className={isHide ? "d-none" : "m-0 ms-2"}>Expense</div>
                    </Link>
                    <img role='button' data-bs-toggle="collapse" data-bs-target="#expense-collapse" aria-expanded="false" aria-controls="expense-collapse" onClick={() => {
                        handleIconClick("expense", !isRotatedExpense);
                    }}
                        className={`${isRotatedExpense ? 'rotate180 ' : ''
                            }${(url === '/expense' ? 'opacity-75 fw-bolder ' : '')}bg-green pe-2`} src="/arrows/arrowDown.svg" />
                </li>
                <div className="collapse ps-3" id="expense-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li className="bg-white rounded-4">
                            <Link to="/expense/invoices" className={(url.startsWith("/expense/invoices") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/expense/invoices.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Invoices</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/expense/bills" className={(url.startsWith("/expense/bills") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/expense/bills.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Bills</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/expense/corporate-cards" className={(url.startsWith("/expense/corporate-cards") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/expense/corporateCards.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Corporate Cards</div>
                            </Link>
                        </li>
                    </ul>
                </div>


                <div className='bg-gainsboro my-1' style={{ "height": "0.06rem" }} />
                <li className="bg-white rounded-4 d-flex my-3">
                    <Link to="/settings" className={(url === "/settings" ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" + (isHide ? "center" : "start")} aria-expanded={false && url.startsWith("/settings")}>
                        <img
                            className=""
                            alt=""
                            src="/sidebar/settings.svg"
                        />
                        <div className={isHide ? "d-none" : "m-0 ms-1"}>Settings</div>
                    </Link>
                    <img role='button' 
                        onClick={() => {
                            handleIconClick("settings", !isRotatedSettings);
                        }}
                        className={`${isRotatedSettings ? 'rotate180 ' : ''
                            }${(url === '/settings' ? 'opacity-75 fw-bolder ' : '')}bg-green pe-2`}
                        src="/arrows/arrowDown.svg"
                        alt="Arrow Icon"
                        data-bs-toggle="collapse"
                        data-bs-target="#settings-collapse"
                        aria-expanded="false"
                        aria-controls="settings-collapse"
                    />
                </li>
                <div className="collapse ps-3" id="settings-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li className="bg-white rounded-4">
                            <Link to="/settings/2FAsetup" className={(url.startsWith("/settings/2FAsetup") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/settings/2FAsetup.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>2FA Setup</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/settings/branding" className={(url.startsWith("/settings/branding") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/settings/branding.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Branding</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/settings/password" className={(url.startsWith("/settings/password") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/settings/password.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Password</div>
                            </Link>
                        </li>
                        <li className="bg-white rounded-4">
                            <Link to="/settings/subscription" className={(url.startsWith("/settings/subscription") ? "opacity-75 fw-bolder " : "") + "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" + (isHide ? "center" : "start")}>
                                <img
                                    className=""
                                    alt=""
                                    src="/sidebar/settings/subscription.svg"
                                />
                                <div className={isHide ? "d-none" : "m-0 ms-1"}>Subscription</div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </ul>
            <div className={"text-white " + (isHide ? "" : "")}>
                <div className="d-flex flex-nowrap align-items-center mb-2">
                    <img className={isHide ? "mx-auto" : ""} alt="" src="/sidebar/avatar.svg" />
                    <div className={isHide ? "d-none" : "ms-2 text-nowrap"}>Daniel Brown</div>
                    <div className={isHide ? "d-none" : ""}>
                        <a
                            className={"nav-link"}
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img alt="" src="/sidebar/threeDots.svg" />
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                                <a className="dropdown-item" href="#">
                                    <img src='/sidebar/profile/profile.svg' className='me-2' />
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    <img src='/sidebar/profile/business.svg' className='me-2' />
                                    Business
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    <img src='/sidebar/profile/branding.svg' className='me-2' />
                                    Branding
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    <img src='/sidebar/profile/logout.svg' className='me-2' />
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
                <button className={'bg-transparent border-0 my-3 d-flex m' + (isHide ? "x" : "s") + '-auto'} onClick={() => { setIsHide(!isHide); }}>
                    <img src={isHide ? "/sidebar/arrowRight.svg" : "/sidebar/arrowLeft.svg"} />
                </button>
            </div>
        </nav>
    )
}

export default SideBar