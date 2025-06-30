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

function CurrencyGraph() {
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
    <div className="mx-3 row border p-3 bg-white">
      <div className="col-6 h3">1 GBP = 1,27830 USD</div>
      <button className="col-4 btn btn-outline-white border my-auto mx-auto grey1 rounded-3 py-3">
        <b>Select Currency</b>
      </button>
      <p className="h5">Today</p>
      <div className="row grey1 fw-normal">
        <img
          src={assets["graph.svg"].default}
          className="d-inline-block col-9"
        />
        <p className="text-center col-3 my-3">
          1,313
          <br />
          <br />
          1,291
          <br />
          <br />
          1,269
        </p>
      </div>
      <div className="d-flex justify-content-between grey1 fw-normal">
        <p className="col-9">Month ago</p>
        <p className="text-center col-3">Today</p>
      </div>
    </div>
  );
}

export default CurrencyGraph;
