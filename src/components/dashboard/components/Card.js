import React, { useDebugValue, useEffect, useState } from "react";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}

function Card() {
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
    <div className="bg-white m-3 pb-3 border">
      <div className="d-flex align-items-center bg-white p-4">
        <img src={assets["card.svg"].default} />
        <h4 className="m-0 ms-2">Cards</h4>
      </div>

      <div className="d-flex justify-content-center">
        <div>
          <img
            src={assets["lock_3.svg"].default}
            className=" border p-3 bg-grey"
          />
        </div>
      </div>

      <p className="text-center pb-5 mb-5 mt-2 p-3">
        <span className="fw-normal">
          You don't have any cards yet.
          <br />
          To create cards, you need to{" "}
        </span>
        <a href="#" className="blue100">
          Activate Your Account
        </a>
        <span className="fw-normal"> first.</span>
      </p>
    </div>
  );
}

export default Card;
