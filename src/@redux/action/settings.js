import axios from "axios";
import { toast } from "react-toastify";
import { setBranding } from "../features/settings";
import { closeLoader, openLoader } from "../features/common";
import axiosInstance from "../axiosInstance";

export const brandingUpload = (data) => async (dispatch, getState) => {

  const custHashId = getState().onboarding?.UserOnboardingDetails?.customerHashId;
  const internalBusinessId = getState().onboarding?.UserOnboardingDetails?.internalBusinessId;

  if (custHashId == "" || custHashId == null) {
    return [];
  } else if (internalBusinessId == "" || internalBusinessId == null) {
    toast.error("Internal Business Id not present!");
  } else {
    try {
      var subDomainName = "";
      if (data?.subDomain && data?.subDomain !== "") {
        subDomainName = data?.subDomain + ".zoqq.com";
      } else {
        subDomainName = "";
      }

      const brandingReqBody = {
        companyId: internalBusinessId,
        brandName: data?.brandName || "",
        domainName: subDomainName || "",
        colours: data?.randomColor || "",
        logoUrl: data?.logoUrl || "",
        fonts: data?.currentFont || "",
      };

      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/SettingsRoutes/branding",
        brandingReqBody
      );

      let obj = response.data;
      if (obj?.message === "updated successfully" || obj?.message === "saved successfully") {
        toast.success("Saved Successfully")
        dispatch(getbrandingDetails());
        return obj;
      } else {
        return obj;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong! Please try again later.");
    }
  }
};

//get branding Details

export const getbrandingDetails = () => async (dispatch, getState) => {
  const custHashId = getState().onboarding?.UserOnboardingDetails?.customerHashId;
  const internalBusinessId = getState().onboarding?.UserOnboardingDetails?.internalBusinessId;

  if (custHashId == "" || custHashId == null) {
    return [];
  } else if (internalBusinessId == "" || internalBusinessId == null) {
    toast.error("Internal Business Id not present!");
  } else {
    try {
      const response = await axiosInstance.get(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/getbrandingDetails", {
        params: {
          companyId: internalBusinessId,
        },
      });

      let obj = response.data;

      const colours = obj?.colours;

      const root = document.documentElement;
      const rootStyles = root?.style;

      const changeColor = (colour) => {
        if (colour?.main) rootStyles?.setProperty("--main-color", colour?.main); // Modify the value of a CSS variable
        if (colour?.primary) rootStyles?.setProperty("--primary-color-100", colour?.primary); // Modify the value of a CSS variable
        if (colour?.primaryB) rootStyles?.setProperty("--primary-color-10", colour?.primaryB); // Modify the value of a CSS variable
        if (colour?.secondary) rootStyles?.setProperty("--secondary-color-100", colour?.secondary); // Modify the value of a CSS variable
        if (colour?.secondaryB) rootStyles?.setProperty("--secondary-color-10", colour?.secondaryB); // Modify the value of a CSS variable
        if (colour?.tertiary) rootStyles?.setProperty("--tertiary-color-100", colour?.tertiary); // Modify the value of a CSS variable
        if (colour?.tertiaryB) rootStyles?.setProperty("--tertiary-color-10", colour?.tertiaryB); // Modify the value of a CSS variable
        if (colour?.color0) rootStyles?.setProperty("--color-0", colour?.color0); // Modify the value of a CSS variable
        if (colour?.color25) rootStyles?.setProperty("--color-25", colour?.color25); // Modify the value of a CSS variable
        if (colour?.color50) rootStyles?.setProperty("--color-50", colour?.color50); // Modify the value of a CSS variable
        if (colour?.color75) rootStyles?.setProperty("--color-75", colour?.color75); // Modify the value of a CSS variable
        if (colour?.color100) rootStyles?.setProperty("--color-100", colour?.color100); // Modify the value of a CSS variable
        if (colour?.brand !== undefined) rootStyles?.setProperty("--primary", colour?.brand); // Modify the value of a CSS variable
        if (colour?.brand_S) rootStyles?.setProperty("--primary-s", colour?.brand_S); // Modify the value of a CSS variable
        if (colour?.brand_L) rootStyles?.setProperty("--primary-l", colour?.brand_L); // Modify the value of a CSS variable
        if (colour?.button) rootStyles?.setProperty("--yellow", colour?.button); // Modify the value of a CSS variable
      };

      changeColor(colours);

      const font = obj?.fonts;
      if (font) rootStyles?.setProperty("--font", font); // Modify the value of a CSS variable

      if (obj) {
        let modifedObj = obj
        if(obj.logoUrl) {
          const logoUrl = obj.logoUrl;
          modifedObj = {...obj, logoUrl}
        }
        dispatch(setBranding(modifedObj));
        return obj;
      } else if (obj?.message) {
        toast.error(obj.message);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again later.");
    }
  }
};

// logo uplpoad to S3

export const uploadDocS3 =(selectedFileName, base64EncodedFile)=> async (dispatch,getState) => {
debugger
  const custHashId = getState().onboarding?.UserOnboardingDetails?.customerHashId;

  // const logo = data?.selectedImage;

  // const formData = new FormData();
  // formData.append("file", logo);
  const dataToSend = {
    filename: selectedFileName,
    file: base64EncodedFile,
  };

  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    try {
      const response = await axiosInstance.post(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/uploadDocS3", dataToSend);

      let obj = response.data;
      if (obj && obj?.url) {
        return obj;
      } else {
        toast.error(obj.message);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again later.");
    }
  }
};

//   export const uploadLogo = (body, setActiveTab) => async (dispatch, getState) => {
//     const baseUrl = getState().config.baseUrl
//     try {
//         dispatch(openLoader())
//         const { logo } = body
//         const formData = new FormData();
//         formData.append('file', logo);
//         const response = await axios.post(`${baseUrl}brading/upload/image`, formData);
//         if (response) {
//             console.log("response i am getting for upload image is", response.data?.["file_url"])
//             const logo_url = response.data?.["file_url"]
//             const { domainName, brandName } = body;
//             dispatch(insertData({ domainName, brandName, "logoUrl": logo_url }, setActiveTab))

//             // dispatch(insert_data(response.data))

//         } else {
//             throw new Error('No data received from the server');
//         }
//     }
//     catch (error) {
//         console.log("error is here:- ", error);
//     }
//     finally {
//         dispatch(closeLoader())
//     }
// }
