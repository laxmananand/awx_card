import React, { useState, useEffect } from "react";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}

function UpdateToProCard() {
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
  return (
    <div className="mx-3 row border p-3 bg-white h-100">
      <div className="h3">
        Update to Pro
        <br />
        <span className="h4">$29,99 / month</span>
      </div>
      <p className="row grey1 fw-normal">
        Open more possibilities of your service with a pro account. More of
        these features, these and more.
      </p>
      <button className="btn bg-blue10 blue100 fw-500 fs-5 p-0 mt-5 mb-2 py-3  px-2 py-md-0 border">
        Update my Plan
      </button>
    </div>
  );
}

export default UpdateToProCard;
