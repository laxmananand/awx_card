import React from 'react'
import { handleCopy } from '../../../structure/handleCopy';

function EachInfoData({ data, setShowDetails }) {

    return (
        <div className='d-flex justify-content-between align-items-center my-2'>
            <div>
                <p className='m-0 grey1 d-flex align-items-center text-nowrap'>
                    {data?.label}
                    {/* <img src='/question.svg' className='ms-1' /> */}
                </p>
                <div className='h6 m-0 text-wrap' title={data.text}>
                    {data?.text}
                </div>
            </div>


            {/* <img src="/copy.svg"  className="me-2" role='button' onClick={(event) => {
                handleCopy(event, data.text);                
            }
            } /> */}
        </div>
    )
}

export default EachInfoData