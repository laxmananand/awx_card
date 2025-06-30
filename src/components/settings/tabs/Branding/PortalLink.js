import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../structure/CustomText'
import { TextField } from '@mui/material'
import { handleCopy } from '../../../structure/handleCopy';
import { useDispatch, useSelector } from 'react-redux';
import { brandingUpload, getbrandingDetails } from "../../../../@redux/action/settings.js";
import { toast } from "react-toastify";
import { FadeLoader } from 'react-spinners';
import { Link, useNavigate } from "react-router-dom";

function PortalLink() {
    const [subDomain, setSubDomain] = useState("");
    const [error, setError] = useState("");
    const [domain, setDomain] = useState("");
    const [isApply, setIsApply] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const subStatus = useSelector((state) => state.subscription?.data?.status);
    const complianceStatus =  useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus) || "";

    const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,}$/;



    useEffect(() => {
        setIsApply(false);
    }, [subDomain])

    const saveDomain = async () => {

        if (complianceStatus.toLowerCase() === "completed" && (subStatus?.toLowerCase() === "inactive" || subStatus === "sub01" || subStatus === "sub02" || subStatus?.toLowerCase() === "canceled")) {
            navigate("/settings/subscription")
            // toast.error("Kindly take subscription before applying for custom domain.")
            return
        }

        if (subDomain) {
            setLoading(true);
            const data = await dispatch(brandingUpload({ subDomain: subDomain }));
            if (data && (data?.message == "updated successfully" || data?.message == "saved successfully")) {
                toast.success("Sub Domain " + data?.message + "!");
                setLoading(false);
            }
            else {
                toast.error(data?.message);
                setLoading(false);
            }
        }
        else {
            toast.error("Kindly enter the sub-domain name prior to proceeding.");

        }
    }

    const handleBind = () => {

        if (!domain.trim()) {
            toast.error("Please enter your custom domain name !");
            setError("Please enter your custom domain name !");
          }
          else if (!domainRegex.test(domain)) {
            setError("Invalid custom domain name format.");
            toast.error("Invalid domain name format.");
          }
          else {
            setIsApply(true);
            setError("");
          }

    }


    if (complianceStatus.toLowerCase() !== "completed") {
        return <div className="d-flex flex-column bg-white justify-content-center">
            <div className="p-5 m-4">
                <div className="d-flex justify-content-center">
                    <img
                        src="/locked.svg"
                        alt="add beneficiary"
                        width={200}
                    />
                </div>

                <div className="d-flex justify-content-center ">
                    <p className="blockquote text-center p-3">
                        <span className="blockquote fw-50" style={{ fontSize: "15px", lineHeight: "25px" }}>
                            You don't have permission to add custom domain.
                            <br />
                            To add custom domain, you need to{" "}
                        </span>
                        <Link to="/onboarding/Home" style={{ fontSize: "15px", lineHeight: "25px" }} className="blockquote blue100">
                            Activate Your Account
                        </Link>
                        <span className="fw-50 blockquote" style={{ fontSize: "15px", lineHeight: "25px" }}> first.</span>
                    </p>
                </div>
            </div>
        </div>
    }

    return (
        <>
            {loading && (
                <div className="loader-overlaySettings">
                    <div className="loader-containerSettings">
                        <FadeLoader color={'var(--main-color)'} loading={loading} size={50} />
                    </div>
                </div>
            )}
            <div className='shadow rounded-5 p-4 m-5 mx-auto d-flex flex-column' style={{ width: "500px", height: "200px" }}>
                <label>Customize your sub-domain</label>
                <div className="d-flex my-1">
                    <TextField variant='standard' className='w-100 py-3' onChange={(e) => setSubDomain(e.target.value)} />
                    <TextField variant='standard' className='w-100 py-3' value=".zoqq.com" readOnly={true} />
                </div>

                <button onClick={saveDomain} className='btn w-100 btn-action mt-3'>Apply</button>
            </div>
            {<div className='shadow rounded-5 p-4 m-3 w-50 mx-auto d-flex flex-column'>
                <label>Bind your own domain</label>

                <p className='mt-4'>Enter your custom external domain &#40;e.g. mydomain.com&#41; in the field below to bind it to the environment</p>
                <div className='d-flex'>
                    <TextField placeholder='mydomain.com' variant='standard' className='w-50' onChange={(e) => setDomain(e.target.value)}
                    error={!!error} // Show red border if there's an error
                    helperText={error}/>
                    <button className='btn ms-1 btn-action' onClick={handleBind}>Bind</button>
                    {/*  {() => setIsApply(true)} */}
                </div>


                {isApply && <>
                    <p className='mt-4'>In your domain registrar, add a CNAME or ANAME record for the required custom domain to point to the current domain</p>
                    <div className='d-flex'>
                        <TextField variant='standard' className='w-25' value={"zoqq-alb-public-webdns-93134598090.eu-west-1.elb.amazonaws.com"} />
                        <button className='ms-1 btn bg-blue100 text-white' onClick={e => handleCopy(e, "zoqq-alb-public-webdns-93134598090.eu-west-1.elb.amazonaws.com")}>Copy</button>
                    </div>

                </>}
            </div>}
        </>
    )
}

export default PortalLink