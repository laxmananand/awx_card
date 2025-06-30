import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import CustomSelect from "../../../structure/CustomSelect";
import Select from "react-select";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "react-toastify";

function CustomTax({ id, handleTaxChange, handleTaxMessage, setTaxPercentage }) {
  const [selectedTaxType, setSelectedTaxType] = useState(''); // State to manage the selected tax type
  // const [taxPercentage, setTaxPercentage] = useState(''); // State to manage the user-input tax percentage

  
  const handleSaveChanges = () => {
    // Validate if both tax type and percentage are provided
    if (selectedTaxType) {
      const finalTax = `${selectedTaxType}:`;
      // Assuming you have a handleTaxChange function
      // handleTaxChange(taxPercentage);
      handleTaxMessage(`${selectedTaxType}:`)
    } else {
      // Handle the case where either tax type or percentage is not provided
      console.error('Please select a tax type and enter the tax percentage.');
    }
  };
  
  return (
    <>
      <div
        className="modal fade"
        id={"customTaxModal_" + id}
        tabIndex={-1}
        aria-labelledby={"customTaxModalLabel_" + id}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff !important",
              padding: "0 10px",
              borderRadius: "1rem",
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title" id={"customTaxModalLabel_" + id}>
                Set your tax
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {/* Use a dropdown for predefined tax types */}
              <label htmlFor="taxTypeDropdown" className="form-label">
                Select tax type:
              </label>
              <select
                id="taxTypeDropdown"
                className="form-select"
                value={selectedTaxType}
                onChange={(e) => setSelectedTaxType(e.target.value)}
              >
                <option value="">Select Tax Type</option>
                <option value="GST">GST</option>
                <option value="VAT">VAT</option>
                <option value="Sales Tax">Sales Tax</option>
                {/* Add more tax types as needed */}
              </select>

              {/* Show an input field for tax percentage */}
              <div className="mt-3">
                <label htmlFor="taxPercentageInput" className="form-label">
                  Enter tax percentage:
                </label>
                <input
                  type="text"
                  id="taxPercentageInput"
                  className="form-control"
                  onChange={(e) => setTaxPercentage(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleSaveChanges} // Correct function call
                className="btn btn-primary rounded-5 py-2 px-4 d-flex align-items-center justify-content-center gap-2 fw-500"
                data-bs-dismiss="modal"
              >
                Save changes <img src="/payments/save.svg" alt="" width={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TableRow({
  data,
  index,
  onAmountChange,
  onItemChange,
  onPriceChange,
  onQuantityChange,
  onTaxChange,
  onDiscountChange,
  deleteRow,
  handleTaxChange,
}) {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState("");
  const [amount, setAmount] = useState("");
  const [taxMessage, setTaxMessage] = useState("");
  const [taxPercentage, setTaxPercentage] = useState(0);

  useEffect(()=>{
    if(taxPercentage){
      handleTaxChange(index, taxPercentage)
    }
  }, [taxPercentage])  

  useEffect(() => {
    setItem(data?.description);
    setPrice(data?.price);
    setQuantity(data?.quantity);
    setDiscount(data?.discount);
    setAmount(data?.amount);
    setTaxPercentage(data?.tax);
  }, [data]);

  const options = [
    { value: "0", label: "No Tax" },
    { value: "Custom", label: "Custom" },
  ];
  const placeholder = ["--Select Tax--"];
  const styles = {
    underline: {
      "&::before": {
        borderBottom: "none",
      },
      "&::after": {
        borderBottom: "none",
      },
    },
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        border: "none",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
    }),
  };

  const handleAmountChange = (event) => {
    const newValue = event.target.value;
    setAmount(newValue);
    onAmountChange(index, parseFloat(newValue) || 0);
  };

  const handleItemChange = (event) => {
    const newValue = event.target.value;
    setItem(newValue);
    onItemChange(index, {
      description: newValue,
      price,
      quantity,
      tax,
      discount,
    });
  };

  const handlePriceChange = (event) => {
    const newValue = event.target.value;
    setPrice(newValue);
    onPriceChange(index, parseFloat(newValue) || 0);
  };

  const handleQuantityChange = (event) => {
    const newValue = event.target.value;
    setQuantity(newValue);
    onQuantityChange(index, parseFloat(newValue) || 0);
  };

  // const handleTaxChange = (event) => {
  //   const newValue = event;
  //   console.log(newValue);
  //   setTax(newValue);
  //   onTaxChange(index, newValue);
  // };

  const handleTaxMessage = (message) => {
    setTaxMessage(message);
  };

  const handleDiscountChange = (event) => {
    const newValue = event.target.value;
    setDiscount(newValue);
    onDiscountChange(index, parseFloat(newValue) || 0);
  };
useEffect(() => {
  // Ensure both price and quantity are numbers
  const calculatedAmount =
    (parseFloat(price) || 0) * (parseFloat(quantity) || 0);
  
  // Calculate the tax based on the percentage
  const taxAmount = calculatedAmount * (parseFloat(taxPercentage) / 100 || 0);
  
  // Update the amount with tax included
  setAmount(calculatedAmount + taxAmount);
  onAmountChange(index, calculatedAmount + taxAmount);
}, [price, quantity, taxPercentage]);

const setTaxSelect = (val, index) => {
    if (val.value === "Custom") {
      const modal = document.getElementById(`customTaxModal_${index}`);
      if (modal) {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Use setTimeout to wait until the backdrop is added, then hide it
        setTimeout(() => {
          const modalBackdrop = document.querySelector(".modal-backdrop");
          if (modalBackdrop) {
            modalBackdrop.style.display = "none"; // Hides the backdrop
          }
        }, 100); // Delay to ensure the backdrop is rendered
      }
    }
  };

  return (
    <>
      <tr className="opacity-75">
        <td className="px-3 py-4">
          <TextField
            className="w-100"
            variant="standard"
            value={item}
            onChange={handleItemChange}
          />
        </td>
        <td className="px-3 py-4">
          <TextField
            variant="standard"
            type="number"
            value={price}
            onChange={handlePriceChange}
          />
        </td>
        <td className="px-3 py-4">
          <TextField
            variant="standard"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </td>
        <td className="px-3 py-4">
          {/* <TextField variant="standard" type='number'  value={tax} onChange={handleTaxChange} /> */}
          {!taxMessage && !taxPercentage && (
            <Select
              onChange={(val) => setTaxSelect(val, index)}
              className="text-nowrap"
              components={{ IndicatorSeparator: () => {} }}
              styles={customStyles}
              options={options}
              placeholder={placeholder || "--SELECT--"}
              defaultValue={options[0]}
            />
          )}

          {Boolean(taxPercentage) && (taxMessage || taxPercentage !== 0) && (
            <div className="d-flex align-items-center justify-content-between mx-2">
              <p className="m-0 p-0">{taxMessage + " " + taxPercentage}</p>{" "}
              <MdOutlineCancel
                onClick={() => setTaxMessage("")}
                role="button"
              />
            </div>
          )}
        </td>
        <td className="px-3 py-4">
          <TextField
            placeholder="%"
            variant="standard"
            type="number"
            value={discount}
            onChange={handleDiscountChange}
          />
        </td>
        <td className="px-3 py-4">
          <TextField
            variant="standard"
            type="number"
            id={`amount-${index}`}
            value={amount}
            onChange={handleAmountChange}
          />
        </td>
        <td className="">
          <button
            type="button"
            className="btn btn-outline-danger rounded-circle p-2"
            onClick={(e) => {
              e.preventDefault();
              deleteRow(index);
            }}
          >
            <AiOutlineDelete />
          </button>
        </td>
      </tr>
      <CustomTax
        key={index}
        id={index}
        value={tax}
        handleTaxMessage={handleTaxMessage}
        setTaxPercentage={setTaxPercentage}
      />
    </>
  );
}

function Items({
  setCurrentState,
  customername,
  getitems,
  setUrl,
  parsedCustomerdata,
  rows,
  setRows,
  nextValue,
  setNextValue,
  amounts,
  setAmounts,
  itemDetails,
  setItemDetails,
}) {
  const [totalTax, setTotalTax] = useState(0);

  const findNextIndex = () => {
    const existingIndices = new Set(rows);
    let index = 1;
    while (existingIndices.has(index)) {
      index++;
    }
    return index;
  };

  const addNewRow = (e) => {
    e.preventDefault();
    const newIndex = findNextIndex();
    setRows([...rows, newIndex]);
    setNextValue(nextValue + 1);
  };

  const deleteRow = (rowId) => {
    const newItemDetails = { ...itemDetails };
    delete newItemDetails[rowId];
    setItemDetails(newItemDetails);

    const newAmounts = { ...amounts };
    delete newAmounts[rowId];
    setAmounts(newAmounts);

    setRows(rows.filter((item) => item !== rowId));

    const totalTaxAmount = calculateTotalTax();
    setTotalTax(totalTaxAmount);
  };

  const handleAmountChange = (index, newValue) => {
    const validValue = newValue ? parseFloat(newValue) : "";
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [index]: validValue,
    }));
    setItemDetails((prevItemDetails) => ({
      ...prevItemDetails,
      [index]: {
        ...prevItemDetails[index],
        amount: validValue,
      },
    }));
    const totalTaxAmount = calculateTotalTax();
    setTotalTax(totalTaxAmount);
  };

  const handleItemChange = (index, newItemDetails) => {
    newItemDetails.slNo = index;
    setItemDetails((prevItemDetails) => ({
      ...prevItemDetails,
      [index]: newItemDetails,
    }));
  };

  const handlePriceChange = (index, newValue) => {
    const newAmount =
      newValue && itemDetails[index]?.quantity
        ? (parseFloat(newValue) * itemDetails[index].quantity).toFixed(2)
        : "";
    setItemDetails((prevItemDetails) => ({
      ...prevItemDetails,
      [index]: {
        ...prevItemDetails[index],
        price: parseFloat(newValue) || "",
        amount: newAmount,
      },
    }));
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [index]: parseFloat(newAmount) || "",
    }));
  };

  const handleQuantityChange = (index, newValue) => {
    const newAmount =
      itemDetails[index]?.price && newValue
        ? (itemDetails[index].price * parseFloat(newValue)).toFixed(2)
        : "";
    setItemDetails((prevItemDetails) => ({
      ...prevItemDetails,
      [index]: {
        ...prevItemDetails[index],
        quantity: parseFloat(newValue) || "",
        amount: newAmount,
      },
    }));
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [index]: parseFloat(newAmount) || "",
    }));
  };

  const handleTaxChange = (index, taxPercentage) => {
    setItemDetails((prevItemDetails) => ({
      ...prevItemDetails,
      [index]: {
        ...prevItemDetails[index],
        tax: taxPercentage,
      },
    }));
  };

  const handleDiscountChange = (index, newValue) => {
    const intValue =
      newValue === "" || newValue === null ? 0 : parseInt(newValue, 10);
    setItemDetails((prevItemDetails) => ({
      ...prevItemDetails,
      [index]: {
        ...prevItemDetails[index],
        discount: intValue,
      },
    }));
  };

  const calculateSubtotal = () => {
    let sum = 0;
    for (const index in amounts) {
      if (amounts[index]) sum += parseFloat(amounts[index]);
    }
    return sum.toFixed(2);
  };

  const calculateTotalTax = () => {
    let total = 0;
    for (const index in itemDetails) {
      const item = itemDetails[index];
      const amount = item.amount || 0;
      const taxPercentage = item.tax || 0;
      const taxAmount = (amount * taxPercentage) / 100;
      total += taxAmount;
    }
    return total.toFixed(2);
  };

  const calculatePayable = () => {
    let total = 0;
    for (const index in itemDetails) {
      const item = itemDetails[index];
      const amount = item.amount || 0;
      const taxPercentage = item.tax || 0;
      const taxAmount = (amount * taxPercentage) / 100;
      const discount = item.discount || 0;
      const discountAmount = (amount * discount) / 100;
      const subtotalWithoutTax = amount + taxAmount;
      const subtotalWithoutDiscount = subtotalWithoutTax - discountAmount;
      total += subtotalWithoutDiscount;
    }
    return total.toFixed(2);
  };

  const calculateDiscount = () => {
    let total = 0;
    for (const index in itemDetails) {
      const item = itemDetails[index];
      const amount = item.amount || 0;
      const discount = item.discount || 0;
      const discountAmount = (amount * discount) / 100;
      total += discountAmount;
    }
    return total.toFixed(2);
  };

  const handleNextClick = () => {
    for (const index in itemDetails) {
      const item = itemDetails[index];
      const itemNumber = parseInt(index);

      if (!item.description || item.description.trim() === "") {
        toast.error(`Item description is required for item ${itemNumber}`);
        return;
      }
      if (isNaN(item.price) || item.price <= 0) {
        toast.error(`Price is required for item ${itemNumber}`);
        return;
      }
      if (isNaN(item.quantity) || item.quantity <= 0) {
        toast.error(`Quantity is required for item ${itemNumber}`);
        return;
      }
      if (isNaN(item.discount) || item.discount < 0) {
        toast.error(`Discount percentage is required for item ${itemNumber}`);
        return;
      }
      if (isNaN(item.amount) || item.amount <= 0) {
        toast.error(`Amount is required for item ${itemNumber}`);
        return;
      }
    }

    const itemDetailsLength = Object.keys(itemDetails).length;
    const itemDetailsArray = Object.values(itemDetails);

    const itemsJSON = {
      items: itemDetailsArray,
      customername: customername,
      length: itemDetailsLength,
      Subtotal: calculateSubtotal(),
      Discount: calculateDiscount(),
      Tax: calculateTotalTax(),
    };
    getitems(itemsJSON);
    console.log(itemsJSON);
  };

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Invoice?"
    );
    if (confirmed) {
      console.log("Deleting the bill...");
      window.history.back();
    }
  };

  const tableHeaders = [
    {
      label: "Item Description",
      width: "250px",
      borderStyle: { borderTopLeftRadius: "8px" },
    },
    { label: "Price", width: "100px" },
    { label: "QTY", width: "100px" },
    { label: "Tax(%)", width: "150px" },
    { label: "Discount(%)", width: "100px" },
    { label: "Amount", width: "100px" },
    { label: "", width: "50px", borderStyle: { borderTopRightRadius: "8px" } }, // For the delete icon or action buttons
  ];

  return (
    <div>
      <div className="d-flex align-items-center my-4">
        <p className="m-0 mx-3 blue100 fw-500">1. Items</p>
        <img src="/payments/lineH_pending.svg" alt="step line" />
        <p className="m-0 mx-3 grey1 fw-normal">2. Details</p>
        <img src="/payments/lineH_pending.svg" alt="step line" />
        <p className="m-0 mx-3 grey1 fw-normal">3. Send</p>
      </div>

      <form
        className="rounded-4 my-4"
        style={{ border: "1px solid rgba(0,0,0,0.4)" }}
      >
        <table
          className="table mb-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        >
          <thead
            className="py-3"
            style={{
              background: "rgba(0,0,0, 0.4)",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <tr
              style={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  width={header.width}
                  style={header.borderStyle}
                >
                  <span className="text-light fw-500 px-2">{header.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-top-0 py-3">
            {rows.map((rowIndex) => (
              <TableRow
                key={rowIndex}
                index={rowIndex}
                data={itemDetails?.[rowIndex]}
                onAmountChange={handleAmountChange}
                onItemChange={(index, newItemDetails) =>
                  handleItemChange(index, newItemDetails)
                }
                onPriceChange={handlePriceChange}
                onQuantityChange={handleQuantityChange}
                onTaxChange={handleTaxChange}
                onDiscountChange={handleDiscountChange}
                deleteRow={deleteRow}
                handleTaxChange={handleTaxChange}
              />
            ))}
          </tbody>
        </table>
        <button
          className="btn w-100 blue100 fw-500 d-flex align-items-center justify-content-center py-3"
          onClick={(e) => addNewRow(e)}
        >
          <span>+ New Item</span>
        </button>
      </form>

      <div
        className="d-flex fw-normal align-items-center p-3 rounded-4 justify-content-start gap-5"
        style={{
          background: "rgba(0,0,0,0.1)",
          border: "1px solid lightgrey",
        }}
      >
        <div className="d-flex flex-fill justify-content-start gap-5">
          <div className="opacity-75 fw-500">Subtotal:</div>
          <div className="fw-600 opacity-50">{calculateSubtotal()} SGD</div>
        </div>
        <div className="d-flex flex-fill justify-content-start gap-5">
          <div className="opacity-75 fw-500">Discount:</div>
          <div className="fw-600 text-success">- {calculateDiscount()} SGD</div>
        </div>
        <div className="d-flex flex-fill justify-content-start gap-5">
          <div className="opacity-75 fw-500">Total Tax:</div>
          <div className="fw-600 text-danger">{calculateTotalTax()} SGD</div>
        </div>
        <div className="d-flex flex-fill justify-content-start gap-5">
          <div className="opacity-75 fw-500">Payable Amount:</div>
          <div className="fw-600 text-primary">{calculatePayable()} SGD</div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-5 flex-fill">
        <div className="d-flex">
          <button
            className="btn fw-500 bg-primary border me-2 py-2 px-4 rounded-5 text-light d-flex justify-content-center align-items-center gap-1"
            style={{ fontSize: "15px" }}
          >
            Save as Draft
            <img
              src="/payments/save.svg"
              className="ms-1"
              alt="save"
              width={20}
            />
          </button>
          <button
            className="btn fw-500 bg-danger border me-2 py-2 px-4 rounded-5 text-light d-flex justify-content-center align-items-center"
            onClick={handleDeleteClick}
            style={{ fontSize: "15px" }}
          >
            Delete
            <img
              src="/payments/delete.svg"
              className="ms-1"
              alt="delete"
              width={20}
            />
          </button>
        </div>
        <div>
          <button
            className="btn fw-500 bg-green100 text-white py-2 px-4 rounded-5"
            onClick={() => {
              setUrl("");
              handleNextClick();
            }}
          >
            Next to Details ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default Items;
