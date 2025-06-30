import React, { useEffect, useState } from 'react';
import CustomSelect from '../structure/CustomSelect';
import { getRateGraph, flag } from '../../data/accounts/globalAccounts';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../../loading_Skeleton/Skeleton.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../accounts/css/accounts.css";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencyList } from '../../@redux/action/accounts';
import Select from 'react-select';




function CurrencyGraph() {

  const currencies = useSelector(state => state.accounts.currencyList)
  const dispatch = useDispatch();
  const custHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);


  const options = currencies.map((currency) => ({
    value: currency.name,
    label: (
      <div>
        <img src={flag[currency.name]} alt={currency.name} width={30} /><> </>
        <strong>{currency.name}</strong>
      </div>
    ),
  }));

  useEffect(() => {
    dispatch(getCurrencyList(custHashId))
  }, [])

  const [selectCurr, setSelectCurr] = useState('SGD');
  const [amount, setAmount] = useState('0');
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchRate = async () => {
      if (selectCurr) {
        try {
          const rate = await getRateGraph(1, selectCurr, "USD");
          setAmount(Number(rate));
          setIsLoading(false);
        } catch (error) {
          toast.error("Something went wrong! Please try again later.")
          setIsLoading(false);
        }
      }
    };
    
    fetchRate();
  }, [selectCurr]);

   // Filter options to exclude "USD" if already selected
   const filteredOptions = options.filter(option => option.value !== 'USD');

   const customStyles = {
     control: (base, state) => ({
       ...base,
       width: '135px', // Adjust the width as needed
       height: '42px',
       fontSize: "18px",
       position: "relative"
     }),
   };

  return (
    <div className='mx-3 row border p-3 bg-white'>
    <div className='col-6 h4'>
      1 {selectCurr} = <SkeletonTheme color="#F0F0F0" highlightColor="#D4F1F4">
        {isLoading ? (
          <span className='fw-600'><Skeleton width={120} height={25} style={{borderRadius: "10px"}}/></span>
          
        ) : (
          `${amount} USD`
        )}
      </SkeletonTheme>
    </div>
    <div className='col-4  my-auto mx-auto grey1 rounded-3 text-wrap'> 
     <div id='accountsCuurencyDropdown'>
        <div className='custom-select-container' style={{width:"220%"}}>
        <Select
              styles={customStyles}
              value={options.find((option) => option.value === selectCurr)}
              onChange={(selectedOption) => setSelectCurr(selectedOption.value)}
              options={filteredOptions}
            />
        </div>
      </div>
      </div>
      <p className='h5'>Today</p>
      <div className='row grey1 fw-normal'>
        <img src='/graph.svg' className='d-inline-block col-9' alt='Graph' />
        <p className='text-center col-3 my-3'>
          1,313
          <br />
          <br />
          1,291
          <br />
          <br />
          1,269
        </p>
      </div>
      <div className='d-flex justify-content-between grey1 fw-normal'>
        <p className='col-9'>Month ago</p>
        <p className='text-center col-3'>Today</p>
      </div>
    </div>
  );
}

export default CurrencyGraph;