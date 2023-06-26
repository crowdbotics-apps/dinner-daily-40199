import React, {useState, useEffect} from "react"
import { Button, Col, Row } from "react-bootstrap"
import svg from "../../assets/images/svg/index"

const Subscribedusersbox = (props) => {
  const [inactiveUsers,setInactiveUsers] =  useState(0);
  const [activeUsers,setActiveUsers] = useState(0)
  useEffect(()=>{
    if(props?.subscribe){ 
      const subscribe = props?.subscribe.find(item=> item.roles === "USER");
      setInactiveUsers(subscribe?.inactiveUser);
      setActiveUsers(subscribe?.activeUser);
    }
  },[props.subscribe])

  return (
    <div className="Subscribedusersbox">
      <img src={svg?.subscribedusers} className="user-img" alt="user-img Np" />
      <div className="user-body">
        <div className="user-heading">Subscribed Users</div>
        <div className="user-count">Total subscribed user: {activeUsers+inactiveUsers}</div>
        <div className="user-listing">
          <div className="listing-box">
            <div className="left-part">Active</div>
            <div className="right-part">{activeUsers}</div>
          </div>
          <div className="listing-box">
            <div className="left-part">Cancelled</div>
            <div className="right-part">{inactiveUsers}</div>
          </div>
          {/* <Button className="rounded-pill view-btn">View All</Button> */}
        </div>
      </div>
    </div>
  )
}

export default Subscribedusersbox
