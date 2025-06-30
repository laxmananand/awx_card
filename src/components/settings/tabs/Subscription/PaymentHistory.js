import React, { useEffect } from 'react'
import SideBar from '../../../SideBar';
import BreadCrumbs from '../../../structure/BreadCrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { getStripeInvoicesAPI } from '../../../../@redux/action/subscription';
import { BiSolidDownload } from "react-icons/bi";
import { toast } from 'react-toastify';

const PaymentHistoryList = ({ data }) => {

    const dateFormat = (unixTimestamp) => {

        const date = new Date(unixTimestamp * 1000);

        const options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const formattedDate = date.toLocaleDateString('en-GB', options);

        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const result = <>
            {formattedDate} <br /> {formattedTime} GMT 00:00
        </>

        return result
    }


    return (
        <>

            <tr className='border my-3'>
                <td className={'py-2 px-3 m-0 rounded-pill d-inline-block m-3 align-items-center' + (data?.status === "Error" ? " yellow100 bg-yellow10" : " green100 bg-green10")}>{data?.status?.toUpperCase()}
                </td>
                <td>
                    {dateFormat(data?.created)}
                </td>
                <td>
                    {data?.description}<br />
                    <u className='fw-500'>{data?.businessType}</u>
                </td>
                <td className='fw-500'>
                    ${data?.amount_paid / 100}
                </td>
                <td className='m-0 opacity-75'><a href={data?.invoice_pdf} target='_blank'><BiSolidDownload size={25} /></a></td>
            </tr>


            <tr className='my-3'>
                <td className='py-3'></td>
                <td className='py-3'></td>
                <td className='py-3'></td>
                <td className='py-3'></td>
                <td className='py-3'></td>
            </tr>
        </>
    )
}


const PaymentHistory = () => {

    const histories = useSelector(state => state.subscription.invoices)

    const dispatch = useDispatch()


    const showMore = () => {
        if (histories?.data?.length === 10)
            dispatch(getStripeInvoicesAPI(histories?.data?.[histories?.data?.length - 1]?.id))
        else
            toast.error("No more invoices")
    }
    useEffect(()=>{dispatch(getStripeInvoicesAPI())}, [])

    return (
        <div className='d-flex'>
            <SideBar />
            <div className="container-fluid px-0 bg-light clear-left overflow-auto" style={{ minHeight: "100vh" }}>
                <BreadCrumbs data={{ name: "Payment history", img: "/arrows/arrowLeft.svg", backurl: "/settings/subscription" }} />
                <div className='bg-white w-75 mx-auto m-3 my-5 p-3 rounded-5 shadow'>
                    <div className='p-3'>
                        <img className=' d-flex  justify-content-end bg-yellow10 p-3 rounded-3 d-block ' src="/settings/subscription/payment-history/m-payment.svg" alt="" />
                        <h5 className='mt-3'>Payment history</h5>
                        <h5 className='my-4'>Your Plan</h5>

                        <table className='w-100 '>
                            <tbody className='p-3'>
                                {histories?.data?.map((item, key) => (
                                    <PaymentHistoryList data={item} key={key} />
                                ))}
                            </tbody>
                        </table>


                        {histories?.has_more && <button type='button' className='mx-auto btn btn-action fw-500 rounded-pill' onClick={showMore}>Show more</button>}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PaymentHistory
