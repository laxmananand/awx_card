import React, { useState, useRef, useEffect } from "react";
import BreadCrumbs from "../components/structure/BreadCrumbs";
import {
  Card,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import {
  Add,
  AddCard,
  Call,
  Close,
  Delete,
  Email,
  Home,
  MoreHoriz,
  Person,
  PersonAdd,
  PersonAddAlt,
  Search,
  Settings,
  Style,
} from "@mui/icons-material";
import CustomInput from "./../components/structure/NewStructures/CustomInput";
import CustomSelect from "./../components/structure/NewStructures/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomTable from "../components/structure/NewStructures/CustomTable";
import CustomModal from "../components/structure/NewStructures/CustomModal";
import { CustomDatepicker } from "./../components/structure/NewStructures/CustomDatePicker";
import { ClipLoader, RingLoader } from "react-spinners";
import {
  createCardholderAWX,
  DeleteCardholderAWX,
  fetchCardDetailsAWX,
  fetchCardholderAWX,
  InviteCardholderAWX,
} from "../@redux/action/auth";
import { toast } from "react-toastify";
import ManageSubscription from "../components/settings/tabs/Subscription/ManageSubscription";
import CompareAllPlans from "../components/Signup/pages/CompareAllPlans";
import ActivateAccount from "../components/ActivateAccount";

export const Cardholders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accountId = useSelector((state) => state.auth.awxAccountId);
  const authToken = useSelector((state) => state.common.authToken);

  const subStatus = useSelector((state) => state.subscription?.data?.status);

  var complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [isOpenCards, setOpenCards] = useState(false);
  const handleCloseCards = () => {
    setOpenCards(false);
  };

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Blocked", value: "blocked" },
    { label: "Disabled", value: "disabled" },
  ];

  const columns = [
    { id: "name", label: "Cardholders" },
    { id: "email", label: "Email" },
    { id: "mobile", label: "Mobile Number" },
    { id: "type", label: "Type" },
    { id: "status", label: "Status" },
    { id: "actions", label: "" },
  ];

  const CreateCardholderModal = () => {
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [cc, setCC] = useState("");
    const [mobile, setMobile] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [dob, setDOB] = useState("");
    const [submitting, setSubmitting] = useState(false);

    //Postal Address
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [country, setCountry] = useState("");

    //Address
    const [indaddress1, setIndAddress1] = useState("");
    const [indaddress2, setIndAddress2] = useState("");
    const [indcity, setIndCity] = useState("");
    const [indstate, setIndState] = useState("");
    const [indzipcode, setIndZipcode] = useState("");
    const [indcountry, setIndCountry] = useState("");

    const typeOptions = [
      { label: "Individual", value: "INDIVIDUAL" },
      { label: "Delegate", value: "DELEGATE" },
    ];

    const ccList = useSelector((state) => state.onboarding.ListCountryCode);
    const countryList = useSelector(
      (state) => state.onboarding.ListCountryZOQQ
    );

    const createCardholderBody = {
      email: email,

      mobile_number: `+${cc?.value}${mobile}`,
      type: type?.value,
    };

    if (type?.value === "INDIVIDUAL") {
      createCardholderBody.individual = {
        date_of_birth: dob,
        express_consent_obtained: "yes",
        cardholder_agreement_terms_consent_obtained:
          indcountry?.value === "CA" ? "yes" : null,
        name: {
          first_name: firstName,
          last_name: lastName,
        },
        address: {
          city: indcity,
          country: indcountry?.value,
          line1: indaddress1,
          line2: indaddress2,
          state: indstate,
          postcode: indzipcode,
        },
      };
    }

    const validateCardholderFields = () => {
      // Basic Checks
      if (!email || !email.includes("@")) {
        toast.error("Please enter a valid email address.");
        return false;
      }

      if (!mobile || !cc?.value) {
        toast.error("Please enter a valid mobile number and country code.");
        return false;
      }

      if (!type?.value) {
        toast.error("Please select a cardholder type.");
        return false;
      }

      // If INDIVIDUAL, check nested fields
      if (type.value === "INDIVIDUAL") {
        if (!firstName || !lastName) {
          toast.error("Please enter both first name and last name.");
          return false;
        }

        if (!dob) {
          toast.error("Please enter date of birth.");
          return false;
        }

        if (
          !indcountry?.value ||
          !indcity ||
          !indaddress1 ||
          !indstate ||
          !indzipcode
        ) {
          toast.error("Please fill in the full address details.");
          return false;
        }

        if (indcountry.value === "CA" && !true) {
          toast.error("Consent is required for Canadian residents.");
          return false;
        }
      }

      return true;
    };

    const CreateCardholderFn = async () => {
      if (!validateCardholderFields()) return;

      try {
        setSubmitting(true);
        let res = await dispatch(
          createCardholderAWX(accountId, authToken, createCardholderBody)
        );

        console.log("CreateCardholderFn: ", res);
        if (res.cardholder_id || res.status) {
          toast.success(
            `CardHolder: ${firstName} ${lastName} added successfully!`
          );

          setTimeout(() => {
            navigate(0);
          }, 2000);
        } else {
          toast.error(
            `Failed to add cardholder: ${
              res?.message || "Something went wrong, please try again later!"
            }`
          );
        }
      } catch (e) {
        console.log(e);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="" style={{ overflowY: "auto" }}>
        <Card className="border p-4 my-4">
          <label htmlFor="" className="w-100 border-bottom pb-3 mb-3 fw-bold">
            1. Cardholder Setup Information{" "}
            <span className="text-danger">*</span>
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <CustomInput
              leftIcon={<Email />}
              value={email}
              onInput={setEmail}
              required
              label={`Cardholder Email`}
              placeholder={`Enter Cardholder Email`}
            />
            <CustomSelect
              options={typeOptions}
              value={type}
              onChange={setType}
              required
              label={`Cardholder Type`}
            />

            <CustomSelect
              options={ccList?.map((item) => {
                return {
                  label: `(+${item.ISD_country_code}) ${item.country_name}`,
                  value: item.ISD_country_code,
                };
              })}
              value={cc}
              onChange={setCC}
              required
              label={`Country Code`}
            />

            <CustomInput
              leftIcon={<Call />}
              value={mobile}
              onInput={setMobile}
              required
              label={`Mobile Number`}
              placeholder={`Enter Mobile Number`}
            />
          </div>
        </Card>

        {/* <Card className="border p-4 mb-4">
          <label htmlFor="" className="w-100 border-bottom pb-3 mb-3 fw-bold">
            2. Postal Address Information{" "}
            <span className="opacity-50">(optional)</span>
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <CustomInput
              leftIcon={<Home />}
              value={address1}
              onInput={setAddress1}
              label={`Address 1`}
              placeholder={`Enter Address Line 1`}
            />

            <CustomInput
              leftIcon={<Home />}
              value={address2}
              onInput={setAddress2}
              label={`Address 2`}
              placeholder={`Enter Address Line 2`}
            />

            <CustomInput
              leftIcon={<Home />}
              value={city}
              onInput={setCity}
              label={`City`}
              placeholder={`Enter City`}
            />

            <CustomInput
              leftIcon={<Home />}
              value={state}
              onInput={setState}
              label={`State`}
              placeholder={`Enter State`}
            />

            <CustomInput
              leftIcon={<Home />}
              value={zipcode}
              onInput={setZipcode}
              label={`Postal Code`}
              placeholder={`Enter Postal Code`}
            />

            <CustomSelect
              options={countryList?.map((item) => {
                return {
                  label: `${item.country_name}`,
                  value: item.ISOcc_2char,
                };
              })}
              value={country}
              onChange={setCountry}
              label={`Country`}
            />
          </div>
        </Card> */}

        {type?.value === "INDIVIDUAL" && (
          <Card className="border p-4 mb-4">
            <label htmlFor="" className="w-100 border-bottom pb-3 mb-3 fw-bold">
              2. Individual Information <span className="text-danger">*</span>
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 20,
                marginBottom: 15,
              }}
            >
              <CustomInput
                leftIcon={<Person />}
                value={firstName}
                onInput={setFirstName}
                label={`First name`}
                placeholder={`Enter full name of the individual`}
                required
              />
              <CustomInput
                leftIcon={<Person />}
                value={lastName}
                onInput={setLastName}
                label={`Last name`}
                placeholder={`Enter full name of the individual`}
                required
              />

              <CustomDatepicker
                selectedDate={dob}
                onDateChange={setDOB}
                label={`Date of Birth`}
                required
              />
            </div>

            <Card className="border p-4 mb-4">
              <label
                htmlFor=""
                className="w-100 border-bottom pb-3 mb-3 fw-bold"
              >
                2.1 Address Details <span className="text-danger">*</span>
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                }}
              >
                <CustomInput
                  leftIcon={<Home />}
                  value={indaddress1}
                  onInput={setIndAddress1}
                  label={`Address 1`}
                  placeholder={`Enter Address Line 1`}
                />

                <CustomInput
                  leftIcon={<Home />}
                  value={indaddress2}
                  onInput={setIndAddress2}
                  label={`Address 2`}
                  placeholder={`Enter Address Line 2`}
                />

                <CustomInput
                  leftIcon={<Home />}
                  value={indcity}
                  onInput={setIndCity}
                  label={`City`}
                  placeholder={`Enter City`}
                />

                <CustomInput
                  leftIcon={<Home />}
                  value={indstate}
                  onInput={setIndState}
                  label={`State`}
                  placeholder={`Enter State`}
                />

                <CustomInput
                  leftIcon={<Home />}
                  value={indzipcode}
                  onInput={setIndZipcode}
                  label={`Postal Code`}
                  placeholder={`Enter Postal Code`}
                />

                <CustomSelect
                  options={countryList?.map((item) => {
                    return {
                      label: `${item.country_name}`,
                      value: item.ISOcc_2char,
                    };
                  })}
                  value={indcountry}
                  onChange={setIndCountry}
                  label={`Country`}
                />
              </div>
            </Card>
          </Card>
        )}

        <div className="d-flex flex-column justify-content-start align-items-start gap-3">
          {indcountry?.value === "CA" && (
            <FormControlLabel
              control={<Checkbox color="success" />}
              label="You confirm that you have the express consent of this."
              required
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "13px",
                  fontFamily: "inherit",
                  fontWeight: 500,
                },
              }}
            />
          )}
          <FormControlLabel
            control={<Checkbox color="success" />}
            label="You confirm that you have the express consent of this cardholder for Zoqq to perform name and sanction screening or any further identity verification if required."
            required
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "13px",
                fontFamily: "inherit",
                fontWeight: 500,
              },
            }}
          />
        </div>

        <button
          className="bg-dark text-white rounded-pill border-0 d-flex align-items-center justify-content-center gap-2 mt-4 mx-auto"
          onClick={CreateCardholderFn}
          style={{ fontSize: 14, width: 250, padding: 12 }}
        >
          {submitting ? (
            <>
              <ClipLoader size={22} color="white" />
            </>
          ) : (
            <>
              <PersonAdd fontSize="small" /> Create New Cardholder
            </>
          )}
        </button>
      </div>
    );
  };

  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeData, setActiveData] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const SetPage = async () => {
      try {
        setLoading(true);
        const res = await dispatch(fetchCardholderAWX(accountId, authToken));
        console.log(res);
        setData(res.items);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    SetPage();
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const mappedRows = data.map((item) => {
        const fullName = `${item.individual?.name?.first_name || ""} ${
          item.individual?.name?.last_name || ""
        }`.trim();
        const status =
          item.status === "READY" ? (
            <span className="rounded-pill bg-success text-white fs-9 px-4 py-2 text-uppercase">
              {item?.status}
            </span>
          ) : item.status === "DISABLED" ? (
            <span className="rounded-pill bg-danger text-white fs-9 px-4 py-2 text-uppercase">
              {item?.status}
            </span>
          ) : item.status === "INCOMPLETE" ? (
            <span className="rounded-pill bg-primary text-white fs-9 px-4 py-2 text-uppercase">
              {item?.status}
            </span>
          ) : (
            <span className="rounded-pill bg-warning text-dark fs-9 px-4 py-2 text-uppercase">
              {item?.status}{" "}
            </span>
          );

        return {
          name: fullName || "N/A",
          email: item.email || "N/A",
          mobile: "+" + item.mobile_number?.replace("-", ""),
          type: item.type, // Or update based on actual logic
          status,
          actions: (
            <MoreHoriz
              onClick={() => {
                setActiveData(item);
                setOpenDrawer(true);
              }}
            />
          ),
        };
      });

      setRows(mappedRows);
    }
  }, [data]);

  const CardholderDetails = ({ cardholder }) => {
    const [cardLoading, setCardLoading] = useState(false);
    const [cards, setCards] = useState([]);

    if (!cardholder) return null;

    const {
      type,
      mobile_number,
      status,
      email,
      cardholder_id,
      postal_address,
    } = cardholder;

    useEffect(() => {
      const FetchCards = async () => {
        try {
          setCardLoading(true);
          let cardsResponse = await dispatch(
            fetchCardDetailsAWX(cardholder_id, authToken)
          );
          if (cardsResponse.items && cardsResponse.items.length > 0) {
            setCards(cardsResponse.items);
          }
        } catch (e) {
          console.log(e);
        } finally {
          setCardLoading(false);
        }
      };

      FetchCards();
    }, []);

    // 1. Define the columns
    const columns = [
      { id: "brand", label: "Brand" },
      { id: "card_number", label: "Card Number" },
      { id: "card_status", label: "Status" },
      { id: "created_at", label: "Created At" },
      // { id: "updated_at", label: "Updated At" },
    ];

    // 2. Convert `cards` to rows
    const rows = cards.map((card) => ({
      brand: card.brand,
      card_number: card.card_number,
      card_status: card.card_status,
      created_at: card.created_at?.slice(0, 10),
      // updated_at: new Date(card.updated_at).toLocaleDateString(),
    }));

    return (
      <>
        <div className="cardholder-details">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 25,
              alignItems: "end",
            }}
          >
            <div className="d-flex flex-column justify-content-start align-items-start gap-1">
              <div className="" style={{ fontSize: 14, fontWeight: 600 }}>
                Type
              </div>
              <div
                className="text-secondary"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                {type}
              </div>
            </div>

            <div className="d-flex flex-column justify-content-start align-items-start gap-1">
              <div className="" style={{ fontSize: 14, fontWeight: 600 }}>
                Mobile Number
              </div>
              <div
                className="text-secondary"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                {"+" + mobile_number?.replace("-", "") || "-"}
              </div>
            </div>

            {/* <div className="row mb-2">
          <div className="col-6 fw-bold">Email</div>
          <div className="col-6">{email || "-"}</div>
        </div> */}

            {type === "INDIVIDUAL" && cardholder.individual && (
              <>
                {/* <div className="d-flex flex-column justify-content-start align-items-start gap-1">
                  <div className="" style={{ fontSize: 14, fontWeight: 600 }}>
                    Name on Card
                  </div>
                  <div
                    className="text-secondary"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                    {cardholder.individual.name?.name_on_card || "-"}
                  </div>
                </div> */}

                <div className="d-flex flex-column justify-content-start align-items-start gap-1">
                  <div className="" style={{ fontSize: 14, fontWeight: 600 }}>
                    Date Of Birth
                  </div>
                  <div
                    className="text-secondary"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                    {cardholder.individual.date_of_birth || "-"}
                  </div>
                </div>

                <div className="d-flex flex-column justify-content-start align-items-start gap-1">
                  <div className="" style={{ fontSize: 14, fontWeight: 600 }}>
                    Individual Address
                  </div>
                  <div
                    className="text-secondary"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                    {cardholder.individual.address?.line1},&nbsp;
                    {cardholder.individual.address?.city},&nbsp;
                    {cardholder.individual.address?.state},&nbsp;
                    {cardholder.individual.address?.country} -{" "}
                    {cardholder.individual.address?.postcode}
                  </div>
                </div>

                {postal_address && (
                  <>
                    <div className="d-flex flex-column justify-content-start align-items-start gap-1 mt-4">
                      <div
                        className=""
                        style={{ fontSize: 14, fontWeight: 600 }}
                      >
                        Postal Address
                      </div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: 12, fontWeight: 500 }}
                      >
                        {cardholder.postal_address?.line1},&nbsp;
                        {cardholder.postal_address?.city},&nbsp;
                        {cardholder.postal_address?.state},&nbsp;
                        {cardholder.postal_address?.country} -{" "}
                        {cardholder.postal_address?.postcode}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <>
          <div className="d-flex flex-column justify-content-start align-items-start gap-1 mt-4 w-100">
            <div className="" style={{ fontSize: 14, fontWeight: 600 }}>
              Cards
            </div>
            <div
              className="text-secondary w-100"
              style={{
                fontSize: 12,
                fontWeight: 500,
                maxHeight: 132.8,
                overflowY: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: 10,
                }}
              >
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "left",
                          backgroundColor: "#f8f8f8",
                          fontWeight: "bold",
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cardLoading ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        <div className="d-flex flex-column justify-content-center align-items-center gap-3 my-3">
                          <RingLoader size={30} />
                          <span style={{ fontSize: 14, color: "#999" }}>
                            Loading cards...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        <div className="my-3"> No card(s) available... </div>
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.map((col) => (
                          <td
                            key={col.id}
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontSize: "12px",
                            }}
                          >
                            {row[col.id]}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      </>
    );
  };

  const ManageCardholderDetails = async () => {
    try {
      setBtnLoading(true);
      let res = await dispatch(
        DeleteCardholderAWX(activeData?.cardholder_id, authToken)
      );
      if (res.deleted) {
        toast.success(`Cardholder: ${activeData?.email} deleted successfully!`);

        setTimeout(() => {
          navigate(0);
        }, 2000);
      } else {
        toast.error(
          `Unable to delete cardholder: ${activeData?.email}. Please try again later.`
        );
      }
    } catch {
      console.log(e);
    } finally {
      setBtnLoading(false);
    }
  };

  const InviteCardholder = async () => {
    try {
      setBtnLoading(true);
      let res = await dispatch(
        InviteCardholderAWX(
          activeData?.email,
          activeData?.mobile_number?.replace("-", ""),
          activeData?.cardholder_id,
          authToken
        )
      );
      if (res.activation_id) {
        toast.success(`Cardholder: ${activeData?.email} invited successfully!`);

        // setTimeout(() => {
        //   navigate(0);
        // }, 2000);
      } else {
        toast.error(
          `Unable to invite cardholder: ${activeData?.email}. Please try again later.`
        );
      }
    } catch {
      console.log(e);
    } finally {
      setBtnLoading(false);
    }
  };

  if (!complianceStatus) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Cardholders",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />
        <ActivateAccount />
      </>
    );
  }
  if (complianceStatus !== "COMPLETED") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Cardholders",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />

        <div className="d-flex" style={{ height: "80vh" }}>
          <div className="m-3 w-100">
            <div className="row bg-white border p-4 d-flex rounded-3 w-100">
              <div
                className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
                style={{ padding: "5rem 9rem" }}
              >
                <div
                  className="rounded-circle bg-light-primary mx-auto mb-3"
                  style={{ marginTop: "30px" }}
                >
                  <img
                    src="/locked.svg"
                    style={{ marginTop: "10px" }}
                    width={100}
                  />
                </div>
                <h4
                  className="text-center"
                  style={{
                    fontSize: "16px",
                    lineHeight: "25px",
                    marginTop: "-15px",
                  }}
                >
                  Your account verification is currently in process. Please
                  await further updates on your
                  <Link
                    to="/onboarding/Home"
                    style={{ color: "#327e9d", textDecoration: "none" }}
                  >
                    {" compliance process"}
                  </Link>
                  .
                </h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (
    subStatus === undefined ||
    subStatus === "inactive" ||
    subStatus === "sub01" ||
    subStatus === "sub02"
  ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Cardholders",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />
        <CompareAllPlans />
      </>
    );
  }

  if (subStatus === "canceled") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Cardholders",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />
        <ManageSubscription />
      </>
    );
  }

  return (
    <>
      <BreadCrumbs
        data={{
          name: "Card Holders",
          img: "/accounts/accounts.svg",
          backurl: "/dashboard",
        }}
      />

      <Card className="border m-3 p-4 rounded-5">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
            <IconButton className="p-3 bg-light rounded-circle">
              <Style className="text-primary" fontSize="large" />
            </IconButton>
            <label htmlFor="" className="text-secondary fw-bold text-uppercase">
              Card Holders
            </label>
          </div>

          <div className="d-flex justify-content-center align-items-center gap-4">
            <button
              className="bg-dark text-white rounded-pill border-0 px-4 py-2 fs-8 d-flex align-items-center justify-content-center gap-2"
              onClick={() => setOpen(true)}
            >
              <Add /> Add New Cardholder
            </button>

            {/* <button
              className="bg-dark text-white rounded-pill border-0 px-4 py-2 fs-8 d-flex align-items-center justify-content-center gap-2"
              onClick={() => setOpenCards(true)}
            >
              <Add /> Add New Card
            </button> */}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center w-100 my-4 gap-4">
          <div className="w-60">
            <CustomInput
              leftIcon={<Search />}
              onInput={setSearch}
              value={search}
              placeholder={`Search via cardholder name or email...`}
            />
          </div>

          <div className="w-40">
            <CustomSelect
              options={statusOptions}
              value={status}
              onChange={setStatus}
            />
          </div>
        </div>

        <CustomTable
          columns={columns}
          rows={rows}
          className=""
          style={``}
          maxHeight={650}
          isLoading={isLoading}
        />
      </Card>

      <CustomModal
        isOpen={isOpen}
        handleClose={handleClose}
        children={<CreateCardholderModal />}
        headerText={`Add New Cardholder`}
        width={800}
      />

      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor="right"
      >
        <div className="p-4" style={{ width: 500 }}>
          <div className="d-flex justify-content-between w-100 align-items-center pb-3 border-bottom mb-4">
            <label htmlFor="">Cardholder View</label>
            <Close onClick={() => setOpenDrawer(false)} color="secondary" />
          </div>

          <Card className="bg-light border p-4">
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0 d-flex align-items-center fw-600">
                    {activeData?.type === "INDIVIDUAL"
                      ? activeData?.individual?.name?.name_on_card
                      : "DELEGATE"}

                    <label
                      htmlFor=""
                      className={`${
                        activeData?.type?.status === "ACTIVE"
                          ? "bg-success text-white"
                          : activeData?.type?.status === "PENDING"
                          ? "bg-warning text-dark"
                          : "bg-primary text-white"
                      } px-2 py-1 border-0 rounded-pill text-center fw-500 ms-2`}
                      style={{ fontSize: 10 }}
                    >
                      {activeData?.status}
                    </label>
                  </h5>

                  <label
                    htmlFor=""
                    className="text-secondary"
                    style={{ fontSize: 12 }}
                  >
                    {activeData?.email}
                  </label>
                </div>

                <button
                  className="bg-warning text-dark rounded-pill border-0 d-flex align-items-center justify-content-center gap-1"
                  style={{ fontSize: 15, fontWeight: 600, padding: "8px 20px" }}
                  onClick={InviteCardholder}
                >
                  {btnLoading ? (
                    <div style={{ width: 100 }}>
                      <ClipLoader color="black" size={22} />
                    </div>
                  ) : (
                    <>
                      <PersonAddAlt sx={{ fontSize: 16 }} /> Invite
                    </>
                  )}
                </button>
              </div>

              <Divider className="w-100 my-3" />

              <CardholderDetails cardholder={activeData} />
            </div>
          </Card>

          <div
            className="d-flex justify-content-end gap-2 align-items-center"
            style={{ position: "absolute", bottom: "40px", right: "20px" }}
          >
            <button
              className="bg-dark text-white rounded-pill border-0 px-4 py-2 fs-8 d-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate("/expense/corporate-cards")}
            >
              <AddCard /> Assign Card
            </button>
            {/* <button
              className="bg-danger text-white rounded-pill border-0 px-4 py-2 fs-8 d-flex align-items-center justify-content-center gap-2"
              onClick={ManageCardholderDetails}
            >
              {btnLoading ? (
                <div style={{ width: 100 }}>
                  <ClipLoader color="white" size={22} />
                </div>
              ) : (
                <>
                  <Delete /> Delete
                </>
              )}
            </button> */}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Cardholders;
