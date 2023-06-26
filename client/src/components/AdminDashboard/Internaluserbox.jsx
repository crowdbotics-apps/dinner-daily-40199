import React, { useEffect, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import roles from "../../utils/Roles"
import svg from "../../assets/images/svg/index"
import { formatRole } from "../../utils/helpers"

const Internaluserbox = (props) => {
  const [total,setTotal] =  useState(0);
  const [allInternal,setAllInternal] = useState([]);
  useEffect(()=>{
    if(props?.internal){ 
      const interNal = props?.internal.filter(item=> item.roles !== "USER");
      setTotal(interNal?.reduce((a,b)=> a+ b?.adminUser,0))
      setAllInternal(interNal)
    }
  },[props.internal])
  return (
    <div className="Internaluserbox">
      <img src={svg?.user} className="user-img" alt="user-img Np" />
      <div className="user-body">
        <div className="user-heading">Internal User</div>
        <div className="user-count">Total user: {total}</div>
        <div className="user-listing">
          {allInternal?.map((item,index)=>
            <div className="listing-box" key={index+1}>
            <div className="left-part">{formatRole(item?.roles)}</div>
            <div className="right-part">{item?.adminUser}</div>
            </div>
          )}
          {/* <Button className="rounded-pill view-btn">View All</Button> */}
        </div>
      </div>
    </div>
  )
}

export default Internaluserbox
