import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}

function AddNewAccountModal() {
  const [assets, setAssets] = useState(null);

  const options = [
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry", label: "Strawberry" },
    { value: "caramel", label: "Caramel" },
    { value: "mint", label: "Mint" },
    { value: "blueberry", label: "Blueberry" },
    { value: "raspberry", label: "Raspberry" },
    { value: "hazelnut", label: "Hazelnut" },
    { value: "peanut_butter", label: "Peanut Butter" },
    { value: "coconut", label: "Coconut" },
    { value: "lemon", label: "Lemon" },
    { value: "coffee", label: "Coffee" },
    { value: "pistachio", label: "Pistachio" },
    { value: "banana", label: "Banana" },
    { value: "butterscotch", label: "Butterscotch" },
    { value: "cherry", label: "Cherry" },
    { value: "almond", label: "Almond" },
    { value: "cinnamon", label: "Cinnamon" },
    { value: "honey", label: "Honey" },
    { value: "orange", label: "Orange" },
    { value: "maple", label: "Maple" },
  ];

  const [val, setVal] = useState();

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
  }, [val]);

  if (!assets) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn bg-white border w-100 blue100 d-flex align-items-center justify-content-center py-3"
        data-bs-toggle="modal"
        data-bs-target="#AddNewAccountModal"
      >
        <img src={assets["plus_1.svg"].default} />
        <span className="mx-2">Get Bank Account</span>
        <img src={assets["lock_2.svg"].default} />
      </button>
      {/* Modal */}
      <div
        className="modal fade"
        id="AddNewAccountModal"
        tabIndex={-1}
        aria-labelledby="AddNewAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-5 text-center position-relative">
            <button
              type="button"
              className="btn-close position-absolute end-0 top-0 m-4"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
            <img
              src={assets["flag.svg"].default}
              width={50}
              className="mx-auto"
            />
            <p className="fw-normal my-2">GBP, British Pound Sterling</p>
            <h6 className="my-4">Get Bank Account</h6>
            <div className="d-flex border-bottom mb-4">
              <div className="d-flex">
                <img
                  src={assets["bank_outline.svg"].default}
                  width={40}
                  className="border-end my-auto px-2"
                />
              </div>
              <div className="input-group containertext w-100 h-100">
                <CustomSelect options={options} setValue={setVal} />
              </div>
            </div>

            <button className="btn bg-blue100 text-white py-3">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewAccountModal;
