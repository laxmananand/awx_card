import React, { useState, useEffect } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import Bill from "./Createbill/Bill";
import Transfer from "./Createbill/Transfer";
import Review from "./Createbill/Review";
import SideBar from "../../SideBar";
import { docanalysis } from "../js/bills-functions.js";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ContentLoader from "react-content-loader";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../@redux/features/expence.js";

function CreateRequest() {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedFileName = searchParams.get("filename");
  const selectedFileurl = searchParams.get("url");

  let currentState = useSelector((state) => state.expence.currentState);
  let apiData = useSelector((state) => state.expence.apiData);
  let transferFields = useSelector((state) => state.expence.transferFields);
  let reviewFields = useSelector((state) => state.expence.reviewFields);

  useEffect(() => {
    sessionStorage.setItem("selectedFileurl", selectedFileurl);
  }, [selectedFileurl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await docanalysis(selectedFileName);
        if (!fetchedData) {
          toast.info("Please put your bill details");
        } else {
          dispatch(actions.setApiData(fetchedData));
          console.log("API Data:", fetchedData);
        }
      } catch (error) {
        dispatch(actions.setApiData({}));
        console.log("Error fetching API data:", error);
      }
    };

    if (selectedFileName) {
      fetchData();
    }
  }, [selectedFileName]);

  return (
    <div className="d-flex">
      <SideBar />

      <div
        className="container-fluid px-0 bg-light clear-left overflow-auto"
        style={{ height: "100vh" }}
      >
        <BreadCrumbs
          data={{
            backurl: "/expense/bills",
            name: "Create New Bill",
            info: true,
            img: "/arrows/arrowLeft.svg",
          }}
        />

        <div className="d-flex row">
          <div className="col-7 bg-white m-3 p-5 border rounded-3 mx-auto">
            <h2 className="opacity-75">Bill Details</h2>

            {apiData ? (
              currentState === 0 ? (
                <Bill
                  selectedFileName={selectedFileName}
                  selectedFileurl={selectedFileurl}
                />
              ) : currentState === 1 ? (
                <Transfer />
              ) : currentState === 2 ? (
                <Review />
              ) : (
                <></>
              )
            ) : (
              <>
                <ContentLoader
                  speed={1}
                  width={800}
                  height={200}
                  viewBox="-20 0 400 160"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                ></ContentLoader>

                <ContentLoader
                  speed={1}
                  width={800}
                  height={200}
                  viewBox="-20 0 400 160"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                ></ContentLoader>

                <ContentLoader
                  speed={1}
                  width={800}
                  height={200}
                  viewBox="-20 0 400 160"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                ></ContentLoader>
              </>
            )}
          </div>
          <div className="col-4 bg-white m-3 p-4 border rounded-3 mx-auto">
            <iframe src={selectedFileurl} className="w-100 h-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateRequest;
