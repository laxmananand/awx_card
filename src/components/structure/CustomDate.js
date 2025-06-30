import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs';
import React from 'react';

function CustomDate(props) {
    const { Value } = props;
    const today = dayjs(Date.now());

    if (Value)

        return (
            <DatePicker defaultValue={dayjs(Value)} {...props} views={['year', 'month', 'day']} format="YYYY-MM-DD"  />
        )

    else
        return (
            <DatePicker {...props} views={['year', 'month', 'day']} format="YYYY-MM-DD" maxDate={today} />
        )
}

export default CustomDate