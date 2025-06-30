import React from "react";
import { Link } from "react-router-dom";

function EachCard({ data }) {
  return (
    <div className="col-12 col-md-6 col-lg-4 p-4 align-self-stretch">
      <div className="border p-5 position-relative bg-white h-100 d-flex flex-column rounded-5 shadow">
        <div>
          <img src={data.img} className={"p-3 rounded-4 bg-light-primary"} />
        </div>
        <h5 className="my-3">{data.title}</h5>
        <p className="grey1 flex-fill">{data.subtitle}</p>
        <Link to={data.url} className={"mt-3 border btn w-100 fw-500 btn border py-3 btn-action text-black rounded-pill border-0"}>
          Open
        </Link>
      </div>
    </div>
  );
}

export default EachCard;
