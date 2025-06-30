import React, { useEffect, useState } from "react";
import { addVirtualCardApi } from "../../js/cards-functions";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { createPhysicalCard } from "../../js/cards-functions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// import CustomSelect from './CustomSelect'
import CustomModal from "./../../../structure/NewStructures/CustomModal";
import CustomSelect from "./../../../structure/NewStructures/CustomSelect";
import CustomInput from "../../../structure/NewStructures/CustomInput";
import CustomCheckbox from "../../../structure/NewStructures/CustomCheckBox";
import { fetchCardholderAWX } from "../../../../@redux/action/auth";
import { AddCard, PersonAdd } from "@mui/icons-material";
import { RingLoader } from "react-spinners";
import { createCard_awx,listcards_awx } from "../../../../@redux/action/cards";
export function EachCustomer({ flag, name }) {
  const shortName =
    name?.split(" ")[0]?.slice(0, 1) + name?.split(" ")[1]?.slice(0, 1);

  return (
    <a
      href="/expense/corporate-cards/create-card"
      className="d-flex justify-content-between align-items-center m-1 text-decoration-none blueHover p-2 rounded-3"
      role="button">
      <div className="d-flex align-items-center">
        <div
          className="bg-info rounded-circle me-2 text-white text-center d-flex align-items-center justify-content-center"
          style={{ width: "50px", height: "50px" }}>
          {shortName}
        </div>
        <div className="d-flex align-items-center">
          <div className="text-dark m-0 p-0">{name}</div>
          {flag && (
            <div className="blue100 bg-blue10 px-3 m-0 mx-2 py-1 rounded-pill text-center align-middle">
              You
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function CreateNewCard({ refreshCardList }) {
  const navigate = useNavigate();
  const walletHashid = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.walletHashId
  );
  const customerHashId = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.customerHashId
  );

  const platform = useSelector((state) => state.common.platform);

  const [addCardModal, setAddCardModal] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const contactName = sessionStorage.getItem("contactName");
  const email = sessionStorage.getItem("lastemail");
  const [img, setImg] = useState("/expense/card/add-card.svg");
  const dispatch = useDispatch();

  const listCountry = useSelector(
    (state) => state.onboarding?.ListCountryZOQQ ?? []
  ).map((item) => ({
    value: item.ISOcc_2char,
    label: item.country_name,
  }));

  const accountId = useSelector((state) => state.auth.awxAccountId);
  const authToken = useSelector((state) => state.common.authToken);

  const currList = useSelector((state) => state.accounts.currencyList);

  const AddVirtualCardContent = () => {
    const [cardholder, setCardholder] = useState("");
    const [currency, setCurrency] = useState("");

    const [dataLoading, setDataLoading] = useState(false);
    const [cardholderOptions, setCardholderOptions] = useState([]);
    const [payload, setPayload] = useState();

    const [nameOnCard, setNameOnCard] = useState("");
    const [useType, setUseType] = useState(""); // 'commercial' or 'personal'

    useEffect(() => {
      const SetPage = async () => {
        try {
          setDataLoading(true);

          let res =await dispatch(fetchCardholderAWX(accountId, authToken));
          if (res.items && res.items.length > 0)
            setCardholderOptions(res.items);
        } catch (e) {
          console.log(e);
        } finally {
          setDataLoading(false);
        }
      };

      SetPage();
    }, [dispatch]);

    const AddVirtualCard = async () => {};

    return (
      <>
        {dataLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center gap-4 w-100 my-5">
            <RingLoader size={35} />
            <label htmlFor="" className="">
              Please wait while we're fetching some data...
            </label>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center w-100 my-4 gap-4">
              <div className="w-60">
                <CustomSelect
                  options={cardholderOptions?.map((item) => {
                    return { label: item.email, value: item.cardholder_id };
                  })}
                  value={cardholder}
                  onChange={(selected) => setCardholder(selected?.value)}
                  label={`Select Cardholder`}
                  required
                />
              </div>

              <div className="w-40">
                <CustomSelect
                  options={currList?.map((item) => {
                    return { label: item.name, value: item.name };
                  })}
                  value={currency}
                  onChange={(selected) => setCurrency(selected?.value)}
                  label={`Select Currency`}
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-column w-100 my-4 gap-3">
              <div className="w-100">
                <CustomInput
                  label="Name on Card"
                  placeholder="Enter name on card"
                  type="text"
                  value={nameOnCard}
                  onInput={(val) => setNameOnCard(val)}
                  required={true}
                />
              </div>

              <div className="d-flex gap-4 align-items-center mt-2 p-2 ml-2">
                <CustomCheckbox
                  id="commercialUse"
                  label="Commercial Use"
                  checked={useType === "commercial"}
                  onChange={() => setUseType("commercial")}
                />
                <CustomCheckbox
                  id="personalUse"
                  label="Personal Use"
                  checked={useType === "personal"}
                  onChange={() => setUseType("CONSUMER")}
                />
              </div>
            </div>

            <div className="d-flex flex-row gap-2">
              <button
                className="bg-dark text-white rounded-pill border-0 px-5 py-2 fs-8 d-flex align-items-center justify-content-center gap-2 mx-auto"
                onClick={() => navigate("/card-holders")}>
                <PersonAdd fontSize="small" /> Create New Cardholder
              </button>
              <button
                className="bg-dark text-white rounded-pill border-0 px-5 py-2 fs-8 d-flex align-items-center justify-content-center gap-2 mx-auto"
                onClick={async () => {
                  if (!cardholder || !currency || !nameOnCard || !useType) {
                    alert("Please fill all required fields.");
                    return;
                  }

                  const cardPayload = {
                    cardholder_id: cardholder,
                    name_on_card: nameOnCard,
                    currency: currency,
                    use_type: useType,
                  };

                  setPayload(cardPayload);
                  console.log("Card Payload:", cardPayload); // optional: for debugging
                  // You can trigger the API call here if needed
                  await dispatch(createCard_awx(authToken,cardPayload,accountId));
                  dispatch(listcards_awx(authToken,accountId));
                }}>
                <AddCard /> Add New Card
              </button>
            </div>
          </>
        )}
      </>
    );
  };

  const clearForm = () => {
    document.getElementById("cardHolderName").value,
      document.getElementById("addressLine1").value,
      document.getElementById("addressLine2").value,
      document.getElementById("city").value,
      document.getElementById("postalCode").value,
      document.getElementById("country").value,
      document.getElementById("modeofDelivery").value;
    document.getElementById("state").value, setErrors({});
  };

  const closemodal = () => {
    const modal = document.getElementById("AddNewAccountModal");
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    const modalBackdrop = document.getElementsByClassName("modal-backdrop");
    // Remove the backdrop
    if (modalBackdrop.length > 0) {
      document.body.removeChild(modalBackdrop[0]);
    }
    // Clear form fields
    clearForm();
  };

  const validateInputs = (
    cardHolderName,
    addressLine1,
    city,
    postalCode,
    country,
    modeofDelivery
  ) => {
    const errors = {};
    const textRegex = /^(?!.*[<>])[a-zA-Z\s]+$/;
    const postalCodeRegex = /^(?!.*[<>])[a-zA-Z0-9]+$/;
    const addressRegex = /^(?!.*[<>]).*$/;

    if (!cardHolderName || !addressRegex.test(cardHolderName)) {
      errors.cardHolderName =
        "Card holder name  is required and should contain valid name.";
      toast.error(errors.cardHolderName);
      return;
    }

    if (!addressLine1 || !addressRegex.test(addressLine1)) {
      errors.addressLine1 =
        "Address line 1 is required and should contain valid name.";
      toast.error(errors.addressLine1);
      return;
    }
    if (!city || !textRegex.test(city)) {
      errors.city =
        "City is required and should not contain numbers or special characters.";
      toast.error(errors.city);
      return;
    }

    if (!country) {
      errors.country = "Country is required.";
      toast.error(errors.country);
      return;
    }

    if (!postalCode || !postalCodeRegex.test(postalCode)) {
      errors.postalCode =
        "postalCode is required and should contain only numbers and letters";
      toast.error(errors.postalCode);
      return;
    }

    if (!modeofDelivery) {
      errors.modeofDelivery = "modeofDelivery is required.";
      toast.error(errors.modeofDelivery);
      return;
    }

    return errors;
  };

  const handleCreatePhysicalCard = async () => {
    const cardHolderName = document
      .getElementById("cardHolderName")
      .value.trim();
    const addressLine1 = document.getElementById("addressLine1").value.trim();
    const addressLine2 =
      document.getElementById("addressLine2").value?.trim() || "";
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value?.trim() || "";
    const postalCode = document.getElementById("postalCode").value.trim();
    const country = document.getElementById("country").value.trim();
    const modeofDelivery = document
      .getElementById("modeofDelivery")
      .value.trim();

    const validationErrors = validateInputs(
      cardHolderName,
      addressLine1,
      city,
      postalCode,
      country,
      modeofDelivery
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedFields = {
      cardHolderName: cardHolderName,
      Address1: addressLine1,
      Address2: addressLine2,
      City: city,
      State: state,
      postalCode: postalCode,
      Country: country,
      modeofDelivery: modeofDelivery,
      walletHashid: walletHashid,
      customerHashId: customerHashId,
      contactName: contactName,
      email: email,
    };

    setIsLoading(true);
    try {
      const fetchedData = await createPhysicalCard(updatedFields);
      console.log(fetchedData);
      setIsLoading(false);
      if (
        fetchedData.status === "BAD_REQUEST" ||
        fetchedData.length === 0 ||
        fetchedData.statusText === "Internal Server Error"
      ) {
        closemodal(); // Close the modal if condition is met
      } else {
        // Success handling
        toast.success("Physical Card is added successfully!");
        closemodal();
        navigate(0);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      // Optionally show an error toast message
      toast.error("An error occurred while adding the physical card.");
    }
  };

  return (
    <>
      <style>
        {`
          .custom-input-classPhyicalCard {
            padding: 12px 20px;
            border: 1px solid lightgrey;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
          }

          .custom-input-classPhyicalCard:focus-visible {
            outline: 1px solid #1425e7;
            caret-color: #2923ea;
          }
        `}
      </style>

      {/* Button trigger modal */}
      <button
        type="button"
        className="btn btn-action w-100 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500 gap-2 m-2"
        style={{ whiteSpace: "nowrap" }}
        onMouseEnter={() => setImg("/expense/card/add-card-white.svg")}
        onMouseLeave={() => setImg("/expense/card/add-card.svg")}
        onClick={() => setAddCardModal(true)}>
        Add Virtual Card <img src={img} alt="" width={30} />
      </button>
      {platform !== "awx" && (
        <button
          type="button"
          className="btn btn-action w-100 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500 gap-2"
          style={{ whiteSpace: "nowrap" }}
          data-bs-toggle="modal"
          data-bs-target="#AddNewAccountModal"
          onMouseEnter={() => setImg("/expense/card/add-card-white.svg")}
          onMouseLeave={() => setImg("/expense/card/add-card.svg")}>
          Add Physical Card <img src={img} alt="" width={30} />
        </button>
      )}

      {/* Modal */}
      <div
        className="modal fade"
        id="AddNewAccountModal"
        tabIndex={-1}
        aria-labelledby="AddNewAccountModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-5">
            <div className="d-flex justify-content-between my-2">
              <h5
                className="text-dark fw-bold mx-auto text-center"
                style={{ flex: 1 }}>
                Add Physical Card
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <h6 className="text-dark my-3 text-start">Delivery Address</h6>
            <form
              className="d-col col-lg-6 my-2 my-lg-0 w-100"
              onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                id="cardHolderName"
                placeholder="Enter card holder name"
                className="custom-input-classPhyicalCard full-width"
                label="Address Line 1"
                helperText=""
                style={{ marginTop: "4px", marginBottom: "4px" }}
              />
              <input
                type="text"
                id="addressLine1"
                placeholder="Enter your address line 1"
                className="custom-input-classPhyicalCard full-width"
                label="Address Line 1"
                helperText=""
                style={{ marginTop: "4px", marginBottom: "4px" }}
              />
              <input
                type="text"
                id="addressLine2"
                placeholder="Enter your address line 2"
                className="custom-input-classPhyicalCard full-width"
                label="Address Line 1"
                helperText=""
                style={{ marginTop: "4px", marginBottom: "4px" }}
              />
              <div className="d-flex">
                <input
                  type="text"
                  id="city"
                  placeholder="Enter your city"
                  className="custom-input-classPhyicalCard full-width"
                  label="Address Line 1"
                  helperText=""
                  style={{
                    marginTop: "4px",
                    marginBottom: "4px",
                    marginRight: "4px",
                  }}
                />
                <input
                  type="text"
                  id="state"
                  placeholder="Enter your state"
                  className="custom-input-classPhyicalCard full-width"
                  label="Address Line 1"
                  helperText=""
                  style={{ marginTop: "4px", marginBottom: "4px" }}
                />
              </div>
              <div className="d-flex">
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Enter your postal code"
                  className="custom-input-classPhyicalCard full-width"
                  label="Address Line 1"
                  helperText=""
                  style={{
                    marginTop: "4px",
                    marginBottom: "4px",
                    marginRight: "4px",
                  }}
                />
                <select
                  type="text"
                  id="country"
                  placeholder="Enter your state"
                  className="custom-input-classPhyicalCard full-width"
                  label="Address Line 1"
                  helperText=""
                  style={{ marginTop: "4px", marginBottom: "4px" }}>
                  <option value="" disabled selected>
                    Select your country
                  </option>
                  {listCountry.map((country, index) => (
                    <option key={index} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  type="text"
                  id="modeofDelivery"
                  placeholder="Enter your state"
                  className="custom-input-classPhyicalCard full-width"
                  label="Address Line 1"
                  helperText=""
                  style={{ marginTop: "4px", marginBottom: "20px" }}>
                  {" "}
                  <option value="" disabled selected>
                    Select your mode of delivery
                  </option>
                  <option value="NORMAL_DELIVERY_LOCAL">
                    Normal delivery local
                  </option>
                  <option value="EXPRESS_DELIVERY_LOCAL">
                    Express delivery local
                  </option>
                  <option value="INTERNATIONAL_DELIVERY">
                    International delivery
                  </option>
                </select>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-action rounded-5 d-flex align-items-center justify-content-center py-2 fw-500"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={handleCreatePhysicalCard}
                  disabled={isLoading}>
                  {isLoading ? "Loading..." : "Add Physical Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={addCardModal}
        handleClose={() => setAddCardModal(false)}
        children={<AddVirtualCardContent />}
        headerText={`Add Virtual Card`}
        width={600}
      />
    </>
  );
}

export default CreateNewCard;
