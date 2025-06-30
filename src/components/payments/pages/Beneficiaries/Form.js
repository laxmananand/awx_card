import * as React from "react";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Select from "react-select";
import { FormControl, InputLabel, TextField } from "@mui/material";
import CustomSelect from "../../../structure/CustomSelect";

import { useSelector } from "react-redux";
import {
  addBeneficiary,
  getBankName,
  getCurrencyAndCountry,
  getPayoutMethod,
  listbeneficiaries,
} from "../../../../@redux/action/payments";
import { closeLoader, openLoader } from "../../../../@redux/features/common";
import { useDispatch } from "react-redux";
import {
  setPayoutMethod,
  setBankListWithValue,
} from "../../../../@redux/features/payments";
import { toast } from "react-toastify";
function DynamicInputBox({
  field,
  properties,
  onInputChange,
  options = [],
  title = undefined,
  formData = {},
  stopPaste = false,
  onSearch = () => { },
}) {
  const [error, setError] = React.useState(false);
  const requiredFields = useSelector((state) => state.payments.requiredFields);
  const pattern = properties[field]?.pattern;
  const regexPattern = new RegExp(pattern);
  const onChange = (e) => {
    const value = e.target.value;
    let isValid = regexPattern.test(value);
    if (properties[field]?.maxLength) {
      isValid = isValid && value.length <= Number(properties[field]?.maxLength);
    }
    setError(!isValid && value);
    onInputChange(e);
  };

  const [filterOptions, setFilterOptions] = React.useState([]);

  React.useEffect(() => {
    if ((properties[field]?.const?.length || 0) > 0) {
      onInputChange({
        target: { value: properties[field]?.const, name: field },
      });
    }
  }, [properties[field]?.const]);

  React.useEffect(() => {
    if (options?.length > 0 && properties?.[field]?.enum?.length > 0) {
      setFilterOptions(
        options.filter((item) => properties[field]?.enum?.includes(item.value))
      );
    } else {
      setFilterOptions(options);
    }
  }, [options]);

  const view =
    // true ||
    requiredFields.find((item) => item === field) === field ||
    field === "beneficiaryBankName";

  if (properties[field]?.const) return <></>;

  return (
    <div
      key={field}
      className={
        "d-flex justify-content-around mt-3 mx-1 w-100" +
        (view ? "" : " d-none")
      }
    >
      {options?.length > 0 &&
        !(options?.length === 1 && options[0]?.label === "{}") ? (
        <div className="d-flex flex-column w-100">
          {/* <InputLabel
            htmlFor={field}
            shrink={formData[field]}
            error={error}
            className="text-start ms-3"
            style={{ fontSize: "1em" }}
          >
            {title || properties[field]?.title}
            {(requiredFields.find((item) => item === field) === field ||
              field === "beneficiaryBankName") && (
                <span className="text-danger"> *</span>
              )}
          </InputLabel> */}
          <CustomSelect
            className="w-100 border-bottom fw-normal"
            onInputChange={onSearch}
            value={options.find((item) => item.value === formData[field]) || null}
            placeholder={"Select " + (title || properties[field]?.title)}
            options={filterOptions}
            setValue={(val) =>
              onChange({ target: { name: field, value: val } })
            }
            required={
              requiredFields.find((item) => item === field) === field ||
              field === "beneficiaryBankName"
            }
          />
          {requiredFields.find((item) => item === field) === field ||
            field === "beneficiaryBankName"}
        </div>
      ) : (
        <FormControl className="border-bottom w-100">
          <InputLabel htmlFor={field} shrink={formData[field]} error={error}>
            {title || properties[field]?.title}
            {requiredFields.find((item) => item === field) === field && (
              <span className="text-danger"> *</span>
            )}
          </InputLabel>
          {stopPaste && (
            <TextField
              id={field}
              name={field}
              defaultValue={properties[field]?.const || formData[field]}
              disabled={properties[field]?.const}
              required={requiredFields.find((item) => item === field) === field}
              error={error}
              helperText={error ? properties[field]?.errorMessage : ""}
              onChange={onChange}
              onPaste={(e) => e.preventDefault()}
            />
          )}
          {!stopPaste && (
            <TextField
              id={field}
              name={field}
              defaultValue={properties[field]?.const || formData[field]}
              disabled={properties[field]?.const}
              required={requiredFields.find((item) => item === field) === field}
              error={error}
              helperText={error ? properties[field]?.errorMessage : ""}
              onChange={onChange}
            />
          )}
        </FormControl>
      )}
    </div>
  );
}

export default function BeneficiaryForm({
  customerHashId,
  formData,
  setFormData,
}) {
  // const [formData, setFormData] = React.useState({});
  const [formData2, setFormData2] = React.useState({});

  const [basicInfoCompleted, setBasicInfoCompleted] = React.useState(false);
  const [isFormLoading, setIsloading] = React.useState(false)
  const dispatch = useDispatch();
  const countryOptions = useSelector((state) => state.payments.countryList);
  const currencyOptions = useSelector((state) => state.payments.currencyList);
  const phoneCodeOptions = useSelector((state) => state.payments.phoneCodeList);
  const bankAccountTypeOptions = useSelector(
    (state) => state.payments.bankAccountTypeList
  );
  const bankNameOptions = useSelector((state) => state.payments.bankNameList);
  const bankNameOptionsWithValue = useSelector(
    (state) => state.payments.bankNameWithValue
  );
  const properties = useSelector((state) => state.payments.properties);
  const payoutMethod = useSelector((state) => state.payments.payoutMethod);
  const [routingCodeValueOptions, setRoutingCodeValueOptions] = React.useState(
    []
  );

  const isLoading = useSelector((state) => state.payments.isLoading);

  React.useEffect(() => {
    if (!formData?.beneficiaryAccountType) dispatch(setPayoutMethod(""));
  }, [formData?.beneficiaryAccountType]);

  const clearPayoutMethod = () => {
    dispatch(setPayoutMethod(""));
  };

  React.useEffect(() => {
    dispatch(getCurrencyAndCountry());
  }, []);

  React.useEffect(() => {
    if (formData?.beneficiaryBankName) {
      setRoutingCodeValueOptions(
        bankNameOptionsWithValue?.find(
          (item) => item.name == formData?.beneficiaryBankName
        )?.option
      );
    }
  }, [formData?.beneficiaryBankName]);

  React.useEffect(() => {
    if (payoutMethod) {
      setFormData({ ...formData, payoutMethod });
    }
  }, [payoutMethod]);

  React.useEffect(() => {
    if (
      formData?.beneficiaryAccountType &&
      formData?.destinationCountry &&
      formData?.destinationCurrency
    ) {
      dispatch(getPayoutMethod({ ...formData, customerHashId }, setIsloading));
    }
  }, [formData?.destinationCurrency]);

  const onInputChange = (e) => {
    const { value, name } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  const onInputChange2 = (e) => {
    const { value, name } = e.target;
    setFormData2((prevState) => ({ ...prevState, [name]: value }));
  };

  const debounce = (getbank, timeout = 1000) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        getbank.apply(this, args);
      }, timeout);
    };
  };

  const onSearch = debounce((value) => {
    const body = {
      currencyCode: formData?.destinationCurrency,
      searchValue: value,
      countryCode: formData?.destinationCountry,
      routingCodeType: formData?.routingCodeType1,
    };
    if (value !== "") dispatch(getBankName(body));
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.beneficiaryAccountNumber === formData2.beneficiaryAccountNumber
    ) {
      const innerFucntion = () => {
        setFormData({}); //Empty the data if suceeded
        setFormData2({}); //Empty the data if suceeded
        setRoutingCodeValueOptions([]);
        setBankListWithValue([]);
        setBasicInfoCompleted(false); //Empty the data if suceeded
        document.getElementById("closeModalButton").click();
        dispatch(listbeneficiaries(customerHashId));
      };
      try {
        dispatch(addBeneficiary(formData, innerFucntion));
      } catch (error) {
        // Handle addBeneficiary error if needed
        console.error("Error adding beneficiary:", error);
      }
    } else {
      toast.error("Account numbers do not match.");
    }
  };

  return (
    <Box>
      {/* Step 1 */}
      <Slide
        direction="left"
        in={!formData?.beneficiaryAccountType}
        mountOnEnter
        unmountOnExit
      >
        <div>
          <h3>Type of beneficiary</h3>
          <div className="d-flex justify-content-around gap-5 mt-3 ">
            <input
              type="button"
              name={"beneficiaryAccountType"}
              value={"Individual"}
              onClick={onInputChange}
              className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-600 mt-3"
            />
            <input
              type="button"
              name={"beneficiaryAccountType"}
              value={"Corporate"}
              onClick={onInputChange}
              className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-600 mt-3"
            />
          </div>
        </div>
      </Slide>

      {/* Step 2 */}
      <Slide
        direction="left"
        in={!formData?.destinationCountry && formData?.beneficiaryAccountType}
        mountOnEnter
        unmountOnExit
      >
        <div className="d-flex flex-column">
          <h3>Destination country</h3>
          <div className="d-flex justify-content-around p-3">
            <Select
              className="w-100"
              placeholder="Select Country"
              options={countryOptions}
              onChange={(item) => {
                onInputChange({
                  target: { value: item.value, name: "destinationCountry" },
                });
                onInputChange({
                  target: { value: item.value, name: "beneficiaryCountryCode" },
                });
              }}
            />
          </div>
          <button
            className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
            onClick={(e) => {
              e.preventDefault();
              setFormData((prevState) => ({
                beneficiaryAccountType: "",
                destinationCountry: "",
                destinationCurrency: "",
                payoutMethod: "",
              }));
            }}
          >
            Back
          </button>
        </div>
      </Slide>

      {/* Step 3 */}
      <Slide
        direction="left"
        in={
          formData?.destinationCountry &&
          formData?.beneficiaryAccountType &&
          !formData?.destinationCurrency &&
          !payoutMethod
        }
        mountOnEnter
        unmountOnExit
      >
        <div className="d-flex flex-column">
          <h3>Destination currency</h3>
          <div className="d-flex justify-content-around mt-3">
            <Select
              className="w-100 p-2"
              placeholder="Select Currency"
              options={currencyOptions}
              onChange={(item) => {
                onInputChange({
                  target: { value: item.value, name: "destinationCurrency" },
                });
              }}
            />
          </div>
          <button
            className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
            onClick={(e) => {
              e.preventDefault();
              setFormData((prevState) => ({
                beneficiaryAccountType: prevState.beneficiaryAccountType,
                destinationCountry: "",
                destinationCurrency: "",
                payoutMethod: "",
              }));
            }}
            disabled={isFormLoading}
          >
            {isFormLoading ? "Loading" : "Back"}
          </button>
        </div>
      </Slide>

      {/* Step 4 */}
      <Slide
        direction="left"
        in={
          !basicInfoCompleted &&
          formData?.destinationCurrency &&
          formData?.destinationCountry &&
          formData?.beneficiaryAccountType &&
          payoutMethod
        }
        mountOnEnter
        unmountOnExit
      >
        <div className="d-flex flex-column bg-white">
          {/* Basic Form Start */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setBasicInfoCompleted(true);
            }}
          >
            <div>
              <h3>{"Basic Info"}</h3>
              <DynamicInputBox
                formData={formData}
                field={"beneficiaryName"}
                title="Beneficiary Full Name"
                properties={properties}
                onInputChange={onInputChange}
              />
              <div className="d-flex">
                <DynamicInputBox
                  formData={formData}
                  field={"beneficiaryContactCountryCode"}
                  title="Phone Code"
                  options={phoneCodeOptions}
                  properties={properties}
                  onInputChange={onInputChange}
                />
                <DynamicInputBox
                  formData={formData}
                  field={"beneficiaryContactNumber"}
                  properties={properties}
                  onInputChange={onInputChange}
                />
              </div>
              <DynamicInputBox
                formData={formData}
                field={"beneficiaryEmail"}
                properties={properties}
                onInputChange={onInputChange}
              />
              <DynamicInputBox
                formData={formData}
                field={"beneficiaryAddress"}
                properties={properties}
                onInputChange={onInputChange}
              />
              {/* <DynamicInputBox
                formData={formData}
                field={"beneficiaryCountryCode"}
                options={countryOptions}
                title={"Beneficiary Country"}
                properties={properties}
                onInputChange={onInputChange}
              /> */}
              <div className="d-flex">
                <DynamicInputBox
                  formData={formData}
                  field={"beneficiaryState"}
                  properties={properties}
                  onInputChange={onInputChange}
                />
                <DynamicInputBox
                  formData={formData}
                  field={"beneficiaryCity"}
                  properties={properties}
                  onInputChange={onInputChange}
                />
                <DynamicInputBox
                  formData={formData}
                  field={"beneficiaryPostcode"}
                  properties={properties}
                  onInputChange={onInputChange}
                />
              </div>
              <DynamicInputBox
                formData={formData}
                title={"Remitter Benefificiary Relationship (Optional)"}
                field={"remitterBeneficiaryRelationship"}
                properties={properties}
                onInputChange={onInputChange}
              />
              <div className="d-flex">
                <DynamicInputBox
                  formData={formData}
                  title="Beneficiary Identification Type (Optional)"
                  field={"beneficiaryIdentificationType"}
                  properties={properties}
                  onInputChange={onInputChange}
                />
                <DynamicInputBox
                  formData={formData}
                  title="Beneficiary Identification Value (Optional)"
                  field={"beneficiaryIdentificationValue"}
                  properties={properties}
                  onInputChange={onInputChange}
                />
              </div>
            </div>

            {/* Basic Form End */}
            <div className="d-flex flex-row justify-content-around gap-3 p-3">
              <button
                type="button"
                className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
                onClick={(e) => {
                  e.preventDefault();
                  clearPayoutMethod();
                  setFormData((prevState) => ({
                    beneficiaryAccountType: prevState.beneficiaryAccountType,
                    destinationCountry: prevState.destinationCountry,
                    destinationCurrency: "",
                    payoutMethod: "",
                  }));
                  console.log(formData)
                }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 fw-500"
                disabled={isFormLoading}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </Slide>

      {/* Step 5 */}
      <Slide
        direction="left"
        in={
          basicInfoCompleted &&
          formData?.destinationCurrency &&
          formData?.destinationCountry &&
          formData?.beneficiaryAccountType
        }
        mountOnEnter
        unmountOnExit
      >
        <div className="d-flex flex-column bg-white">
          {/* Account Form Start */}
          <form onSubmit={onSubmit}>
            <div>
              <h3>{"Account Info"}</h3>
              <DynamicInputBox
                formData={formData}
                field={"beneficiaryBankAccountType"}
                properties={properties}
                onInputChange={onInputChange}
                options={bankAccountTypeOptions}
              />
              <DynamicInputBox
                formData={formData}
                field={"beneficiaryBankName"}
                properties={properties}
                onInputChange={onInputChange}
                onSearch={onSearch}
                options={bankNameOptions}
              />
              <DynamicInputBox
                title="Routing Code Type"
                formData={formData}
                field={"routingCodeType1"}
                properties={properties}
                onInputChange={onInputChange}
              />
              <DynamicInputBox
                formData={formData}
                title={formData?.routingCodeType1 + " Code"}
                field={"routingCodeValue1"}
                properties={properties}
                onInputChange={onInputChange}
                options={routingCodeValueOptions}
              />
              <DynamicInputBox
                formData={formData}
                field={"beneficiaryAccountNumber"}
                title="Account Number"
                properties={properties}
                onInputChange={onInputChange}
              />
              <DynamicInputBox
                formData={formData2}
                field={"beneficiaryAccountNumber"}
                title="Confirm Account Number"
                properties={properties}
                stopPaste={true}
                onInputChange={onInputChange2}
              />
            </div>
            <div className="d-flex flex-row justify-content-around gap-3 p-3">
              <button
                type="button"
                className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
                onClick={(e) => {
                  e.preventDefault();
                  setBasicInfoCompleted(false);
                }}
              >
                Back
              </button>

              <button
                type="submit"
                className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
                disabled={isLoading}
              >
                {/* Submit */}

                {/* Save Beneficiary */}
                {isLoading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Save Beneficiary"
                )}
              </button>
            </div>
          </form>
          {/* Account Form End */}
        </div>
      </Slide>
    </Box>
  );
}
