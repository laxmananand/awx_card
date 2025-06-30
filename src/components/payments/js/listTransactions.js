import Axios, { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Business transaction tag

export const businessTxnTag = async (formData,custHashId) => {

  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    var authCode = formData.txnId;
    var businessTag = formData.businessTag;
      try{
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/PaymentRoutes/businessTag", {
        params: {
          txnId: authCode,
          businessTag: businessTag,
          custHashId: custHashId
        },
      });
  
      let obj = response.data;
      console.log(obj);
      if ((obj.status == "OK")&&(obj.errors.length == 0)){
        return obj;
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
}
  };
  

// upload Reciept 

export const uploadReciept = async (formData,custHashId) => {

  const sendData = {
    document: formData?.baseFile,
    receiptFileName: formData?.fileName,
    receiptType: formData?.fileType
  }
 
   if (custHashId == "" || custHashId == null) {
     return [];
   } else {
       try{
       const response = await Axios.post(sessionStorage.getItem("baseUrl") + "/PaymentRoutes/uploadReciept", sendData ,{
         params: {
           txnId: formData?.txnId,
           custHashId: custHashId
         },
       });
   
       let obj = response.data;
       console.log(obj);
       if ((obj.status == "OK")&&(obj.errors.length == 0)){
        toast.success("Transaction receipt uploaded successfully!");
        setTimeout(function() {
          window.location.href = "/payments/transactions";
      }, 3000);
         return obj;
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
 }
   };
   

   // BusinessDetailsPost

   export const GetBusinessCorporationDetails = async () => {
     let region = sessionStorage.getItem("region");
   
     let brn = sessionStorage.getItem("internalBusinessId");
     try {
         const response = await Axios.get(
           sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessIncorporationDetails",
           {
             params: {
               businessRegistrationNumber: brn,
             },
           }
         );
         let obj = response.data;
         sessionStorage.setItem("BusinessDetailsPost", JSON.stringify(obj));

       sessionStorage.setItem("businessName", obj.businessName);
       sessionStorage.setItem("businessType", obj.businessType);
   
   
       //Registered Address
   
   
       if (obj.businessKybMode && obj.businessKybMode === "M_KYC") {
         sessionStorage.setItem("BusinessNumberFromList", "NoneOfThese");
       } else {
         sessionStorage.setItem("BusinessNumberFromList", obj.internalBusinessId);
       }
       return obj;
     } catch (error) {
       console.log("Something went wrong: " + error);
     }
   };


// applicantDetailsPost
export const GetApplicantBusinessDetails = async () => {
 
  let brn = sessionStorage.getItem("internalBusinessId");

  try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetApplicantBusinessDetails",
        {
          params: {
            businessRegistrationNumber: brn,
          },
        }
      );
      let obj = response.data;
      sessionStorage.setItem("applicantDetailsPost", JSON.stringify(obj));


    if (obj.hasOwnProperty("applicantKycMode")) {

      sessionStorage.setItem("applicantKycMode", obj.applicantKycMode);
    }
    
    return obj;
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};