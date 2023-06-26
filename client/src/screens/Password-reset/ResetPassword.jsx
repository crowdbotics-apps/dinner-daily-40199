import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
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

const ForgotPasssword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(undefined);
    const [success] = useState(undefined);
    const [userState, setUserState] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const { handleSubmit, handleChange, values, touched, errors } = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema: yup.object().shape({
            password: yup
                .string()
                .required("Password is required")
                .min(8, "Password is too short - should be 8 chars minimum."),
            confirmPassword: yup
                .string()
                .required("Confirm password is required")
                .oneOf([yup.ref("password"), null], "Passwords must match"),
        }),

        onSubmit: async () => {
            setError(undefined);
            resetPasswordHandler(values.password, values.confirmPassword);
        },
    });

    const resetPasswordHandler = async (password, confirmPassword) => {
        console.log(password, confirmPassword, userState);
        setLoading(true);
        request(
            EndPoints.resetPassword,
            "POST",
            { newPassword: password, confirmPassword },
            undefined,
            { secretId: userState }
        )
            .then((res) => {
                setLoading(false);
                navigate(`/auth/reset-password/state`, {
                    state: { status: res.code },
                });
            })
            .catch((err) => {
                setLoading(false);
                setError("Something went wrong");
            });
    };

    useEffect(() => {
        const userState = searchParams.get("secretId");
        if (!userState) {
            navigate("/404");
        }
        setUserState(userState);
    });

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

                <Card.Title>Reset Your Password</Card.Title>
                <Card.Subtitle>
                    Enter a new password below to change your password.
                </Card.Subtitle>
                <Card.Body>
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label={"New Password"}
                            onFocus={() => setError(undefined)}
                            onChange={handleChange}
                            name={"password"}
                            type={"password"}
                        />
                        <ErrorMessage
                            errormsg={errors?.password}
                            touchedmsg={touched?.password}
                        />
                        <TextInput
                            label={"Re-enter New Password"}
                            onChange={handleChange}
                            onFocus={() => setError(undefined)}
                            name={"confirmPassword"}
                            type={"password"}
                        />
                        <ErrorMessage
                            errormsg={errors?.confirmPassword}
                            touchedmsg={touched?.confirmPassword}
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
                            Reset Password
                        </Button>
                        {error && <ErrorMsg errormsg={error} />}
                        {success && <SuccessMsg successmsg={success} />}
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ForgotPasssword;
