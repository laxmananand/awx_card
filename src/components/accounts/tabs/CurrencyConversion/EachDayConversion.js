import React, { useEffect, useState } from 'react'
import EachConversion from './EachConversion'

function EachDayConversion({data}) {
    console.log(data);
    const [date, setDate] = useState("");
    
    useEffect(()=>{
        if(data == "**No recent conversions in the last 7 days**"){
                setDate(data);
        }
        
       else {

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

if(data == "**No recent conversions in the last 7 days**"){
    return (
        <div className='mt-4'>
            <hr />
            <p className='grey1' color="#ff003a !important" style={{marginLeft:"7px", fontSize:"18px"}}>There are no new conversions to report</p>
        </div>
    )
}
else{
    return (
        <div className='mt-4'>
            <hr />
            <p className='grey1'>{date}</p>

            {
                data?.data?.map((item, key)=>(
                    <EachConversion data={item} key={key} />
                ))
            }
        </div>
    )
}
}

export default EachDayConversion