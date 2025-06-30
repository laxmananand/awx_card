import React, { useState } from 'react'
import SideBar from '../../../SideBar'
import BreadCrumbs from '../../../structure/BreadCrumbs'
import CompareAllPlans from '../../../Signup/pages/CompareAllPlans'


function CompareAllPlansSub() {
    return (
        <div>
            <div className='d-flex'>
                <SideBar />
                <div className="container-fluid px-0 bg-light clear-left overflow-auto" style={{ height: "100vh" }}>
                    <BreadCrumbs data={{ name: "Compare Plans", img: "/arrows/arrowLeft.svg", backurl: "/settings/subscription" }} />
                    <CompareAllPlans hideButton={true}  />
                </div>
            </div>
        </div>
    )
}

export default CompareAllPlansSub