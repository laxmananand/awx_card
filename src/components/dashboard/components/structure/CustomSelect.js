import React from 'react'
import Select from 'react-select'

function CustomSelect({ options, placeholder, multiple, setValue }) {
    const customStyles = {
        control: (provided) => ({
          ...provided,
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            border: 'none',
          },
        }),
      };

    return (
        <div className='w-100 border-0'>
            <Select styles={customStyles} options={options} placeholder={placeholder || "--Select--"} isMulti={multiple} onChange={(e)=>(setValue(e.value))} />
        </div>
    )
}

export default CustomSelect