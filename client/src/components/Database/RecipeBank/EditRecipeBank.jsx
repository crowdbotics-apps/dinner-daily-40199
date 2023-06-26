import React, { useState } from "react"
import { Modal, Button, Col, Row, Form } from "react-bootstrap"
import TextInput from "../../../customComponents/TextInput"
import { useFormik } from "formik"
import { loginSchema } from "../../../utils/addRecipeValidations"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import ErrorMessage from "../../../customComponents/ErrorMessage"
import "./recipebank.scss"

const EditRecipeBank = props => {
  console.log("props in edit recipe bank", props)
  const [showAddSuccess, setshowAddSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false)
  const [showSelectedBank, setSelectedBank] = useState(
    props?.editdata?.bankname
  )
  const [showselectedRecipe, setSelectedRecipe] = useState(
    props?.editdata?.recipe
  )

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
      bankname: props?.editdata?.bankname || "",
      sortorder: props?.editdata?.sortorder || "",
      recipe: props?.editdata?.recipe || ""
    },
    // validationSchema: loginSchema,
    onSubmit: async () => {
      console.log(values)
      setisLoading(true)
      const addUserbody = {
        username: values?.username
      }
      // console.log("adduserbody", addUserbody)
      // let resp = await addUser(addUserbody)
      // console.log("resp from adduserbody", resp)
      // if (resp?.status === true) {
      //   setshowAddSuccess(true)
      //   setisLoading(false)
      //   setError(false)
      // } else {
      //   setshowAddSuccess(false)
      //   setisLoading(false)
      //   setError(true)
      // }
    }
  })

  const handleBankdropdownChange = e => {
    setSelectedBank(e?.target?.value)
  }

  const handleRecipedropdownChange = e => {
    setSelectedRecipe(e?.target?.value)
  }

  return (
    <div className="AddRecipeBank-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-modal recipe-add-modal"
        centered
      >
        <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
          Edit Recipe Bank
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-100">
            <span className="text-label">Bank</span>
            <Form.Select
              required
              label={"Please select a Bank"}
              name={"bankname"}
              value={showSelectedBank}
              onChange={e => handleBankdropdownChange(e)}
              className={`mt-2 form-control role-edit-select recipe-select`}
            >
              <option value="" className="role-item">
                Select Bank
              </option>
              <option value="Bank A" className="role-item">
                Bank A
              </option>
              <option value="Bank B" className="role-item">
                Bank B
              </option>
              <option value="Bank C" className="role-item">
                Bank C
              </option>
            </Form.Select>
            <>
              {showSelectedBank === "" && (
                <ErrorMessage
                  errormsg={errors?.bankname}
                  touchedmsg={touched?.bankname}
                />
              )}
            </>

            <div
              className={
                errors.sortorder && touched.sortorder && errors.sortorder
                  ? "emailredborder"
                  : ""
              }
            >
              <span className="text-label">Sort Order</span>
              <TextInput
                label={"Please select sort value"}
                name={"sortorder"}
                type={"number"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sortorder}
                className={`mt-2 form-control ${
                  touched &&
                  touched[values?.sortorder] &&
                  errors[values?.sortorder]
                    ? "is-invalid"
                    : ""
                }`}
              />
              <ErrorMessage
                errormsg={errors?.sortorder}
                touchedmsg={touched?.sortorder}
              />
            </div>

            <span className="text-label">Recipe</span>
            <Form.Select
              required
              label={"Please select a Recipe"}
              name={"recipe"}
              value={showselectedRecipe}
              onChange={e => handleRecipedropdownChange(e)}
              className={`mt-2 form-control role-edit-select recipe-select`}
            >
              <option value="" className="role-item">
                Select Recipe
              </option>
              <option value="Asian Slaw" className="role-item">
                Asian Slaw
              </option>
              <option value="Baby Carrots" className="role-item">
                Baby Carrots
              </option>
              <option value="Corn Salad" className="role-item">
                Corn Salad
              </option>
              <option value="Chopped Iceberg & Tomatoes" className="role-item">
                Chopped Iceberg & Tomatoes
              </option>
            </Form.Select>
            <>
              {showselectedRecipe === "" && (
                <ErrorMessage
                  errormsg={errors?.recipe}
                  touchedmsg={touched?.recipe}
                />
              )}
            </>

            <div className="btn-wrapper">
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
              <ErrorMsg errormsg={"Error in editing Recipe Bank"} />
            )}
            {showAddSuccess === true && (
              <span className="rstPassSuccessMsg text-center font-medium-20 mt-3 d-flex justify-content-center align-items-center">
                Recipe Bank has been updated successfully
              </span>
            )}
          </>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default EditRecipeBank
