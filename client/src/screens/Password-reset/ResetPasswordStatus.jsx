import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import "./style.scss";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

const data = {
    200: {
        title: "Password Changed!",
        subtitle: "Your password has been changed successfully.",
        icon: "data:image/svg+xml;charset=utf-8,%3Csvg width='84' height='84' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%231BC462' stroke-width='3' fill='none' fill-rule='evenodd'%3E%3Ccircle cx='42' cy='42' r='40.5'/%3E%3Cpath d='M27 48.429L39.857 57 57 27'/%3E%3C/g%3E%3C/svg%3E",
    },
    400: {
        title: "Link Expired",
        subtitle: `This link has been expired. To reset your password, go to the app's login page and select "Forgot Your Password" to send a new email.`,
        icon: "data:image/svg+xml;charset=utf-8,%3Csvg width='84' height='84' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle stroke='%23E55E3F' stroke-width='3' cx='42' cy='42' r='40.5'/%3E%3Cpath d='M42 39.879l12.94-12.94 2.12 2.122L44.122 42l12.94 12.94-2.122 2.12L42 44.122l-12.94 12.94-2.12-2.122L39.878 42l-12.94-12.94 2.122-2.12L42 39.878z' fill='%23E55E3F' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E",
    },
    404: {
        title: "Invalid Link",
        subtitle:
            'This link has already been used or invalid. To reset your password, go to the app login page and select "Forgot Your Password" to send a new email.',
        icon: "data:image/svg+xml;charset=utf-8,%3Csvg width='84' height='84' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle stroke='%23E55E3F' stroke-width='3' cx='42' cy='42' r='40.5'/%3E%3Cpath d='M42 39.879l12.94-12.94 2.12 2.122L44.122 42l12.94 12.94-2.122 2.12L42 44.122l-12.94 12.94-2.12-2.122L39.878 42l-12.94-12.94 2.122-2.12L42 39.878z' fill='%23E55E3F' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E",
    },
};

const ForgotPasswordStatus = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [status, setStatus] = useState(undefined);
    const [isWeb, setIsWeb] = useState(undefined);
    const navigate = useNavigate();

    //add location as dependency
    useEffect(() => {
        const currentStatus = location.state.status;
        setIsWeb(location.state.web ?? false);
        setStatus(data[currentStatus]);
    }, []);

    const webUrlHandler = () => {
        if (isWeb == 'true') {
            navigate('/');
        } else {
            window.location.open('example://www.myapp.com/anystring');
        }
    }
    return (
        <div className="container">
            {status && (
                <Card
                    className="card"
                    style={{
                        width: "25rem",
                        padding: "20px",
                        alignSelf: "center",
                        borderWidth: 0,
                    }}
                >
                    <Card.Img
                        style={{ width: "5rem", alignSelf: "center" }}
                        variant="top"
                        src={status.icon}
                    />
                    <Card.Body>
                        <Card.Title>{status.title}</Card.Title>
                        <Card.Subtitle>{status.subtitle}</Card.Subtitle>
                        <Card.Body></Card.Body>
                        <Button
                            onClick={webUrlHandler}
                            style={{
                                backgroundColor: "#F2786C",
                                borderWidth: 0,
                            }}
                            variant="primary"
                        >
                            Back to The Dinner Daily App
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ForgotPasswordStatus;
