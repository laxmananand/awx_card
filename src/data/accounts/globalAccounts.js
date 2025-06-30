import Axios, { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

export const symbol = {
  USD: "$",
  SGD: "S$",
  GBP: "£",
  EUR: "€",
  HKD: "HK$",
  AUD: "A$",
};

export const fullform = {
  AED: "United Arab Emirates Dirham",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  BDT: "Bangladeshi Taka",
  BRL: "Brazilian Real",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
  COP: "Colombian Peso",
  CZK: "Czech Koruna",
  DKK: "Danish Krone",
  EGP: "Egyptian Pound",
  EUR: "Euro",
  GBP: "British Pound Sterling",
  HKD: "Hong Kong Dollar",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Shekel",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  MAD: "Moroccan Dirham",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  NGN: "Nigerian Naira",
  NOK: "Norwegian Krone",
  NZD: "New Zealand Dollar",
  NPR: "Nepalese Rupee",
  OMR: "Omani Rial",
  PEN: "Peruvian Sol",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Złoty",
  QAR: "Qatari Riyal",
  RON: "Romanian Leu",
  RUB: "Russian Ruble",
  SAR: "Saudi Riyal",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  THB: "Thai Baht",
  TRY: "Turkish Lira",
  TWD: "New Taiwan Dollar",
  UAH: "Ukrainian Hryvnia",
  USD: "United States Dollar",
  VND: "Vietnamese Dong",
  ZAR: "South African Rand",
  BOB: "Bolivian Boliviano",
  BHD: "Bahraini Dinar",
  HRK: "Croatian Kuna",  
  LKR: "Sri Lankan Rupee",
  UYU: "Uruguayan Pes"
};

export const flag = {
  AUD: "https://stylopay-sandbox-us-east-1-dev-dump.s3.amazonaws.com/flags/flag/AUD.svg",
  EUR: "https://stylopay-sandbox-us-east-1-dev-dump.s3.amazonaws.com/flags/flag/EUR.svg",
  GBP: "https://stylopay-sandbox-us-east-1-dev-dump.s3.amazonaws.com/flags/flag/GBP.svg",
  HKD: "https://stylopay-sandbox-us-east-1-dev-dump.s3.amazonaws.com/flags/flag/HKD.svg",
  SGD: "https://stylopay-sandbox-us-east-1-dev-dump.s3.amazonaws.com/flags/flag/SGD.svg",
  USD: "https://stylopay-sandbox-us-east-1-dev-dump.s3.amazonaws.com/flags/flag/USD.svg",
};

// AWX Account ID / Business ID
// const awxAccountId = useSelector((state) => state.auth.awxAccountId);

export const getCurrenciesList = async (custHashId) => {

  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/fetchBalance", {
        params: {
          custHashId: custHashId,
        },
      });
      const currencyList = response.data;
      if (currencyList && currencyList.length > 0) {
        const filterData = currencyList.map((item) => ({
          name: item.curSymbol,
          balance: item.balance,
        }));

        // setSelect(newSelect);
        console.warn(filterData, 1212);

        return filterData;
      } else if (currencyList && currencyList.length == 0) {
        const filterData = currencyList.map((item) => ({
          name: "No currency available",
          balance: 0.0,
        }));

        return filterData;
      } else {
        toast.error(currencyList.message);
      }
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
    }
  }
};

// get account Details

export const getActivatedBankAccount = async (currencyCode) => {
  const custHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);

  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/fetchAccountDetails", {
        params: {
          currencyCode: currencyCode,
          custHashId: custHashId,
        },
      });
      const filterData = response.data;

      if (filterData && filterData.hasOwnProperty("content") && filterData.content.length == 0) {
        toast.error("No account available!");
      } else if (filterData && filterData.hasOwnProperty("content") && filterData.content.length > 0) {
        console.log(filterData);
        return filterData.content;
      } else if (
        filterData &&
        filterData.hasOwnProperty("status") &&
        filterData.message == "No virtual account found for wallet"
      ) {
        return;
      } else {
        toast.error(filterData.message);
      }
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
    }
  }
};

//Bank names

export const getBankAccountForCreate = async (currencyCode) => {
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/bankName", {
      params: {
        currencyCode: currencyCode,
      },
    });
    // conditions to set only unique bank names
    const bankList = response.data;
    if (bankList && bankList.length > 0) {
      const uniqueBankNames = new Set();
      const reFormat = bankList.reduce((acc, item) => {
        if (!uniqueBankNames.has(item.bankName)) {
          uniqueBankNames.add(item.bankName);
          acc.push({
            value: item.bankName,
            label: item.fullBankName,
          });
        }
        return acc;
      }, []);

      console.log(reFormat);

      return reFormat;
    } else {
      toast.error(bankList.message);
    }
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
  }
};

//Create Account

export const createAccount = async (formData,custHashId) => {
  var closeButton = document.getElementById("addAccountModalCloseButton");

  var platform = formData?.platform;

  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    try {
        var buttonText = document.getElementById("button-text");
        var buttonLoader = document.getElementById("button-loader");

        buttonText.style.display = "none";
        buttonLoader.style.display = "flex";

        const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/createAccount", {
          params: {
            bankName: formData?.bankName || "",
            currencyCode: formData?.currencyCode,
            label: formData?.label,
            custHashId: custHashId,
            platform: platform || "",
            authToken: formData?.authToken || ""
          },
        });

        let obj = response.data;

        console.log(obj);

        buttonText.style.display = "flex";
        buttonLoader.style.display = "none";

    if(platform === "awx"){
        if (obj?.status === "success" ) {
         toast.success("Account Created Successfully!");
         closeButton.click();
         return obj;
        } else if (obj?.error) {
          toast.success(obj?.message);
          closeButton.click();
        return obj;
       } else {
        return obj;
       }
    }
    else{
       if (obj.hasOwnProperty("uniquePaymentId")) {
          toast.success("Account Created Successfully!");
          closeButton.click();
          return obj;
        } else if (obj.status == "BAD_REQUEST") {
          return obj;
        } else {
          return obj;
        }
      }
      
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
      if (error instanceof AxiosError) {
        if (error.response && error.response.data && error.response.data.hasOwnProperty("label") && error.response.data.status === 'BAD_REQUEST' ){
          toast.error(error.response.data.label);
          buttonText.style.display = "flex";
          buttonLoader.style.display = "none";
          return "error";
        }
        else if (error.response && error.response.data && error.response.data.status === 'BAD_REQUEST'){
          toast.error(error.response.data.message);
          buttonText.style.display = "flex";
          buttonLoader.style.display = "none";
          return "error";        
        }
        else{
          toast.error(error.response.data.message);
          buttonText.style.display = "flex";
           buttonLoader.style.display = "none";
          return "error";
        }
      }
      else{
      toast.error("Something went wrong! Please try again later.");
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";
      return "error";
     
      }
    }
  }
};

// get rate

export const getRate = async (convAmount, fromRate, toRate, platform, awxAccountId, authToken) => {

  if (convAmount == "" || convAmount == 0 || convAmount == undefined) {
    toast.error("Please Enter Valid Amount!");
  } else if (fromRate == "" || fromRate == undefined) {
    toast.error("Please Select Convert Currency!");
  } else if (toRate == "" || toRate == undefined) {
    toast.error("Please Select Destination Currency!");
  } else {
    try{
    document.getElementById('conversionButton').disabled = true;
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/exchangerate", {
      params: {
        convertAmount: convAmount,
        convertCurrency: fromRate,
        destinationCurrency: toRate,
        platform: platform || "",
        userId: awxAccountId || "",
        authToken: authToken || ""
      },
    });

    let obj = response.data;
    console.log("GetRate"+obj);

    if(platform==="awx"){
      document.getElementById('conversionButton').disabled = false;

      if(obj?.status==="success"){
      return obj?.data;
    }
    else if (obj?.status === "BAD_REQUEST"){
      toast.error(obj.message);
    }
    else{
      if(obj?.message){
        toast.error(obj.message);
      }
      else{
        toast.error("Something went wrong! Please try again later.");
      }
    }

    }
    else{
    document.getElementById('conversionButton').disabled = false;

    if (obj.exchangeRate !== "") {
      return obj;
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      toast.error(obj.message);
    }
  }
  }
  catch (error) {
    // Handle any errors here
    console.error("Error:", error);
    if (error instanceof AxiosError) {
  
      if (error.response && error.response.data && error.response.data.status === 'BAD_REQUEST'){
        console.log(error.response.data.message);      
      }
      else{
        console.log(error.response.data.message);
      }
    }
    else{
    toast.error("Something went wrong! Please try again later.");
    }
  }
  }
};

// get rate for currency graph

export const getRateGraph = async (convAmount, fromRate, toRate) => {
  var convertAmount = convAmount;
  var convertCurrency = fromRate;
  var destinationCurrency = toRate;

  try{

  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/exchangerate", {
    params: {
      convertAmount: convertAmount,
      convertCurrency: convertCurrency,
      destinationCurrency: destinationCurrency,
    },
  });

  let obj = response.data;
  console.log(obj);

  if (obj) {
    if (obj.netExchangeRate !== "") {
      return obj?.netExchangeRate;
    } else {
      toast.error(obj.message);
    }
  } else if (obj.status == "BAD_REQUEST") {
    toast.error(obj.message);
  } else {
    toast.error(obj.message);
  }
}
catch (error) {
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
}
};

//Convert Amount

export const convertAmount = async (formData, custHashId, platform, authToken) => {

  if (custHashId == "" || custHashId == null) {
    toast.error("Please activate your account first!");
  } else if (formData.fromAmount == "" || formData.fromAmount == undefined) {
    toast.error("Please enter valid amount!");
  } else if (formData.fromVal == "" || formData.fromVal == undefined) {
    toast.error("Please select source currency!");
  } else if (formData.toVal == "" || formData.toVal == undefined) {
    toast.error("Please select destination currency!");
  } else {
    try{

    var buttonText = document.getElementById("button-textTwo");
    var buttonLoader = document.getElementById("button-loaderTwo");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";
    document.getElementById('conversionButton').disabled = true;

    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/amountConversion", {
      params: {
        amount: formData.fromAmount,
        destinationAmount: null,
        destinationCurrency: formData.toVal,
        sourceCurrency: formData.fromVal,
        customerComments: null,
        custHashId: custHashId,
        quoteId: formData?.quoteId || "",
        platform: platform,
        authToken: authToken || ""
      },
    });

    let obj = response.data;
    console.log(obj);

    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";

  if(platform==="awx"){
      if(obj?.status === "success"){
        toast.success("Amount Converted Successfully!");
        document.getElementById('conversionButton').disabled = false;
        return obj;
      }
      else if(obj?.status==="error"){
        toast.error(obj.message);
        document.getElementById('conversionButton').disabled = false;
      }
      else {
        if(obj?.message){
          toast.error(obj.message);
        }
        else{
          toast.error("Conversion is not working right now! please try again later.");
        }
        document.getElementById('conversionButton').disabled = false;
      }
    }
  else{
     if (obj.hasOwnProperty("systemReferenceNumber")) {
      toast.success("Amount Converted Successfully!");
      document.getElementById('conversionButton').disabled = false;
      return obj;
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
      document.getElementById('conversionButton').disabled = false;

    } else {
      toast.error(obj.message);
      document.getElementById('conversionButton').disabled = false;

    }
  }
  }
  catch (error) {
    // Handle any errors here
    console.error("Error:", error);
    if (error instanceof AxiosError) {
     if (error.response && error.response.data && error.response.data.status === 'BAD_REQUEST'){
        toast.error(error.response.data.message);
        buttonText.style.display = "flex";
        buttonLoader.style.display = "none";
        document.getElementById('conversionButton').disabled = false;        
      }
      else{
        toast.error(error.response.data.message);
        buttonText.style.display = "flex";
         buttonLoader.style.display = "none";
         document.getElementById('conversionButton').disabled = false;
      }
    }
    else{
    toast.error("Something went wrong! Please try again later.");
    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";
    document.getElementById('conversionButton').disabled = false;
    }
  }
  }
};

// recent transactions List

export const recentTransactionData = async (custHashId) => {

  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    try {
      const initialData = await Axios.get(sessionStorage.getItem("baseUrl") + "/AccountsRoutes/transactionHistory", {
        params: {
          page: 1,
          size: 10,
          startDate: "", // Use currentDate here
          endDate: "",
          transactionType: "",
          custHashId: custHashId
        },
      });

      const obj = initialData.data;
      console.log(obj);

      if (obj.length === 0) {
        toast.error("No transactions recorded!");
      } else if (obj.status === "BAD_REQUEST") {
        toast.error(obj.message);
      } else {
        var contents = obj.content;
        const groupedData = contents.reduce((groups, dataItem) => {
          const date = dataItem.dateOfTransaction;
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(dataItem);
          return groups;
        }, {});

        const groupedArray = Object.entries(groupedData).map(([date, items]) => ({
          dateOfTransaction: date,
          data: items,
        }));

        return groupedArray;
      }
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
      return [] ;
    }
  }
};
