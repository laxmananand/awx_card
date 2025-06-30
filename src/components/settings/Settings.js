import React from "react";
import EachCard from "../structure/EachCard";
import BreadCrumbs from "../structure/BreadCrumbs";

function Settings() {
  const data = [
    {
      id: 1,
      color: "blue",
      title: "Security",
      subtitle:
        "Elevate your account security to shield your data from cyber threats and ensure peace of mind.",
      img: "/accounts/security.svg",
      url: "/settings/security",
    },
    {
      id: 2,
      color: "green",
      title: "Branding",
      subtitle:
        "Personalize your platform with unique branding elements that resonate with your style and story.",
      img: "/accounts/branding.svg",
      url: "/settings/branding",
    },
    // {
    //   id: 3,
    //   color: "yellow",
    //   title: "Subscription",
    //   subtitle: "Elevate your experience with our subscription plans, offering exclusive features and benefits.",
    //   img: "/accounts/subscription.svg",
    //   url: "/settings/subscription",
    // },
  ];
  return (
    <>
      <BreadCrumbs
        data={{
          name: "Settings",
          img: "/accounts/accounts.svg",
          backurl: "/dashboard",
        }}
      />

      <div className="row">
        {data.map((eachData) => (
          <EachCard key={eachData.id} data={eachData} />
        ))}
      </div>
    </>
  );
}

export default Settings;
