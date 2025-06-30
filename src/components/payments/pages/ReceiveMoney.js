import React, { useState } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import TransactionList from "./ReceiveMoney/TransactionList";
import DetailsBar from "./ReceiveMoney/DetailsBar";
import CreateNewRequest from "./ReceiveMoney/CreateNewRequest";

function RequestMoney() {
  const [showDetails, setShowDetails] = useState(false);
  const currencies = [true, true, true, true, false, false];
  const [showArray, setShowArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [activeArray, setActiveArray] = useState(
    new Array(currencies.length).fill(false)
  );

  const handleShow = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setShowArray(array);
  };

  const handleActive = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setActiveArray(array);
  };

  return (
    <>
      <BreadCrumbs
        data={{
          name: "Request Money",
          img: "/arrows/arrowLeft.svg",
          backurl: "/payments",
          info: true,
        }}
      />

      {/* <div className='d-flex'>
        <div className='row m-3 bg-white border p-4 d-flex rounded-3 flex-fill'>
          <div className='p-3 d-flex justify-content-between align-items-baseline'>
            <div>
              <img src="/payments/request-money.svg" className={'bg-green10 p-3 rounded-4 border d-block'} />
              <h5 className='text-nowrap m-0 mt-3 d-inline-block'>Request Money</h5>
            </div>

            <div className='text-white d-flex align-items-center'>
              <CreateNewRequest />
            </div>
          </div>

          <TransactionList setShowDetails={setShowDetails}/>

        </div>

        {
          showDetails && <DetailsBar setShowDetails={setShowDetails} handleShow={handleShow} handleActive={handleActive} />
        }
      </div> */}

      <div className="text-center h3 my-5">Coming Soon...</div>
    </>
  );
}

export default RequestMoney;
