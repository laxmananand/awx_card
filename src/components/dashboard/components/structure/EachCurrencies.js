import React, { useState, useEffect } from "react";
import AddNewAccountModal from "./AddNewAccountModal";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}
function EachCurrencies({ isActivated }) {
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    // Use require.context to get all files from the directory
    const requireContext = require.context(
      "../../assets/",
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
    <div className="col-12 col-sm-6 col-md-4 d-inline-block p-3">
      <div className="p-3 border rounded h-100">
        <div className="d-flex">
          <img src={assets["flag.svg"].default} />
          {isActivated ? (
            <>
              <a
                className={"d-inline-block my-auto ms-auto"}
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={assets["threeDotsH.svg"].default} />
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Conversion
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Statements
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Delete
                  </a>
                </li>
              </ul>
            </>
          ) : (
            ""
          )}
        </div>

        <h6 className="mt-5">Euro Euro</h6>
        {isActivated ? (
          <>
            <p className="grey1 fw-normal">
              Bank Universal
              <br />
              BIC 375950336937654547
            </p>
          </>
        ) : (
          <AddNewAccountModal />
        )}
      </div>
    </div>
  );
}

export default EachCurrencies;
