import React, { useEffect, useState } from "react";
import EachCurrencies from "./EachCurrencies";
import { Link } from "react-router-dom";
import { getBankAccountForCreate, getCurrenciesList, symbol, flag } from "../../data/accounts/globalAccounts";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../accounts/css/accounts.css"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function Currencies({ isActivated }) {
  const [currencies, setCurrencies] = useState([]);
  const [type, setType] = useState("");
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const custHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);

  useEffect(() => {
    const fetchCurrencies = async () => {
      const currencyList = await getCurrenciesList(custHashId);
      if (currencyList.length > 0) {
        setCurrencies(currencyList);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        //toast.error("Oops! It seems there's no currency available at the moment.");
        return;
        
      }
    };

    fetchCurrencies();
  }, []); // This effect runs only once on component mount

  useEffect(() => {
    if (currencies) {
      setType(currencies[0]?.name);
      changeCurrency(currencies[0]?.name);
    }
  }, [currencies]);

  const changeCurrency = (type) => {
    setType(type);
    currencies?.map((currency) => {
      if (currency.name === type) setBalance(symbol[type] + " " + currency.balance);
    });
  };

  // useEffect(()=> {
  //   if (options.length > 0)
  //     handleSelectChange(options[0])
  // }, [options])

  // const handleSelectChange = (selectedOption) => {
  //   setSelectedOption(selectedOption);
  //   setTotalBal(selectedOption.value);
  // };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: '135px', // Adjust the width as needed
      height: '42px',
      fontSize: "18px",
      position: "relative",
      marginB : "20px"
    }),
  };

  const options = currencies.map((currency) => ({
    value: currency.name,
    label: (
      <div>
        <img src={flag[currency.name]} alt={currency.name} width={30} /><> </>
        <strong>{currency.name}</strong>
      </div>
    ),
  }));

  return (
    <div className="border-bottom bg-white pt-2 h-100">
      <div className="d-flex justify-content-between px-3 flex-wrap">
        <div className="d-flex align-items-center">
          <img src="/bank.svg" className="me-2" />
          <SkeletonTheme baseColor="#E0E0E0" highlightColor="#D4F1F4">
          {isLoading ? (
                    <> 
                <h3 className='text-nowrapd m-0 d-flex fw-500'>
                    Total Balance:&nbsp;<span className='fw-600'><Skeleton width={250} height={35} style={{ borderRadius: "15px" }} /></span>
                  </h3>
                </>
          ):(
            <>
          <h3 className="text-nowrapd m-0 d-flex fw-500">
            Total Balance:&nbsp;<span className="fw-600">{balance}</span>
          </h3>
          <div id="accountsCuurencyDropdown" style={{marginLeft: "-345px", marginTop: "40px", padding:"10px" }}>
                        <div className="custom-select-container">
                        <div className="custom-select" style={{width:"135px"}}>
                            <Select
                              styles={customStyles}
                              value={options.find((option) => option.value === type)}
                              onChange={(selectedOption) => changeCurrency(selectedOption.value)}
                              options={options}
                            />
                          </div>
                        </div>

                      </div>
                      </>
          )}
                      </SkeletonTheme>
        </div>
      </div>
      <div className="d-flex overflow-auto">
        <EachCurrencies
          index={0}
          key={0}
          options="USD"
          type="USD"
          isActivated={isActivated}
          setShowDetails={() => {}}
          showArray={[]}
          handleShow={() => {}}
          handleActive={() => {}}
          activeArray={[]}
        />
        <EachCurrencies
          index={1}
          key={1}
          options="SGD"
          type="SGD"
          isActivated={isActivated}
          setShowDetails={() => {}}
          showArray={[]}
          handleShow={() => {}}
          handleActive={() => {}}
          activeArray={[]}
        />
        <EachCurrencies
          index={2}
          key={2}
          options="EUR"
          type="EUR"
          isActivated={isActivated}
          setShowDetails={() => {}}
          showArray={[]}
          handleShow={() => {}}
          handleActive={() => {}}
          activeArray={[]}
        />
        <EachCurrencies
          index={3}
          key={3}
          options="AUD"
          type="AUD"
          isActivated={isActivated}
          setShowDetails={() => {}}
          showArray={[]}
          handleShow={() => {}}
          handleActive={() => {}}
          activeArray={[]}
        />
        <EachCurrencies
          index={4}
          key={4}
          options="HKD"
          type="HKD"
          isActivated={isActivated}
          setShowDetails={() => {}}
          showArray={[]}
          handleShow={() => {}}
          handleActive={() => {}}
          activeArray={[]}
        />
        <EachCurrencies
          index={5}
          key={5}
          options="GBP"
          type="GBP"
          isActivated={isActivated}
          setShowDetails={() => {}}
          showArray={[]}
          handleShow={() => {}}
          handleActive={() => {}}
          activeArray={[]}
        />
      </div>
      {!isActivated && (
        <p className="px-3 mt-3">
          <span className="fw-normal">You will be able to create accounts in multiple currencies after </span>
          <Link to="/onboarding/Home" className="blue100 fw-bolder ms-0">
            Activating Your Account
          </Link>
          .
        </p>
      )}
    </div>
  );
}

export default Currencies;
