import React, { useState,useEffect } from "react"
import { Form,Button, Modal} from "react-bootstrap"
import { useFormik } from "formik"
import ErrorMsg from "../../customComponents/ErrorMsg"
import SuccessMsg from "../../customComponents/SuccessMessage"
import roles from "../../utils/Roles"
import ErrorMessage from "../../customComponents/ErrorMessage"
import TextInput from "../../customComponents/TextInput"
import { UserSchema } from "../../utils/UserFormvalidations"
import "./internalusers.scss"
import { addAdminUser } from "../../api/request"
import Loader from "../../customComponents/Spinner"

const Adduser = (props) => {
  const [error,setError] = useState({show:false, message:""});
  const [successMsg,setSuccessMsg] = useState(false);

  useEffect(()=>{
    if(error.show){
      setTimeout(()=>{
        setError({show:false, message:""});
      },5000);
    }
    if(successMsg){
      setTimeout(()=>{
        setSuccessMsg(false);
      },5000);
    }
  },[error.show,successMsg])

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
      name: "",
      emailId: "",
      phonenum: "",
      role: ""
    },
    validationSchema: UserSchema,
    onSubmit: async () => {
      const userBody = {
        name:values?.name,
        email:values?.emailId,
        phone_number:values?.phonenum,
        roles: values?.role
    }
    let resp = await addAdminUser(userBody);
    if(resp?.status){
        setSuccessMsg(resp?.message)
        props.newuserdata(resp?.data)
        resetForm();
      }else{
        setError({show:true,message:resp.message})
      }
    }
  });

  return (
    <div className="feedback-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-user-modal"
        centered
      >
        <>
          <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
            Add User
          </Modal.Header>
          <Modal.Body className="change-password-body p-0 pt-2  text-center">
            <form onSubmit={handleSubmit} className="w-100">
              <div
                className={
                  errors.name && touched.name && errors.name
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Name</span>
                <TextInput
                  label={"Name"}
                  name={"name"}
                  type={"text"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className={`mt-2 form-control ${
                    touched &&
                    touched[values?.name] &&
                    errors[values?.name]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.name}
                  touchedmsg={touched?.name}
                />
              </div>

              <div
                className={
                  errors.role && touched.role && errors.role
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Role</span>
                <Form.Select
                  required
                  label={"Role *"}
                  name={"role"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.role}
                  className={`mt-2 form-control role-edit-select ${
                    touched && touched[values?.role] && errors[values?.role]
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option key={"role"} value="" disabled className="role-item">
                    Role
                  </option>
                  {roles.filter(role=>role.id !== "ALL").map((role,index)=>
                       <option key={index+1} value={role.id} className="role-item">{role.lable}</option>
                  )}
                </Form.Select>
                <ErrorMessage
                  errormsg={errors?.role}
                  touchedmsg={touched?.role}
                />
              </div>

              <div
                className={
                  errors.emailId && touched.emailId && errors.emailId
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Email</span>
                <TextInput
                  label={"Email"}
                  name={"emailId"}
                  type={"email"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.emailId}
                  className={`mt-2 form-control ${
                    touched && touched?.emailId && errors?.emailId
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.emailId}
                  touchedmsg={touched?.emailId}
                />
              </div>

              <div
                className={
                  errors.phonenum && touched.phonenum && errors.phonenum
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Phone</span>
                <TextInput
                  label={"Phone"}
                  name={"phonenum"}
                  type={"number"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phonenum}
                  className={`mt-2 form-control ${
                    touched && touched?.phonenum && errors?.phonenum
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.phonenum}
                  touchedmsg={touched?.phonenum}
                />
              </div>
              {isSubmitting && <Loader loadingMsg={"adding.."}/>}
              <div className="edit-btns">
                <Button
                  variant=""
                  className="w-50 rounded-pill cancel-btn"
                  disabled = {isSubmitting ? true : false}
                  onClick={()=>{ resetForm();props.onHide()}}
                >
                  Cancel
                </Button>
                <Button
                  variant=""
                  disabled = {isSubmitting ? true : false}
                  className="w-50 rounded-pill save-btn"
                  type="submit"
                >
                  {isSubmitting ? "Please wait" :"Add User"}
                </Button>
              </div>
            </form>
            {error.show && (
              <ErrorMsg errormsg={error.message} />
            )}
             {successMsg && (
               <SuccessMsg successmsg={successMsg} />
            )}
          </Modal.Body>
        </>
      </Modal>
    </div>
  )
}
export default Adduser
