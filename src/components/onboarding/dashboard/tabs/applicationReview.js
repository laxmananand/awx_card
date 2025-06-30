import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

function applicationReview() {
  const list = ["progress", "pending", "approve"];
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(list[Math.floor(Math.random() * 3)]);
  }, []);
  return (
    <div className="accordion" id="accordionExample">
      <div className="accordion-item border-0">
        <button
          className="accordion1 border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <div className={status}>
            <div className="file-zip-parent">
              <ReactSVG
                src="/onboarding/accounts/applicationReview/kycDet.svg"
                beforeInjection={(svg) => {
                  svg.setAttribute("style", "stroke: yellow");
                  const paths = svg.querySelectorAll("path");
                  paths.forEach((path) => {
                    path.setAttribute(
                      "stroke",
                      status === "pending" ? "#E0990C" : status == "progress" ? "#299E58" : "#099cbc"
                    );
                  });
                }}
                className="file-zip-icon"
              />
              <img className="edit-circle-icon1" alt="" src={"/onboarding/accounts/" + status + ".svg"} />
            </div>
          </div>
          <div className="title4">
            <div className="add-details-to1">KYC Details</div>
            <div className={"bg-" + status + " text-start"}>
              {status === "pending" ? "Pending" : status == "progress" ? "In Progress" : "Approved"}
            </div>
          </div>
          <div className="icon-open2">
            <div className="chevron-up1">
              <img className="arrow-icon15" alt="" src="arrow2.svg" />
            </div>
          </div>
        </button>
        <div
          id="collapseOne"
          className="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <form className="form">
            <div className="d-flex align-self-stretch">
              <div className="input-group w-100 me-2 pb-0">
                <select id="country" name="country" className="form-input my-0 pb-0">
                  <option value=""></option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                </select>
                <label htmlFor="country" className="form-input-label ps-1">
                  Business Type
                </label>
              </div>
            </div>
            <div className="d-flex flex-column me-auto">
              <label htmlFor="country" className="form-input-label ps-1 mb-2">
                Resident
              </label>
              <div>
                <input type="radio" id="resident1" name="age" value={true} />
                <label for="resident1" className="ms-1">
                  Yes
                </label>
                <input type="radio" id="resident2" className="ms-3" name="age" value={false} />
                <label for="resident2" className="ms-1">
                  No
                </label>
              </div>
            </div>
            <button className="btn btn-action outline-none">
              <img className="check-double-icon" alt="" src="check-double.svg" />
              <div className="label7">Submit</div>
            </button>
          </form>
        </div>
      </div>

      <div className="accordion-item border-0">
        <button
          className="accordion1 border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <div className={status}>
            <div className="file-zip-parent">
              <ReactSVG
                src="/onboarding/accounts/applicationReview/appProDet.svg"
                beforeInjection={(svg) => {
                  svg.setAttribute("style", "stroke: yellow");
                  const paths = svg.querySelectorAll("path");
                  paths.forEach((path) => {
                    path.setAttribute(
                      "stroke",
                      status === "pending" ? "#E0990C" : status == "progress" ? "#299E58" : "#099cbc"
                    );
                  });
                }}
                className="file-zip-icon"
              />
              <img className="edit-circle-icon1" alt="" src={"/onboarding/accounts/" + status + ".svg"} />
            </div>
          </div>
          <div className="title4">
            <div className="add-details-to1">Applicant Professional Details</div>
            <div className={"bg-" + status + " text-start"}>
              {status === "pending" ? "Pending" : status == "progress" ? "In Progress" : "Approved"}
            </div>
          </div>
          <div className="icon-open2">
            <div className="chevron-up1">
              <img className="arrow-icon15" alt="" src="arrow2.svg" />
            </div>
          </div>
        </button>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <form className="form">
            <div className="d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <select id="country" name="country" className="form-input my-0 pb-0">
                  <option value=""></option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                </select>
                <label htmlFor="country" className="form-input-label ps-1">
                  Country
                </label>
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  type="text"
                  id="settlorname"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="businesstype" className="form-input-label ps-1">
                  Postal Code
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
            </div>
            <button className="btn btn-action outline-none">
              <img className="check-double-icon" alt="" src="check-double.svg" />
              <div className="label7">Submit</div>
            </button>
          </form>
        </div>
      </div>

      <div className="accordion-item border-0">
        <button
          className="accordion1 border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseThree"
          aria-expanded="true"
          aria-controls="collapseThree"
        >
          <div className={status}>
            <div className="file-zip-parent">
              <ReactSVG
                src="/onboarding/accounts/applicationReview/appAdd.svg"
                beforeInjection={(svg) => {
                  svg.setAttribute("style", "stroke: yellow");
                  const paths = svg.querySelectorAll("path");
                  paths.forEach((path) => {
                    path.setAttribute(
                      "stroke",
                      status === "pending" ? "#E0990C" : status == "progress" ? "#299E58" : "#099cbc"
                    );
                  });
                }}
                className="file-zip-icon"
              />
              <img className="edit-circle-icon1" alt="" src={"/onboarding/accounts/" + status + ".svg"} />
            </div>
          </div>
          <div className="title4">
            <div className="add-details-to1">Applicant Address</div>
            <div className={"bg-" + status + " text-start"}>
              {status === "pending" ? "Pending" : status == "progress" ? "In Progress" : "Approved"}
            </div>
          </div>
          <div className="icon-open2">
            <div className="chevron-up1">
              <img className="arrow-icon15" alt="" src="arrow2.svg" />
            </div>
          </div>
        </button>
        <div
          id="collapseThree"
          className="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <form className="form">
            <div className="d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  type="text"
                  id="businessIN"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="username" className="form-input-label ps-1">
                  Address 1
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  type="text"
                  id="businessname"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="businessname" className="form-input-label ps-1">
                  Address 2
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
            </div>
            <div className="d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  type="text"
                  id="businesstype"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="businesstype" className="form-input-label ps-1">
                  City
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  type="text"
                  id="tradename"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="tradename" className="form-input-label ps-1">
                  State
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
            </div>
            <div className="d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  type="text"
                  id="settlorname"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="businesstype" className="form-input-label ps-1">
                  Postal Code
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <select id="country" name="country" className="form-input my-0 pb-0">
                  <option value=""></option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                </select>
                <label htmlFor="country" className="form-input-label ps-1">
                  Country
                </label>
              </div>
            </div>
            <button className="btn btn-action outline-none">
              <img className="check-double-icon" alt="" src="check-double.svg" />
              <div className="label7">Submit</div>
            </button>
          </form>
        </div>
      </div>

      <div className="accordion-item border-0">
        <button
          className="accordion1 border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseFour"
          aria-expanded="true"
          aria-controls="collapseFour"
        >
          <div className={status}>
            <div className="file-zip-parent">
              <ReactSVG
                src="/onboarding/accounts/applicationReview/appConDet.svg"
                beforeInjection={(svg) => {
                  svg.setAttribute("style", "stroke: yellow");
                  const paths = svg.querySelectorAll("path");
                  paths.forEach((path) => {
                    path.setAttribute(
                      "stroke",
                      status === "pending" ? "#E0990C" : status == "progress" ? "#299E58" : "#099cbc"
                    );
                  });
                }}
                className="file-zip-icon"
              />
              <img className="edit-circle-icon1" alt="" src={"/onboarding/accounts/" + status + ".svg"} />
            </div>
          </div>
          <div className="title4">
            <div className="add-details-to1">Applicant Contact Details</div>
            <div className={"bg-" + status + " text-start"}>
              {status === "pending" ? "Pending" : status == "progress" ? "In Progress" : "Approved"}
            </div>
          </div>
          <div className="icon-open2">
            <div className="chevron-up1">
              <img className="arrow-icon15" alt="" src="arrow2.svg" />
            </div>
          </div>
        </button>
        <div
          id="collapseFour"
          className="accordion-collapse collapse"
          aria-labelledby="headingFour"
          data-bs-parent="#accordionExample"
        >
          <form className="form">
            <div className="d-flex align-self-stretch">
              <div className="input-group w-100 pb-0">
                <input
                  type="text"
                  id="settlorname"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="businesstype" className="form-input-label ps-1">
                  Settlor Name
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
            </div>
            <div className="d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  type="text"
                  id="settlorname"
                  className="form-input my-0 pb-0"
                  onkeyup="this.setAttribute('value', this.value);"
                  defaultValue=""
                />
                <label htmlFor="businesstype" className="form-input-label ps-1">
                  Postal Code
                </label>
                <img className="cross-circle-icon1" alt="" src="cross-circle1.svg" />
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <select id="country" name="country" className="form-input my-0 pb-0">
                  <option value=""></option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                  <option value="india">India</option>
                </select>
                <label htmlFor="country" className="form-input-label ps-1">
                  Country
                </label>
              </div>
            </div>
            <button className="btn btn-action outline-none">
              <img className="check-double-icon" alt="" src="check-double.svg" />
              <div className="label7">Submit</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default applicationReview;
