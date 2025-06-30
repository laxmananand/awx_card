import React from 'react';
import TextField from '@mui/material/TextField';

const styles = {
    underline: {
        '&::before': {
            borderBottom: 'none',
        },
        '&::after': {
            borderBottom: 'none',
        },
    },
};

const CustomTextField = (props) => {
    const { readOnly } = props;

    return (
        <TextField
            className='w-100'
            {...props}
            InputProps={{
                classes: {
                    underline: styles.underline,
                },
                readOnly
            }}
            InputLabelProps={{
                classes: {
                    focused: styles.inputLabel,
                },
            }}
        />
    );
};

export default CustomTextField;
