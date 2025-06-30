import React from 'react'
import { Link } from 'react-router-dom'

function BreadCrumbs({ data }) {
    //Please add all of your messages according to your data.name and Add that switch --@author-Pabitra
    let tooltipMessage = '';

  if (data.name === 'Invoices') {
    tooltipMessage = 'Here are your invoice details';
  } else if (data.name === 'Bills') {
    tooltipMessage = 'Here are your bill details';
  }
  else if (data.name === 'Corporate Cards') {
    tooltipMessage = 'Here are your cards details';
  } else {
    tooltipMessage = data.name;
  }

    return (
        <div className='d-flex border bg-white'>
            <Link to={data.backurl} className='my-auto'>
                <img className='py-3 px-4 my-auto' src={data.img} />
            </Link>
            <h6 className='p-4 m-0 border-start'>{data.name}</h6>
            {data.info && <img src="/info_circle.svg" width={20} className='ms-auto m-4'title= {tooltipMessage} />}
        </div>
    )
}

export default BreadCrumbs