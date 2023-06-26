import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import svg from "../../assets/images/svg/index";
import { useNavigate } from "react-router-dom";
import { request } from "../../api/request";
import EndPoints from "../../api/endPoints";

const NotificationsBox = () => {
    const [count, setCount] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        request(EndPoints.notification, "GET", undefined, true, {
            count: true,
        })
            .then((res) => {
                setCount(res.data.total);
                console.log(res);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="NotificationsBox">
            <img
                src={svg?.notificationsusers}
                className="user-img"
                alt="user-img Np"
            />
            <div className="user-body">
                <div className="user-heading">Notification</div>
                <div className="user-count">{`Existing notification: ${
                    count ?? 0
                }`}</div>
                <div className="user-listing">
                    <Button
                        onClick={() => navigate("/notifications")}
                        className="rounded-pill view-btn"
                    >
                        View All
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotificationsBox;
