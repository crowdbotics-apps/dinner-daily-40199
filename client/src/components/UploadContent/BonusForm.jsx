import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import ErrorMessage from "../../customComponents/ErrorMessage";
import svg from "../../assets/images/svg/index";
import "./styles.scss";
import * as yup from "yup";
import { isValidFileType } from "../../utils/yupFileValidation";
import Loader from "../../customComponents/Spinner";

const BonusForm = ({ updateBonusContent, bonusData, loading }) => {
    const [editingEnabled, setEditingEnable] = useState(false);

    const {
        resetForm,
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        setFieldValue,
        setValues,
    } = useFormik({
        initialValues: { content: "", icon: "", pdf: "" },
        validationSchema: yup.object().shape({
            icon: yup
                .mixed()
                .required("Icon cannot be empty")
                .test("is-valid-type", "Not a valid file type", (value) =>
                    isValidFileType(
                        value &&
                            (value.name
                                ? value.name.toLowerCase()
                                : value.name),
                        "image"
                    )
                ),
            pdf: yup
                .mixed()
                .required("Content cannot be empty")
                .test("is-valid-type", "Not a valid file type", (value) => {
                    console.log(value);
                    return isValidFileType(
                        value &&
                            (value.name
                                ? value.name.toLowerCase()
                                : value.name),
                        "pdf"
                    );
                }),
            content: yup.string().required("Button Title cannot be empty"),
        }),

        onSubmit: async () => {
            const formData = {
                icon: values?.icon,
                button_title: values?.content,
                content: values?.pdf,
            };

            updateBonusContent(formData);
        },
    });

    useEffect(() => {
        console.log(bonusData);
        setEditingEnable(false);
        resetForm();
        if (bonusData) {
            setValues({
                content: bonusData.button_title,
                icon: bonusData.icon ? { name: bonusData.icon } : undefined,
                pdf: bonusData.content
                    ? { name: bonusData.content }
                    : undefined,
            });
        }
    }, [bonusData]);

    return (
        <div className="DinnerPartyPlans-Wrapper col-8">
            <div className="edit-card-heading-div d-flex justify-content-between align-items-center mb-4 w-75">
                <span className="edit-card-heading-txt">Details</span>
                {!editingEnabled && (
                    <img
                        src={svg?.edit}
                        className="edit-icon"
                        alt="edit icon NP"
                        onClick={() => setEditingEnable(true)}
                    />
                )}
            </div>
            <form onSubmit={handleSubmit} className="w-75">
                <div className="image-upload">
                    <div className="upload-imagewrapper d-flex">
                        <img
                            src={svg?.uploadimage}
                            className="upload-image-img"
                            alt="upload-imageNP"
                        />
                        <span className="upload-txt">
                            {values.icon ? values.icon.name : "Upload Icon"}
                        </span>
                    </div>
                    <label className="upload-image-label">
                        <img
                            src={svg?.uploadicon}
                            className="upload-image-img"
                            alt="upload-imageNP"
                        />

                        <input
                            id="icon"
                            name="icon"
                            type="file"
                            onChange={(event) => {
                                setFieldValue(
                                    "icon",
                                    event.currentTarget.files[0]
                                );
                            }}
                        />
                    </label>
                </div>
                <ErrorMessage
                    errormsg={errors?.icon}
                    touchedmsg={touched?.icon}
                />

                <span className="image-upload-info mb-3 mt-2">
                    Image should be a png/svg and no more than 48x48 pixels
                </span>

                <div
                    className={
                        errors.icon && touched.icon && errors.icon
                            ? "emailredborder inputdiv"
                            : "inputdiv"
                    }
                >
                    <span className="text-label">Content</span>
                    <textarea
                        placeholder={"Content"}
                        name="content"
                        rows={3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                        className={`mt-2 form-control ${
                            touched &&
                            touched[values?.content] &&
                            errors[values?.content]
                                ? "is-invalid"
                                : ""
                        }`}
                        disabled={!editingEnabled}
                    />
                    <ErrorMessage
                        errormsg={errors?.content}
                        touchedmsg={touched?.content}
                    />
                </div>

                <div className="image-upload mt-5">
                    <div className="upload-imagewrapper d-flex">
                        <img
                            src={svg?.uploadpdf}
                            className="upload-image-img"
                            alt="upload-imageNP"
                        />
                        <span className="upload-txt">
                            {values.pdf ? values.pdf.name : "Upload Pdf"}
                        </span>
                    </div>
                    <label className="upload-image-label">
                        <img
                            src={svg?.uploadicon}
                            className="upload-image-img"
                            alt="upload-imageNP"
                        />
                        <input
                            id="pdf"
                            name="pdf"
                            type="file"
                            onChange={(event) => {
                                setFieldValue(
                                    "pdf",
                                    event.currentTarget.files[0]
                                );
                            }}
                        />
                    </label>
                </div>
                <ErrorMessage
                    errormsg={errors?.pdf}
                    touchedmsg={touched?.pdf}
                />

                {loading && <Loader loadingMsg={"loading..."} />}

                <>
                    {editingEnabled === true && (
                        <div className="edit-btns pt-3">
                            <Button
                                variant=""
                                className="w-50 rounded-pill cancel-btn"
                                type="reset"
                                onClick={() => setEditingEnable(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant=""
                                className="w-50 rounded-pill save-btn"
                                type="submit"
                            >
                                Post
                            </Button>
                        </div>
                    )}
                </>
            </form>
        </div>
    );
};

export default BonusForm;
