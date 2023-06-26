import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import svg from "../../../assets/images/svg/index";
import { useFormik } from "formik";
import ErrorMsg from "../../../customComponents/ErrorMsg";
import * as yup from "yup";
import ErrorMessage from "../../../customComponents/ErrorMessage";
import { isValidFileType } from "../../../utils/yupFileValidation";
import EndPoints from "../../../api/endPoints";
import { MultipartRequest, request } from "../../../api/request";
import "./styles.scss";

const UploadSpecial = (props) => {
    const [showAddSuccess, setshowAddSuccess] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [getError, setError] = useState(false);

    const uploadSpecial = (body) => {
        console.log(body);
        setisLoading(true);
        const endPoint = EndPoints.uploadSpecial;
        MultipartRequest(endPoint, "POST", body)
            .then((res) => {
                setisLoading(false);
                setshowAddSuccess(true);
                setTimeout(() => {
                    props?.onHide(res.data);
                }, 2000);
            })
            .catch((err) => {
                setisLoading(false);
                setError(true);
                console.log(err);
            });
    };

    const {
        resetForm,
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        touched,
        errors,
        isSubmitting,
    } = useFormik({
        initialValues: {
            excel: "",
        },
        validationSchema: yup.object().shape({
            excel: yup
                .mixed()
                .required("Excel file is required")
                .test("is-valid-type", "Not a valid file type", (value) =>
                    isValidFileType(value && value.name.toLowerCase(), "excel")
                ),
        }),
        onSubmit: async () => {
            uploadSpecial({
                content: values?.excel,
            });
        },
    });
    return (
        <div className="UploadSpecial-wrapper">
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                className="add-new-modal root-modal upload-special-modal"
                centered
            >
                <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
                    Upload Special
                </Modal.Header>
                <Modal.Body className="change-password-body p-0 pt-2  text-center">
                    <form onSubmit={handleSubmit} className="w-100">
                        <div className="image-upload">
                            <div className="upload-imagewrapper d-flex">
                                <img
                                    src={svg?.uploadexcel}
                                    className="upload-image-img"
                                    alt="upload-imageNP"
                                />
                                <span className="upload-txt">
                                    {values.excel
                                        ? values.excel.name
                                        : "Upload an excel"}
                                </span>
                            </div>
                            <label className="upload-image-label">
                                <img
                                    src={svg?.uploadicon}
                                    className="upload-image-img"
                                    alt="upload-imageNP"
                                />
                                <input
                                    id="excel"
                                    name="excel"
                                    type="file"
                                    onChange={(event) => {
                                        setFieldValue(
                                            "excel",
                                            event.currentTarget.files[0]
                                        );
                                    }}
                                />
                            </label>
                        </div>
                        {touched.excel && errors.excel && (
                            <span className="error">{errors.excel}</span>
                        )}

                        <div className="btn-wrapper mt-3">
                            <Button
                                className="cancel-btn w-25"
                                variant="outline-primary rounded-pill"
                                onClick={() => props?.onHide()}
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
                                Update
                            </Button>
                        </div>
                    </form>

                    <>
                        {getError === true && (
                            <ErrorMsg errormsg={"Error in uploading"} />
                        )}
                        {showAddSuccess === true && (
                            <span className="rstPassSuccessMsg text-center font-medium-20 mt-3 d-flex justify-content-center align-items-center">
                                Special has been uploaded successfully
                            </span>
                        )}
                    </>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UploadSpecial;
