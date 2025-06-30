import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}

function Header() {
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    // Use require.context to get all files from the directory
    const requireContext = require.context(
      "../assets/",
      true,
      /\.(svg|png|jpg|jpeg|gif)$/
    );

    // Call the function and get all files in the directory
    importAll(requireContext).then((fetchedAssets) => {
      setAssets(fetchedAssets);
    });
  }, []);

  if (!assets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-yellow10 p-3 m-3 rounded-3 d-flex align-items-center">
      <img src={assets["lock_1.svg"].default} />
      <h6 className="me-auto my-0 ms-2 text-capitalize">
        Add Your Business details to Activate Your Account and unlock all
        features
      </h6>
      <Link to="/onboarding">
        <button className="btn bg-white yellow100 ms-3">
          Activate Account
        </button>
      </Link>
    </div>
  );
}

export default Header;
