import React, { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import { useFormik } from "formik"
import ErrorMessage from "../../customComponents/ErrorMessage"
import TextInput from "../../customComponents/TextInput"
//import { loginSchema } from "../../utils/editUserSubscription"
import svg from "../../assets/images/svg/index"
import "./styles.scss"

const Coupons = props => {
  const [showEditIcon, setEditIcon] = useState(true)
  const {
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting
  } = useFormik({
    initialValues: {
      username: "",
      billingcycle: "",
      cost: ""
    },
    validationSchema: {},
    onSubmit: async () => {
      console.log(values)
      const loginbody = {
        email: values?.username,
        password: values?.password
      }
      //   let resp = await login(loginbody)
      //   console.log("resp from login", resp)
      //   if (resp?.data?.token !== undefined) {
      //     localStorage.setItem("user", JSON.stringify(resp?.data))
      //     navigate("/admindashboard");
      //     resetForm();
      //   } else {
      //     resetForm();
      //   }
    }
  })
  return (
    <div className="Coupons-Wrapper col-8">
      <div className="edit-card-heading-div d-flex justify-content-between align-items-center mb-4 w-75">
        <span className="edit-card-heading-txt">Details</span>
        <img
          src={svg?.edit}
          className="edit-icon"
          alt="edit icon NP"
          onClick={() => setEditIcon(false)}
        />
      </div>
      <form onSubmit={handleSubmit} className="w-75">
        <div className="image-upload">
          <div className="upload-imagewrapper d-flex">
            <img
              src={svg?.uploadimage}
              className="upload-image-img"
              alt="upload-imageNP"
            />
            <span className="upload-txt">Upload Icon</span>
          </div>
          <label className="upload-image-label">
            <img
              src={svg?.uploadicon}
              className="upload-image-img"
              alt="upload-imageNP"
            />
            <input type="file"></input>
          </label>
        </div>

        <span className="image-upload-info mb-3 mt-2">
          Image should be a png/svg and no more than 48x48 pixels
        </span>

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
            // name="content"
            rows={5}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.content}
            className={`mt-2 form-control ${
              touched && touched[values?.content] && errors[values?.content]
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

        <div className="image-upload mt-5">
          <div className="upload-imagewrapper d-flex">
            <img
              src={svg?.uploadpdf}
              className="upload-image-img"
              alt="upload-imageNP"
            />
            <span className="upload-txt">Upload Pdf</span>
          </div>
          <label className="upload-image-label">
            <img
              src={svg?.uploadicon}
              className="upload-image-img"
              alt="upload-imageNP"
            />
            <input type="file"></input>
          </label>
        </div>

        <>
          {showEditIcon === false && (
            <div className="edit-btns pt-3">
              <Button
                variant=""
                className="w-50 rounded-pill cancel-btn"
                type="submit"
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
  )
}

export default Coupons

