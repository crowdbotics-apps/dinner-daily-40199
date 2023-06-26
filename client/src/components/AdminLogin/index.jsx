import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import "./adminlogin.scss";
import svg from "../../assets/images/svg/index";
import Loader from "../../customComponents/Spinner";
import ErrorMessage from "../../customComponents/ErrorMessage";
import ErrorMsg from "../../customComponents/ErrorMsg";
import TextInput from "../../customComponents/TextInput";
import { loginSchema } from "../../utils/validations";
import roles from "../../utils/Roles";
import { login } from "../../api/request";

const AdminSignin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState({ show: false, message: "" });
    const [loading, setLoading] = useState(false);
    const rolesArray = roles.map((role) => role.id);

    useEffect(() => {
        if (error.show) {
            setTimeout(() => {
                setError({ show: false, message: "" });
            }, 5000);
        }
    }, [error.show]);

    const {
        resetForm,
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
    } = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async () => {
            setLoading(true);
            const loginbody = {
                email: values?.username,
                password: values?.password,
            };
            let resp = await login(loginbody);
            if (resp?.status) {
                if (rolesArray.includes(`${resp?.data?.roles}`)) {
                    if (resp?.data?.token !== undefined) {
                        localStorage.setItem(
                            "user",
                            JSON.stringify(resp?.data)
                        );
                        navigate("/dashboard");
                        resetForm();
                    }
                } else {
                    setError({
                        show: true,
                        message: "Your are not authorized to access",
                    });
                    resetForm();
                }
            } else {
                setError({ show: true, message: resp.message });
                resetForm();
            }
            setLoading(false);
        },
    });

    return (
        <div className="admin-login">
            <div className="admin-form-wrapper">
                <img src={svg?.logo} alt="logo np" className="admin-logo" />
                <Row className="login-img">
                    <img
                        src={svg?.adminloginimg}
                        className="login-img"
                        alt="login img Np "
                    />
                </Row>
                <Row className="admin-lower-row d-flex flex-row">
                    <Col className="left-col">
                        <div className="left-first-heading">Welcome Admin</div>
                        <div className="left-sec-heading">
                            The Dinner Daily Dashboard
                        </div>
                        <div className="left-body">
                            Dear Admin, welcome to your all New Dashboard and
                            Portal. You can use this space to tackle your
                            objectives of Managing Internal Users, Customer,
                            Notification, Database and other such categories. We
                            hope you enjoy this new experience!
                        </div>
                    </Col>
                    <Col className="right-col">
                        <div className="right-col-heading">Log in</div>
                        {loading && <Loader loadingMsg="loading..." />}
                        <form onSubmit={handleSubmit} className="w-100">
                            <div
                                className={
                                    errors.username &&
                                    touched.username &&
                                    errors.username
                                        ? "emailredborder inputdiv"
                                        : "inputdiv"
                                }
                            >
                                <span className="text-label">Email</span>
                                <TextInput
                                    label={"Email ID *"}
                                    name={"username"}
                                    type={"email"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    className={`mt-2 form-control ${
                                        touched &&
                                        touched[values?.username] &&
                                        errors[values?.username]
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                />
                                <ErrorMessage
                                    errormsg={errors?.username}
                                    touchedmsg={touched?.username}
                                />
                            </div>

                            <div
                                className={
                                    errors.password &&
                                    touched.password &&
                                    errors.password
                                        ? "emailredborder inputdiv"
                                        : "inputdiv"
                                }
                            >
                                <span className="text-label">Password</span>
                                <TextInput
                                    label={"Password *"}
                                    name={"password"}
                                    type={"password"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={`mt-2 form-control ${
                                        touched &&
                                        touched?.password &&
                                        errors?.password
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                />
                                <ErrorMessage
                                    errormsg={errors?.password}
                                    touchedmsg={touched?.password}
                                />
                            </div>

                            <div className="forgot-password d-flex">
                                <img
                                    src={svg?.forgotpassword}
                                    className="forgotpassword-img"
                                    alt="forgotpassword img np"
                                />
                                <Link to={"/auth/forgot-password"}>
                                    <span className="forgotpassword-txt">
                                        I forgot my password
                                    </span>
                                </Link>
                            </div>
                            <Button
                                variant=""
                                className="w-100 rounded-pill login-btn"
                                type="submit"
                            >
                                {loading ? "Please wait..." : "Log In"}
                            </Button>
                        </form>
                        {error.show && <ErrorMsg errormsg={error.message} />}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AdminSignin;
