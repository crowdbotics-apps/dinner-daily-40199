import React, { useEffect, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import TextInput from "../../customComponents/TextInput";
import ErrorMessage from "../../customComponents/ErrorMessage";
import Loader from "../../customComponents/Spinner";
import "./style.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { request } from "../../api/request";
import EndPoints from "../../api/endPoints";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorMsg from "../../customComponents/ErrorMsg";
import SuccessMsg from "../../customComponents/SuccessMessage";

const EnterEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);
    const [userState, setUserState] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const { handleSubmit, handleChange, values, touched, errors } = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema: yup.object().shape({
            email: yup.string().required("Email is required"),
        }),

        onSubmit: async () => {
            setError(undefined);
            resetPasswordHandler(values.email);
        },
    });

    const resetPasswordHandler = async (email) => {
        console.log(email);
        setLoading(true);
        request(EndPoints.forgotPassword, "POST", { email }, undefined, {
            secretId: userState,
        })
            .then((res) => {
                setLoading(false);
                setSuccess(
                    "Reset Password Link has been sent to your email ID"
                );
            })
            .catch((err) => {
                setLoading(false);
                setError("Something went wrong");
            });
    };

    return (
        <div className="container">
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
                    src="https://app.thedinnerdaily.com/images/manifest/icon-144x144.png"
                />

                <Card.Title>Reset Password</Card.Title>
                <Card.Subtitle>
                    Type in your email address with what you are signed up for
                    our services. We will send you a reset link to your email.
                </Card.Subtitle>
                <Card.Body>
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label={"Email"}
                            onFocus={() => setError(undefined)}
                            onChange={handleChange}
                            name={"email"}
                            type={"email"}
                        />
                        <ErrorMessage
                            errormsg={errors?.email}
                            touchedmsg={touched?.email}
                        />

                        {loading && <Loader loadingMsg={"loading..."} />}
                        <Button
                            type="submit"
                            style={{
                                backgroundColor: "#F2786C",
                                borderWidth: 0,
                            }}
                            variant="primary"
                        >
                            Send Reset Password Link
                        </Button>
                        {error && <ErrorMsg errormsg={error} />}
                        {success && <SuccessMsg successmsg={success} />}
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default EnterEmail;
