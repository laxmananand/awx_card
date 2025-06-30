import React from 'react'
import EachCard from '../structure/EachCard'
import BreadCrumbs from '../structure/BreadCrumbs'

function Settings() {
  const data = [{
    id: 1,
    color: "blue",
    title: "Team Members",
    subtitle: "Move funds across your currency accounts to facilitate payments in your desired currency.",
    img: "/settings/security.svg",
    url:"/access-control/team-members"
  }, {
    id: 2,
    color: "green",
    title: "Roles & Permissions",
    subtitle: "Move funds across your currency accounts to facilitate payments in your desired currency.",
    img: "/settings/branding.svg",
    url:"/access-control/roles-permissions"
  }
  // , {
  //   id: 3,
  //   color: "yellow",
  //   title: "Subscription",
  //   subtitle: "Move funds across your currency accounts to facilitate payments in your desired currency.",
  //   img: "/settings/subscription.svg",
  //   url:"/settings/subscription"
  // }
]
  return (
    <>
      <BreadCrumbs data={{name:"User Access", img:"/accounts/accounts.svg", backurl:"/"}} />

      <div className='row'>
        {data.map((eachData) => (
          <EachCard key={eachData.id} data={eachData} />
        ))}
      </div>
    </>

  )
}

export default Settings