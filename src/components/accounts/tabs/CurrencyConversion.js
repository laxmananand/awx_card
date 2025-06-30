import React from 'react'
import BreadCrumbs from '../../structure/BreadCrumbs'
import CurrencyGraph from './CurrencyConversion/CurrencyGraphConversion'
import RecentConversion from './CurrencyConversion/RecentConversion'
import Form from './CurrencyConversion/Form'
import MyChart from '../../../@component_v2/Currencies'
 import RecentTransactionV2 from '../../../@component_v2/RecentTransaction'

function CurrencyConversion() {
  return (
    <>
      <BreadCrumbs data={{ name: "Currency Conversion", img: "/arrows/arrowLeft.svg", backurl: "/accounts" }} />

      <div className='row'>
        <div className='col-12 col-lg-6 p-5' style={{marginTop:"-20px"}}>
          <div className='m-3  bg-white p-5 border rounded-5 shadow'>
            {/* <img src="/exchange_2.svg" className={'bg-light-primary p-3 rounded-circle d-block'} />
            <h5 className='m-0 mt-3 d-inline-block'>What amount do you want to convert?</h5> */}
            <div className='d-flex align-items-center'>
            <div className="rounded-circle bg-light-primary">
              <img src="/exchange_2.svg" style={{ padding: "12px" }} width={50} />
            </div>
                <p className='h5 m-0 ms-2 d-inline-block' style={{fontSize: "22px",fontWeight: 700}}>What amount do you want to convert?</p>
            </div>
            <Form />
          </div>
        </div>

        <div className='col-12 col-lg-5 p-3 mt-3 h-100'>
          {/* <MyChart /> */}
          <div className='my-3'>
            {/* <RecentTransactionV2 /> */}
            <RecentConversion/>
          </div>
        </div>


      </div>
    </>

  )
}

export default CurrencyConversion