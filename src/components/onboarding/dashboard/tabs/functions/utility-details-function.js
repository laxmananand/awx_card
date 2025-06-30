import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { logout } from "../../../../Signup/js/logout-function.js";
import CryptoJS from "crypto-js";
Axios.defaults.withCredentials = true;

//Current date and time
const now = new Date();
// Concatenate the components directly in the desired format
const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}:${(
  now.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}:${now.getFullYear().toString().slice(-2)}:${now
  .getHours()
  .toString()
  .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

export const listCountry = async () => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountry"
    );
    let obj = response.data;
    var List = obj.result;
    if (List) {
      return List;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

export const listCountryCode = async () => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountryCode"
    );
    let obj = response.data;
    var List = obj.result;
    if (List) {
      return List;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

export const listNationality = async () => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listNationality"
    );
    let obj = response.data;
    var List = obj.result;
    if (List) {
      return List;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

export const FetchEnumValues = async (category, region) => {
  if (category == "") {
    toast.warn("Category Must Not Be Empty");
  } else {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/CommonRoutes/fetchenumvalues",
        {
          params: {
            category: category,
            region: region,
          },
        }
      );

      let obj = response.data;
      if (obj.data) {
        return obj.data;
      } else {
        console.error("Fetch Failed: " + obj.message);
        return [];
      }
    } catch (error) {
      console.error("Something went wrong: " + error);
      return [];
    }
  }
};

export const AuthUser = async () => {
  let lastemail = sessionStorage.getItem("lastemail");
  let _session = sessionStorage.getItem("_session");
  let secretKey = null;

  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/fetchsecretkey"
    );
    let res = response.data;
    secretKey = res.secretKey;

    const encryptedData = _session;

    // Decrypt data
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // Parse decrypted string as JSON
    const decryptedJson = JSON.parse(decryptedString);

    let obj = decryptedJson;
    if (obj.status === "SUCCESS") {
      let userEmail = obj.email;
      let timestamp = obj.timestamp;
      let accessToken = obj.sessionId;
      // Get the last email from sessionStorage

      if (
        userEmail === lastemail && // Validation 1
        accessToken !== "" // Validation 3
      ) {
        sessionStorage.setItem("session", "valid");
      } else {
        Swal.fire({
          text: "Unauthorized Access",
          icon: "error",
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
          } else {
          }
        });

        setTimeout(async () => {
          await logout();
        }, 1500);
      }
    } else {
      Swal.fire({
        text: "Unauthorized Access",
        icon: "error",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        } else {
        }
      });

      setTimeout(async () => {
        await logout();
      }, 1500);
    }
  } catch (error) {
    Swal.fire({
      text: "Unable to validate session, please sign-in again!",
      icon: "error",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      } else {
      }
    });

    setTimeout(async () => {
      await logout();
    }, 1500);
  }
};

// export const AuthUser = async () => {
//   let lastemail = sessionStorage.getItem("lastemail");
//   let _session = sessionStorage.getItem("_session");
//   let secretKey = null;

//   try {
//     const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/CommonRoutes/authUser");
//     // let res = response.data;
//     // secretKey = res.secretKey;

//     // const encryptedData = _session;

//     // // Decrypt data
//     // const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//     // const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

//     // // Parse decrypted string as JSON
//     // const decryptedJson = JSON.parse(decryptedString);

//     // let obj = decryptedJson;

//     let obj = response.data;

//     if (obj.status === "SUCCESS") {
//       let userEmail = obj.email;
//       let timestamp = obj.timestamp;
//       let accessToken = obj.sessionId;
//       // Get the last email from sessionStorage

//       if (
//         userEmail === lastemail && // Validation 1
//         accessToken !== "" // Validation 3
//       ) {
//         sessionStorage.setItem("session", "valid");
//       } else {
//         Swal.fire({
//           text: "Unauthorized Access",
//           icon: "error",
//         }).then((result) => {
//           if (result.isConfirmed) {
//             logout();
//           } else {
//             setTimeout(() => {
//               logout();
//             }, 1500);
//           }
//         });
//       }
//     } else {
//       Swal.fire({
//         text: "Unauthorized Access",
//         icon: "error",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           logout();
//         } else {
//           setTimeout(() => {
//             logout();
//           }, 1500);
//         }
//       });
//     }
//   } catch (error) {
//     Swal.fire({
//       text: "Unable to validate session, please sign-in again!",
//       icon: "error",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//       } else {
//         setTimeout(() => {
//           logout();
//         }, 1500);
//       }
//     });
//   }
// };
