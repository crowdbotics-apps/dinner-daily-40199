import React from "react"
import { Button, Col, Row } from "react-bootstrap"
import svg from "../../assets/images/svg/index"

const FeedbackBox = () => {
  return (
    <div className="FeedbackBox">
      <img src={svg?.feedbackusers} className="user-img" alt="user-img Np" />
      <div className="user-body">
        <div className="user-heading">Feedback</div>
        <div className="user-count">Total feedbacks received: 7047</div>
        <div className="user-listing">
          <div className="listing-box">
            <div className="left-part">Open</div>
            <div className="right-part">4234</div>
          </div>

          <div className="listing-box">
            <div className="left-part">Resolved</div>
            <div className="right-part">234</div>
          </div>

          <Button className="rounded-pill view-btn">View All</Button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackBox
