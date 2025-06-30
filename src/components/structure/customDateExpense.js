import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import dayjs from 'dayjs';

function CustomDateRange({ from, to, setFromDate, setToDate }) {
  const today = dayjs();

  return (
    <div className='d-flex align-items-center position-relative' style={{ maxWidth: '400px' }}>
      <p className='grey1 my-auto text-nowrap' style={{ padding: "5px" }}>From |</p>
      <DatePicker
        placeholder="From Date"
        value={from ? dayjs(from) : null}
        onChange={(date) => setFromDate(date ? date.toDate() : null)}
        views={['year', 'month', 'day']}
        format="YYYY-MM-DD"
        className='w-50'
        maxDate={today}
      />
      <p className='grey1 my-auto text-nowrap'>To |</p>
      <DatePicker
        placeholder="To Date"
        value={to ? dayjs(to) : null}
        onChange={(date) => setToDate(date ? date.toDate() : null)}
        views={['year', 'month', 'day']}
        format="YYYY-MM-DD"
        className='w-50'
        minDate={from ? dayjs(from) : null}
        maxDate={today}
        disabled={!from}
      />
    </div>
  );
}

export default CustomDateRange;
