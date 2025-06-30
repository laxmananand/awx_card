import React, { useEffect } from "react";
import { useState } from "react";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}

function Navbar() {
  const [isActivated, setIsActivated] = useState(false);
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
    <nav className="navbar navbar-expand-lg navbar-light border-bottom shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Hello, Daniel!
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <form className="d-flex col-lg-6 bg-light border rounded-3 mx-2 my-2 my-lg-0">
            <button className="btn" type="submit">
              <img src={assets["search.svg"].default} />
            </button>
            <input
              className="form-control border-0 bg-light"
              type="search"
              placeholder="What do you want to find?"
              aria-label="Search"
            />
          </form>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item dropdown mx-2 my-2 my-lg-0">
              <button
                className={
                  isActivated
                    ? "dropdown-toggle btn bg-green h-100"
                    : "btn bg-green grey h-100 w-100 "
                }
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                disabled={!isActivated}
              >
                <img src={assets["plus.svg"].default} className="me-1" />
                Create New
                {!isActivated && (
                  <img src={assets["lock.svg"].default} className="ms-1" />
                )}
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item mx-2 my-2 my-lg-0">
              <a
                className="nav-link border d-flex justify-content-center align-items-center"
                href="#"
              >
                <img src={assets["chat.svg"].default} />
                <p className="m-0 ms-2 d-lg-none">Chat</p>
              </a>
            </li>
            <li className="nav-item mx-2 my-2 my-lg-0">
              <a
                className="nav-link border d-flex justify-content-center align-items-center"
                href="#"
              >
                <img src={assets["notification.svg"].default} />
                <p className="m-0 ms-2 d-lg-none">Notifications</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
