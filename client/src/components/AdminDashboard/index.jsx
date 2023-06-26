import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Internaluserbox from "./Internaluserbox.jsx";
import Subscribedusersbox from "./Subscribedusersbox.jsx";
import NotificationsBox from "./NotificationsBox.jsx";
import FeedbackBox from "./FeedbackBox.jsx";
import "./admindashboard.scss";
import { adminDashboard } from "../../api/request.js";

const Admindashboard = () => {
    const [dashboardData, setDashBoardData] = useState([]);

    useEffect(() => {
        async function getDashBoardData() {
            let resp = await adminDashboard();
            if (resp?.status) {
                setDashBoardData(resp?.data);
            }
        }
        getDashBoardData();
    }, []);

    return (
        <div className="admin-dashboard">
            <Row className="admin-dashboard-row">
                <Col className="internal-users-col dashboard-col">
                    <Internaluserbox internal={dashboardData} />
                </Col>
                <Col className="subscribed-users-col dashboard-col">
                    <Subscribedusersbox subscribe={dashboardData} />
                </Col>

                <Col className="notification-col dashboard-col">
                    <NotificationsBox />
                </Col>
                {/* 
        <Col className="feedback-col dashboard-col">
          <FeedbackBox />
        </Col> */}
            </Row>
        </div>
    );
};

export default Admindashboard;
