import React, {useEffect, useState} from 'react'
import EachTransaction from './EachTransaction'

function EachDayTransaction({data}) {

    console.log(data);
    const [date, setDate] = useState("");
    
    useEffect(()=>{
        if(data=="**No recent transactions in the last 7 days**") {
           setDate(data);
        }
        else{
            const originalDate = new Date(data?.dateOfTransaction);
            const monthNames = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
            ];

            const day = originalDate.getDate();
            const month = monthNames[originalDate.getMonth()];
            // Create the new formatted date string
            const formattedDate = `${day} ${month}`;

            setDate(formattedDate);

        }
    })

    if(data=="**No recent transactions in the last 7 days**"){
        return (
            <div className='mt-4'>
                <hr />
                <p className='grey1' color="#ff003a !important" style={{marginLeft:"10px", fontSize:"17px"}}>{data}</p>
                   
            </div>
        )
    }
 
    return (
        <div className='mt-4'>
            <hr />
            <p className='grey1'>{date}</p>
            {
                data?.data?.map((item, key)=>(
                    <EachTransaction data={item} key={key} />
                ))
            }
        </div>
    )
}

export default EachDayTransaction