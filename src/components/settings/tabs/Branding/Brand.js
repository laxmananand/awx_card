import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import {
  brandingUpload,
  getbrandingDetails,
  uploadDocS3,
} from "../../../../@redux/action/settings.js";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function Brand({ setLogo }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadImg, setUploadImg] = useState(null);
  const [brandName, setBrandName] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const brandNameFromURL = useSelector(
    (state) => state.settings?.branding?.brandName
  );
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus = useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus) || "";

  useEffect(() => {
    if (brandNameFromURL) setBrandName(brandNameFromURL);
  }, [brandNameFromURL]);

  const handleImageChange = () => {
    const file = fileInputRef.current.files[0];
    // setSelectedImage(file.name);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = reader.result;
        const trimmedBase64 = dataURL.split(",")[1];
        setSelectedImage(file.name);
        setLogo(trimmedBase64);
        setUploadImg(trimmedBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSave = async () => {

    if (complianceStatus.toLowerCase() === "completed" && (subStatus?.toLowerCase() === "inactive" || subStatus === "sub01" || subStatus === "sub02" || subStatus?.toLowerCase() === "canceled")) {
        navigate("/settings/subscription");
        return;
    }

    if (brandName) {
      setLoading(true);
      const data = await dispatch(brandingUpload({ brandName: brandName }));
      if (
        data &&
        (data?.message == "updated successfully" ||
          data?.message == "saved successfully")
      ) {
        localStorage.setItem("brandName", brandName);
        document.title = brandName;
        toast.success("Brand Name " + data?.message + "!");
        setLoading(false);
      } else {
        toast.error(data?.message);
        setLoading(false);
      }
    } else {
      toast.error("Kindly enter the brand name prior to proceeding.");
    }
  };

  const uploadLogo = async () => {
    if (complianceStatus.toLowerCase() === "completed" && (subStatus?.toLowerCase() === "inactive" || subStatus === "sub01" || subStatus === "sub02" || subStatus?.toLowerCase() === "canceled")) {
        navigate("/settings/subscription");
        return;
    }
    if (selectedImage) {
      setLoading(true);
      const uploadS3 = await dispatch(uploadDocS3(selectedImage, uploadImg));
      if (uploadS3 && uploadS3?.url) {
        const data = await dispatch(brandingUpload({ logoUrl: uploadS3?.url }));

        if (
          data &&
          (data?.message == "updated successfully" ||
            data?.message == "saved successfully")
        ) {
          localStorage.setItem("logo", selectedImage);
          const brandLogo = document.getElementById("logo");
          brandLogo.src = selectedImage;
          toast.success("Logo " + data?.message + "!");
          setLoading(false);

          setTimeout(() => {
            navigate(0);
          }, 1200);
        } else {
          toast.error(data?.message);
          setLoading(false);
        }
      } else {
        toast.error(uploadS3?.message);
        setLoading(false);
      }
    } else {
      toast.error("Kindly select a file prior to proceeding.");
    }
  };

  return (
    <>
      {loading && (
        <div className="loader-overlaySettings">
          <div className="loader-containerSettings">
            <FadeLoader
              color={"var(--main-color)"}
              loading={loading}
              size={50}
            />
          </div>
        </div>
      )}
      <div className="shadow rounded-5 p-4 m-3">
        <label>Add Your Brand Name</label>
        <TextField
          label="Brand Name"
          name="brand"
          value={brandName}
          onChange={(e) => {
            setBrandName(e.target.value);
          }}
          className="w-100 "
          variant="standard"
          style={{ marginTop: "5px" }}
          defaultValue={"ZOQQ"}
        />

        <div className="d-flex">
          <button
            onClick={onSave}
            className="btn btn-action fw-500 ms-auto mt-3">
            Save Changes
          </button>
        </div>
        <br></br>
        <label>Add Your Brand Logo</label>
        <label
          htmlFor="uploadLogo"
          role="button"
          className="bg-blue10 d-flex flex-column justify-content-center border-activeBlue mt-3"
          style={{ borderStyle: "dotted" }}>
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" />
          ) : (
            <>
              <div className="d-flex mt-4">
                <img src="/draganddrop.svg" className="mx-auto" />
              </div>
              <p className="fw-normal text-center blue100 fw-500 mb-4">
                Upload Logo
              </p>
            </>
          )}
        </label>
        <input
          id="uploadLogo"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          hidden
        />

        <div className="d-flex">
          <button
            onClick={uploadLogo}
            className="btn btn-action fw-500 ms-auto mt-3">
            Upload & Save
          </button>
        </div>
      </div>
    </>
  );
}

export default Brand;
