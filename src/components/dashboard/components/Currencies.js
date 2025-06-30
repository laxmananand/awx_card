import React, { useEffect, useState } from "react";
import EachCurrencies from "./structure/EachCurrencies";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}

function Currencies() {
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
    <div className="border-bottom bg-white pt-2 h-100">
      <div className="d-flex justify-content-between px-3 flex-wrap">
        <div className="d-flex align-items-center my-3">
          <img src={assets["bank.svg"].default} className="me-2" />
          <h3 className="text-nowrapd m-0">Total Balance: $0,00 USD</h3>
          <img src={assets["info_circle.svg"].default} className="ms-2" />
        </div>
        {/* <div className="mx-auto me-md-1">
          <button className="btn rounded-circle bg-light mx-1">&lt;</button>
          <button className="btn rounded-circle bg-light mx-1">&gt;</button>
        </div> */}
      </div>
      <div className="d-flex overflow-auto custom-scroll">
        <EachCurrencies />
        <EachCurrencies />
        <EachCurrencies />
        <EachCurrencies />
        <EachCurrencies />
        <EachCurrencies />
      </div>
      <p className="px-3 my-3">
        <span className="fw-normal">
          You will be able to create accounts in 6 currencies after
        </span>
        <a href="#" className="blue100 fw-regular ms-0 mr-2">
          Activating Your Account
        </a>
        .
      </p>
    </div>
  );
}

export default Currencies;
