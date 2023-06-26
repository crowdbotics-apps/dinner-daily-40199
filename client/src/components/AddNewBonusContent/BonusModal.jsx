import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TextInput from "../../customComponents/TextInput";
import { useFormik } from "formik";
import ErrorMsg from "../../customComponents/ErrorMsg";
import ErrorMessage from "../../customComponents/ErrorMessage";
import "./styles.scss";
import { request } from "../../api/request";
import EndPoints from "../../api/endPoints";
import * as yup from "yup";

const BonusModal = (props) => {
    const [showSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

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
            category: "",
        },
        validationSchema: yup.object().shape({
            category: yup.string().required("Category cannot be empty"),
        }),
        onSubmit: async () => {
            console.log(values);
            setIsLoading(true);
            const addCategoryBody = {
                title: values?.category,
            };
            request(EndPoints.bonusContent, "POST", addCategoryBody, true)
                .then((res) => {
                    setIsLoading(false);
                    props.setter(false);
                    console.log("add category");
                    request(EndPoints.adminBonusContent, "GET").then((res) => {
                        console.log(res.data);
                        props.addBonusContentData(res.data);
                    });
                })
                .catch((err) => {
                    setIsLoading(false);
                    props.setter(false);
                    console.log(err);
                    setError(err.message);
                });
        },
    });

    return (
        <div className="AddNewBonusContent-wrapper">
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                className="add-bonus-modal"
                show={props.isVisible}
                onHide={() => props.setter(false)}
                centered
            >
                <Modal.Header className="heading border-bottom-0 p-0">
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body className=" p-0 pt-2">
                    <form onSubmit={handleSubmit} className="w-100">
                        <div
                            className={
                                errors.username &&
                                touched.username &&
                                errors.username
                                    ? "emailredborder"
                                    : ""
                            }
                        >
                            <span className="input-label">Category Title</span>
                            <TextInput
                                label={"Sample Category Name Here"}
                                name="category"
                                type="text"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.category}
                                className={`mt-2 form-control ${
                                    touched &&
                                    touched[values?.category] &&
                                    errors[values?.category]
                                        ? "is-invalid"
                                        : ""
                                }`}
                            />
                            <ErrorMessage
                                errormsg={errors?.category}
                                touchedmsg={touched?.category}
                            />
                        </div>

                        <div className="btn-wrapper">
                            <Button
                                className="cancel-btn w-25 me-2"
                                variant="outline-primary rounded-pill"
                                onClick={() => props.setter(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="save-btn w-25"
                                variant="primary rounded-pill"
                                type="submit"
                                disabled={isLoading}
                            >
                                Add
                            </Button>
                        </div>
                    </form>

                    <>
                        {error === true && (
                            <ErrorMsg errormsg={"Error in adding root"} />
                        )}
                        {showSuccess === true && (
                            <span className="rstPassSuccessMsg text-center font-medium-20 mt-3 d-flex justify-content-center align-items-center">
                                Category has been added successfully
                            </span>
                        )}
                    </>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default BonusModal;
