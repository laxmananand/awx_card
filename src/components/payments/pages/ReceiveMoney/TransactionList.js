import React, { useState } from 'react'
import CustomSelect from '../../../structure/CustomSelect'
import CustomDateRange from '../../../structure/CustomDateRangePicker'

function TableRow({ index, setShowDetails }) {
  const colorList = [" blue100 bg-blue10", " green100 bg-green10", " yellow100 bg-yellow10"]

  return (
    <tr onClick={() => setShowDetails(true)} className='blueHover' role='button'>
      <td scope="row">#001</td>
      <td>
        <div className={"d-inline-block py-1 px-3 rounded-pill fw-500" + colorList[index % 3]}>Status</div>
      </td>
      <td>Natalie Portman</td>
      <td>
        02 July, 2023
      </td>
      <td>
        12 July, 2023
      </td>
      <td>
        <b>900.00 USD</b>
      </td>
    </tr>
  )
}


function TransactionList({ setShowDetails }) {
  const rows = [1, 2, 3];
  const [val, setVal] = useState();
  const options = [
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'caramel', label: 'Caramel' },
    { value: 'mint', label: 'Mint' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'raspberry', label: 'Raspberry' },
    { value: 'hazelnut', label: 'Hazelnut' },
    { value: 'peanut_butter', label: 'Peanut Butter' },
    { value: 'coconut', label: 'Coconut' },
    { value: 'lemon', label: 'Lemon' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'pistachio', label: 'Pistachio' },
    { value: 'banana', label: 'Banana' },
    { value: 'butterscotch', label: 'Butterscotch' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'almond', label: 'Almond' },
    { value: 'cinnamon', label: 'Cinnamon' },
    { value: 'honey', label: 'Honey' },
    { value: 'orange', label: 'Orange' },
    { value: 'maple', label: 'Maple' }
  ]
  return (
    <div>
      <div className='row mt-3 mb-5 d-flex align-items-center'>
        <div className="col-12 col-md-4 my-2 my-lg-0">
          <div className='d-flex ms-md-3 me-md-1 border rounded-3 flex-fill py-2'>
            <button className="btn" type="submit" disabled  >
              <img src='/search.svg' />
            </button>
            <input
              className="form-control border-0"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </div>
        </div>
        <div className='col-12 col-md-4 my-2'>
          <div className='rounded-3 mx-md-1 border'>
            <CustomDateRange className="w-100" />
          </div>
        </div>
        <div className='col-12 col-md-4 my-2'>
          <div className='ms-md-1 me-md-3 h-100 py-2 border rounded-3'>
            <CustomSelect placeholder="Status" options={options} setValue={setVal} />
          </div>
        </div>

        <div className='col-12 blue100 text-center'>
          More Filters &#8964;
        </div>
      </div>

      <div className='mx-3'>
        <table className="table border">
          <thead className="table-light py-3">
            <tr className='grey1'>
              <th scope="col">Request #</th>
              <th scope="col">Status</th>
              <th scope="col">Payer</th>
              <th scope="col">Request Date</th>
              <th scope="col">Due Date</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody className='border-top-0'>
            <TableRow index={1} setShowDetails={setShowDetails} />
            <TableRow index={2} setShowDetails={setShowDetails} />
            <TableRow index={3} setShowDetails={setShowDetails} />
            <TableRow index={4} setShowDetails={setShowDetails} />
            <TableRow index={5} setShowDetails={setShowDetails} />
            <TableRow index={6} setShowDetails={setShowDetails} />
            <TableRow index={1} setShowDetails={setShowDetails} />
            <TableRow index={2} setShowDetails={setShowDetails} />
            <TableRow index={3} setShowDetails={setShowDetails} />
            <TableRow index={4} setShowDetails={setShowDetails} />
            <TableRow index={5} setShowDetails={setShowDetails} />
            <TableRow index={6} setShowDetails={setShowDetails} />
            <TableRow index={1} setShowDetails={setShowDetails} />
            <TableRow index={2} setShowDetails={setShowDetails} />
            <TableRow index={3} setShowDetails={setShowDetails} />
            <TableRow index={4} setShowDetails={setShowDetails} />
            <TableRow index={5} setShowDetails={setShowDetails} />
            <TableRow index={6} setShowDetails={setShowDetails} />


          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionList