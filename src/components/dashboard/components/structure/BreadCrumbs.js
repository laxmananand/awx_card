import React from 'react'
import { Link } from 'react-router-dom'

function BreadCrumbs({ data }) {
    return (
        <div className='d-flex border bg-white'>
            <Link to={data.backurl} className='my-auto'>
                <img className='py-3 px-4 my-auto' src={data.img} />
            </Link>
            <h6 className='p-4 m-0 border-start'>{data.name}</h6>
            {data.info && <img src="/info_circle.svg" width={20} className='ms-auto m-4' />}
        </div>
    )
}

export default BreadCrumbs