// import { DatePicker } from '@mui/x-date-pickers';
// import React from 'react';
// import dayjs, { Dayjs } from 'dayjs';

// function CustomDateRange(props) {
//     const { from, to, setFromDate, setToDate } = props;
//     const today = dayjs(Date.now());

//     // console.log(today.toString()

//     return (
//         <div className='d-flex align-items-center position-relative' style={{ maxWidth: '400px' }}>
//             <p className='grey1 my-auto text-nowrap' style={{padding:"5px"}}>From |</p>
//             <DatePicker
//                 placeholder="From Date"
//                 value={dayjs(from)}
//                 onChange={setFromDate}
//                 views={['year', 'month', 'day']}
//                 format="YYYY-MM-DD"
//                 className='w-50'
//                 maxDate={today}
//             />      
//             <p className='grey1 my-auto text-nowrap'>To |</p>
//             <DatePicker
//                 placeholder="To Date"
//                 value={dayjs(to)}
//                 onChange={setToDate}
//                 views={['year', 'month', 'day']}
//                 format="YYYY-MM-DD"
//                 className='w-50'
//                 minDate={from}
//                 maxDate={today}
//                 disabled={!from}
//             />
//         </div>
//     );
// }

// export default CustomDateRange;

import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import dayjs from 'dayjs';

function CustomDateRange(props) {
    const { from, to, setFromDate, setToDate } = props;
    const today = dayjs();  // Today's date
    const sixMonthsAgo = today.subtract(6, 'month');  // 6 months before today

    return (
        <div className='d-flex align-items-center position-relative' style={{ maxWidth: '400px' }}>
            <p className='grey1 my-auto text-nowrap' style={{ padding: "5px" }}>From |</p>
            <DatePicker
                placeholder="From Date"
                value={from ? dayjs(from) : null}
                onChange={setFromDate}
                views={['year', 'month', 'day']}
                format="YYYY-MM-DD"
                className='w-50'
                minDate={sixMonthsAgo}  // Restrict selection to last 6 months
                maxDate={today}         // Prevent selecting future dates
            />
            <p className='grey1 my-auto text-nowrap'>To |</p>
            <DatePicker
                placeholder="To Date"
                value={to ? dayjs(to) : null}
                onChange={setToDate}
                views={['year', 'month', 'day']}
                format="YYYY-MM-DD"
                className='w-50'
                minDate={from || sixMonthsAgo}  // To Date cannot be before From Date
                maxDate={today}
                disabled={!from}  // Disable To Date until From Date is selected
            />
        </div>
    );
}

export default CustomDateRange;

