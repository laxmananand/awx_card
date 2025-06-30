// import React, { useEffect, useState } from "react";
// import CustomSelect from "../../../structure/CustomSelect";
// import EachBeneficiary from "./EachBeneficiary";
// // import { beneficiariesList } from "../../js/beneficiaries";
// import ContentLoader from "react-content-loader";
// const payoutmethod = ["LOCAL", "SWIFT"];
// function BeneficiariesList({ beneficiaries, setShowDetails }) {
//   const colorList = [
//     " bg-danger",
//     " bg-success",
//     " bg-warning",
//     " bg-primary",
//     " bg-info",
//   ];
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
//   const [showLoader, setShowLoader] = useState(true);
//   // const complianceStatus = sessionStorage.getItem("complianceStatus");

//   let complianceStatus =  useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus);
//   let customerHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       // Hide the loader after 10 seconds
//       setShowLoader(false);
//     }, 2000); // 10 seconds in milliseconds

//     // Clear the timeout if the component unmounts
//     return () => clearTimeout(timeoutId);
//   }, []); // Empty dependency array means this effect runs once when t

//   const handleSearchChange = (e) => {

//     setSearchQuery(e.target.value);
//   };

//   const handlePayoutMethodChange = (e) => {
//     setSelectedPayoutMethod(e.target.value);
//   };

//   const filteredBeneficiaries =
//     beneficiaries?.filter((item) => {
//       const nameMatches =
//         !searchQuery ||
//         item.beneficiaryName?.toLowerCase().includes(searchQuery?.toLowerCase());
//       const payoutMethodMatches =
//         !selectedPayoutMethod || item.payoutMethod === selectedPayoutMethod;

//       return nameMatches && payoutMethodMatches;
//     }) || [];

//   return beneficiaries ? (
//     <div className="w-100">
//       <div className="d-flex flex-fill row mt-3 mb-5 align-items-baseline justify-content-end">
//         <div className="col-12 col-md-4 my-2 my-lg-0 h-100">
//           <div className="d-flex ms-md-3 me-md-1 border rounded-3 flex-fill">
//             <input
//               className="form-control border-0"
//               type="search"
//               placeholder="Search By Name"
//               aria-label="Search"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>

//         <div className="col-12 col-md-4 my-2 h-100">
//           <div className=" border rounded-3 ms-md-1 me-md-3 h-100">
//             {/* <select id="payoutMethod" className="custom-select p-2"> */}
//             <select
//               id="payoutMethod"
//               className="custom-select p-2"
//               value={selectedPayoutMethod}
//               onChange={handlePayoutMethodChange}
//             >
//               <option value="">Payout Method</option>
//               {payoutmethod.map((type, index) => (
//                 <option key={index} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {filteredBeneficiaries.map((item, key) => (
//         <div key={key}>
//           <EachBeneficiary
//             setShowDetails={setShowDetails}
//             data={item}
//             key={key}
//             color={colorList[key % 5]}
//           />
//           <hr />
//         </div>
//       ))}
//     </div>
//   ) : complianceStatus?.toLowerCase() == "completed" &&
//     beneficiaries?.length < 1 ? (
//     <>
//       {"jklyu "}
//       <img src="/censorship.png" style={{ width: "200px", height: "180px" }} />
//     </>
//   ) : (
//     <></>
//   );
// }

// export default BeneficiariesList;
