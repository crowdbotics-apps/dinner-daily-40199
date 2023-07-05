import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import ErrorMessage from "../../customComponents/ErrorMessage";
import TextInput from "../../customComponents/TextInput";
import svg from "../../assets/images/svg/index";
import "./styles.scss";
import { uploadContentSchema } from "../../utils/uploadContentValidation";
import { uploadContentInitailValue } from "../../utils/initialValues";
import { updateUploadContent } from "../../api/request";
import { formateDateTime } from "../../utils/helpers";

const UploadContent = ({ formdata, formtype, updatecontent }) => {
    const [showEditIcon, setEditIcon] = useState(true);
    const [loading, setLoading] = useState(false);
    const [getError, setError] = useState(null);

    useEffect(() => {
        if (formdata) {
            const fields = Object.keys(formdata);
            fields.forEach((field) =>
                setFieldValue(field, formdata[field] || "", false)
            );
        }
    }, [formdata]);

    const {
        resetForm,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        values,
        touched,
        errors,
        isSubmitting,
    } = useFormik({
        initialValues: uploadContentInitailValue,
        validationSchema: uploadContentSchema,
        onSubmit: async () => {
            setLoading(true);
            const payload = {
                ...values,
                created: formateDateTime(values?.created),
            };
            let resp = await updateUploadContent(payload, values?.id, values.content_type === "Member News");
            if (resp?.status) {
                updatecontent(resp?.data);
            } else {
                setError(resp?.message);
            }
        },
    });

    return (
        <div className="MemberNewsEdit-Wrapper col-8">
            <div className="edit-card-heading-div d-flex justify-content-between w-75">
                <span className="edit-card-heading">{formtype} Details</span>
                <img
                    src={svg?.edit}
                    className="edit-icon"
                    alt="edit icon NP"
                    onClick={() => setEditIcon(false)}
                />
            </div>
            <form onSubmit={handleSubmit} className="w-75">
                <div
                    className={
                        errors.title && touched.title
                            ? "emailredborder inputdiv"
                            : "inputdiv"
                    }
                >
                    <span className="text-label">New Title</span>
                    <TextInput
                        label={"New Title"}
                        name={"title"}
                        type={"text"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.title}
                        className={`mt-2 form-control ${
                            touched &&
                            touched[values?.title] &&
                            errors[values?.title]
                                ? "is-invalid"
                                : ""
                        }`}
                        showdisabled={showEditIcon}
                    />
                    <ErrorMessage
                        errormsg={errors?.title}
                        touchedmsg={touched?.title}
                    />
                </div>

                <div
                    className={
                        errors.content && touched.content && errors.content
                            ? "emailredborder inputdiv"
                            : "inputdiv"
                    }
                >
                    <span className="text-label">Content</span>
                    <textarea
                        placeholder={"Content"}
                        name="content"
                        rows={5}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.content}
                        className={`mt-2 form-control ${
                            touched &&
                            touched[values?.content] &&
                            errors[values?.content]
                                ? "is-invalid"
                                : ""
                        }`}
                        disabled={showEditIcon}
                    />
                    <ErrorMessage
                        errormsg={errors?.content}
                        touchedmsg={touched?.content}
                    />
                </div>

                <>
                    {!showEditIcon && (
                        <div className="edit-btns pt-3">
                            <Button
                                variant=""
                                className="w-50 rounded-pill cancel-btn"
                                onClick={() => resetForm()}
                                disabled={isSubmitting}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant=""
                                className="w-50 rounded-pill save-btn"
                                type="submit"
                                disabled={isSubmitting}
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

export default UploadContent;
