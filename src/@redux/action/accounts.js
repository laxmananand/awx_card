import axios from "axios";
import { toast } from "react-toastify";
import { setBankDetails, setCurrencyList, setType, startLoading, stopLoading, setConversionHistory, setTxnHistoryPayments} from "../features/accounts";
import {setTxnData} from "../features/payments";

export const getBankDetails = (currencyCode,custHashId) => async (dispatch, getState) => {

    dispatch(startLoading())
    dispatch(setType(currencyCode))

    let platform = getState().common.platform;

    if (!(custHashId == "" || custHashId == null)) {
        try {
            const response = await axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/fetchAccountDetails", {
                params: {
                    currencyCode: currencyCode,
                    custHashId: custHashId,
                    platform: platform,
                    authToken: getState().auth.authCode

                },
            });
            const filterData = response.data;

      // configuration for Air Wallex
      if(platform === "awx"){
        if (filterData?.status=="success" && filterData?.data.length == 0) {
            dispatch(setBankDetails([]));       
        }
        else if (filterData?.status=="success" && filterData?.data.length > 0){
          dispatch(setBankDetails(filterData.data));
        }
        else if (filterData?.status == "error" && filterData?.message){
          toast.error(filterData?.message);
        }
        else{
          dispatch(setBankDetails([]));
        }
      }

      // configuration for nium
        else{
            if (filterData?.hasOwnProperty("content") && filterData?.content?.length == 0) {
              dispatch(setBankDetails([]));

            } else if (filterData?.hasOwnProperty("content") && filterData?.content?.length > 0) {
                dispatch(setBankDetails(filterData.content));
            } else if (!(
                filterData?.hasOwnProperty("status") &&
                filterData?.message == "No virtual account found for wallet"
            )) {
                toast.error(filterData.message);
            }
          }
            dispatch(stopLoading())
        } catch (error) {
          console.log(error);
          dispatch(stopLoading())
      }
    }
};

export const getCurrencyList = (custHashId) => async (dispatch, getState) => {
    dispatch(startLoading())

        try {
          if (!(custHashId == "" || custHashId == null)) {
            const response = await axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/fetchBalance", {
                params: {
                    custHashId: custHashId,
                    platform: getState().common.platform,
                    authToken: getState().auth.authCode
             },
            });
            const currencyList = response.data;
            if (currencyList && currencyList.length > 0) {
                const filterData = currencyList.map((item) => ({
                    name: item?.curSymbol || item?.currency ,
                    balance: item?.balance || item?.available_balance,
                }));

                dispatch(setCurrencyList(filterData));
                dispatch(setType(filterData[0]?.name))
            } else if (currencyList && currencyList.length == 0) {
                const filterData = {
                    name: "",
                    balance: 0,
                };

                dispatch(setCurrencyList(filterData));
                dispatch(setType(filterData[0]?.name))

            } else {
                console.log(currencyList.message);
            }
        }
        else{
          const filterData = [
                  {name: 'SGD', balance: 0},
                  {name: 'USD', balance: 0},
                  {name: 'GBP', balance: 0},
                  {name: 'EUR', balance: 0},
                  {name: 'HKD', balance: 0},
                  {name: 'AUD', balance: 0}
          ]
          dispatch(setCurrencyList(filterData));
          dispatch(setType(filterData[0]?.name))
        }
        
        dispatch(stopLoading())
       } 
       catch (error) {
            console.log(error)
            dispatch(stopLoading())
        }
    };

// recent Conversion List

export const recentConversionData = (custHashId) => async (dispatch, getState) => {

    // dispatch(startLoading())

    var platform = getState().common.platform || "";
  
    if (!(custHashId == "" || custHashId == null)) {
        try {
  
            const initialData = await axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/transactionHistory", {
              params: {
                page: 1,
                size: 5,
                startDate: "", // Use currentDate here
                endDate: "",
                transactionType: "Wallet_Fund_Transfer",
                custHashId: custHashId,
                platform: platform,
                authToken: getState().auth.authCode || ""
              },
            });
      
            const obj = initialData.data;
            console.log(obj);
      
            if (obj.length === 0) {
              toast.error("No conversions recorded!");
            } else if (obj.status === "BAD_REQUEST") {
              toast.error(obj.message);
            } else {
              var contents = "";
              var groupedData = "";
              var date = "";

              if (platform==="awx"){

                 contents = obj?.data[0]?.conversions;
                 groupedData = contents.reduce((groups, dataItem) => {
                 date = new Date(dataItem.conversionTime).toISOString().split('T')[0];

                  if (!groups[date]) {
                    groups[date] = [];
                  }
                  groups[date].push(dataItem);
                  return groups;
                }, {});
              }
              else{
               contents = obj.content;
               groupedData = contents.reduce((groups, dataItem) => {
               date = dataItem.dateOfTransaction;
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(dataItem);
                return groups;
              }, {});
              }
      
              const groupedArray = Object.entries(groupedData).map(([date, items]) => ({
                dateOfTransaction: date,
                data: items,
              }));

              if ((groupedArray == [])||(groupedArray.length==0)){
                dispatch(setConversionHistory("**No recent conversions in the last 7 days**"));
              }
           else{
            dispatch(setConversionHistory(groupedArray));              }
              
            }
        //   dispatch(stopLoading())
          }  catch (error) {
            // Handle any errors here
            console.error("Error:", error);
            if (error instanceof AxiosError) {
          
              if (error.response && error.response.data && error.response.data.status === 'BAD_REQUEST'){
                toast.error(error.response.data.message);      
              }
              else{
                toast.error(error.response.data.message);
              }
            }
            else{
            toast.error("Something went wrong! Please try again later.");
            }
            dispatch(stopLoading())
            dispatch(setConversionHistory("**No recent conversions in the last 7 days**"));
          }
    } else {
      dispatch(setConversionHistory("**No recent conversions in the last 7 days**"));
    }
}

// recent transactions List for payments

export const transactionDetailsPayments = (formData,custHashId) => async (dispatch, getState) => {

  // if(!(getState().accounts?.txnHistoryPayments?.data?.length))
  var platform =  getState().common.platform;

  dispatch(startLoading())

    const size = 20;
        
    if (custHashId == "" || custHashId == null) {
      dispatch(stopLoading())
      return [];
     
    } else {
      try {
        const endDate = new Date().toISOString();
  
        console.log("Current Date:", endDate);
  
        var endDateParse = Date.parse(endDate);
  
        var endDateObj = new Date(endDateParse);
  
        var endDD = String(endDateObj.getDate()).padStart(2, "0");
        var endMM = String(endDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
        var endYYYY = endDateObj.getFullYear();
  
        var endDateFormat = endYYYY + "-" + endMM + "-" + endDD;
  
        console.log(`End Date: ${endDateFormat}`);
  
        const startDateSevenDaysAgo = new Date(endDateParse - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days in milliseconds
  
        var startDateObj = new Date(startDateSevenDaysAgo);
  
        const startDD = String(startDateObj.getDate()).padStart(2, "0");
        const startMM = String(startDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
        const startYYYY = startDateObj.getFullYear();
  
        const startDateFormat = startYYYY + "-" + startMM + "-" + startDD;
  
        console.log(`State Date: ${startDateFormat}`);
        dispatch(setTxnData(formData));
  
        const initialData = await axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/transactionHistory", {
          params: {
            page: formData?.currentPage || 1,
            size: size,
            startDate: formData?.fromDate && formData.fromDate.trim() !== "" ? formData.fromDate : startDateFormat,
            endDate: formData?.toDate && formData.toDate.trim() !== "" ? formData.toDate : endDateFormat,
            transactionType: formData?.txnType || "",
            systemReferenceNumber: formData?.txnId || "", 
            custHashId: custHashId,
            platform: platform,
            authToken: getState().auth.authCode || "",
            accountId: formData?.accountId || ""
          },
        });
  
        const obj = initialData.data;
        console.log(obj);
        dispatch(stopLoading())
  
        if (obj.length === 0) {
          toast.error("No transactions recorded!");
        } else if (obj.status === "BAD_REQUEST") {
          toast.error(obj.message);
        } else {

          var contents = "";
          var groupedData = "";
          var date = "";

        if(platform === "awx"){
            // if(formData?.txnType === "All"){

             contents = obj?.data;
             groupedData = contents.reduce((groups, dataItem) => {
             date = new Date(dataItem.create_time).toISOString().split('T')[0];

            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(dataItem);
            return groups;
          }, {});
            
          
        //   if(formData?.txnType === "Deposits"){

        //     contents = obj?.data;
        //     groupedData = contents.reduce((groups, dataItem) => {
        //     date = new Date(dataItem.create_time).toISOString().split('T')[0];

        //    if (!groups[date]) {
        //      groups[date] = [];
        //    }
        //    groups[date].push(dataItem);
        //    return groups;
        //  }, {});
           
        //  }

        //  if(formData?.txnType === "Payouts"){
        //    return;    
        //   contents = obj?.data;
        //   groupedData = contents.reduce((groups, dataItem) => {
        //   date = new Date(dataItem.create_time).toISOString().split('T')[0];

        //  if (!groups[date]) {
        //    groups[date] = [];
        //  }
        //  groups[date].push(dataItem);
        //  return groups;
        //  }, {});
        
      }
      else{

           contents = obj.content;
           groupedData = contents.reduce((groups, dataItem) => {
           date = dataItem.dateOfTransaction;
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(dataItem);
            return groups;
          }, {});
        }
  
          const groupedArray = Object.entries(groupedData).map(([date, items]) => ({
            dateOfTransaction: date,
            data: items,
          }));

  if(platform === "awx"){
    if ((groupedArray == [])||(groupedArray.length==0)){
      dispatch(setTxnHistoryPayments({totalPages: 1, data: "**No transactions found**"}));
    }
    else{
    dispatch(setTxnHistoryPayments({ totalPages: 1, data: groupedArray }));
  }
  }
  else{
    if ((groupedArray == [])||(groupedArray.length==0)){
      dispatch(setTxnHistoryPayments({totalPages: obj.totalPages, data: "**No transactions found**"}));
    }
    else{
    dispatch(setTxnHistoryPayments({ totalPages: obj.totalPages, data: groupedArray }));
  }
  }
         
      }
      }  catch (error) {
        // Handle any errors here
        console.error("Something went wrong! Please try again later.");
        
        dispatch(setTxnHistoryPayments({ data: "**No transactions found**" }));
        // Handle the error as needed
      }
    }
  };