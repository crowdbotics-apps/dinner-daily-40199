import React, { useEffect, useState } from "react"
import { Modal, Button, Col, Row, Form } from "react-bootstrap"
import TextInput from "../../../customComponents/TextInput"
import { useFormik } from "formik"
import { storeSchema } from "../../../utils/storeValidation"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import ErrorMessage from "../../../customComponents/ErrorMessage"
import { storeInitialValues } from "../../../utils/initialValues"
import { DaysArray, TimeArray } from "../../../utils/constants"
import { addStores,updateStores } from "../../../api/request"
import SuccessMsg from "../../../customComponents/SuccessMessage"
import Loader from "../../../customComponents/Spinner"
import CustomSelect from "../../../customComponents/React-Select/customSelect"
import { formateDateTime, multiSelectValue } from "../../../utils/helpers"

const AddNewStore = (props) => {
  const {statedata} = props;
  const [isLoading, setisLoading] = useState(false);
  const [error,setError]= useState("");
  const [showAddSuccess,setshowAddSuccess]=useState(false);
  const [state,setState]= useState([]);
  const {
    resetForm,
    handleSubmit,
    handleChange,
    setFieldValue,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting
  } = useFormik({
    initialValues: storeInitialValues,
    validationSchema: storeSchema,
    onSubmit: async () => {
      const payLoadBody = {
        ...values,
        sale_period_end: parseInt(values?.sale_period_end),
        order_with_peapod:parseInt(values?.order_with_peapod||0),
        sale_period_start: parseInt(values?.sale_period_start),
        week_menu_publishing_day: parseInt(values?.week_menu_publishing_day),
        week_menu_generation_day: parseInt(values?.week_menu_generation_day),
      }
      delete payLoadBody?.state;
      if(state.length && checkupdate(state)){
        payLoadBody.state = state.map(stateId => stateId.value);
      }
      if(props?.editdata?.id){
        payLoadBody.created = formateDateTime(values?.created);
      }
      try {
        let resp
        setisLoading(true);
        if(props?.editdata?.id){
          delete payLoadBody.specials;
          resp = await updateStores(payLoadBody,props?.editdata?.id);
        }else{
         resp = await addStores(payLoadBody);
        }
        if (resp?.status) {
          setshowAddSuccess(resp?.message);
          setError(false);
          setTimeout(() => {
            setisLoading(false);
            props?.onHide(resp?.status)
          }, 2000);
        } else {
          setshowAddSuccess(false)
          setisLoading(false)
          setError(resp?.message)
        }
      } catch (error) {
        setisLoading(false)
        setError(error?.message)
      }
    }
  })

  useEffect(()=>{
    if(props?.editdata?.id){
      const fields = Object.keys(props?.editdata);
      fields.forEach(field => setFieldValue(field, props?.editdata[field] || "", false));
      const state = props?.editdata?.state && typeof(props.editdata.state) === 'string' ? JSON.parse(props.editdata.state) : props?.editdata?.state;
      setState(multiSelectValue(state))
    }
  },[props.editdata])

  function checkupdate(state){
    if(values?.state){
      const firstArray = values?.state.map(item=>item.id);
      const secondArray = state.map(stateId => stateId.value);
      return !areEqual(firstArray, secondArray);
    }else{
      return true;
    }
  }

  function areEqual(array1, array2) {
    if (array1.length === array2.length) {
      return array1.every((element, index) => {
        if (element === array2[index]) {
          return true;
        }
        return false;
      });
    }
    return false;
  }

  return (
    <div className="add-new-store-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-modal"
        centered
      >
        <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
         { props?.editdata?.id ? "Update Store" :"Add New Store"}
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-100">
            <Row>
              <Col className="left-col" md={6}>
                <div
                  className={
                    errors.name && touched.name && errors.name
                      ? "emailredborder"
                      : ""
                  }
                >
                  <span className="text-label">Name</span>
                  <TextInput
                    label={"Please enter a name"}
                    name={"name"}
                    type={"text"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.name}
                    className={`mt-2 form-control ${touched &&
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
                <div>
                  <span className="text-label">Shopping List Text</span>
                  <TextInput
                    label={"Shopping Text here"}
                    name={"shopping_list_sub_header"}
                    type={"text"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.shopping_list_sub_header}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">WordPress Name</span>
                  <TextInput
                    label={"WordPress Name"}
                    name={"wordpress_name"}
                    type={"text"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.wordpress_name}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">External URL</span>
                  <TextInput
                    label={"External URL"}
                    name={"external_url"}
                    type={"text"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.external_url}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">External URL TooltipL</span>
                  <TextInput
                    label={"External url tooltip"}
                    name={"external_url_tooltip"}
                    type={"text"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.external_url_tooltip}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">Order with Peapod</span>
                  <Form.Select
                    label={"Select a prepod Order"}
                    name={"order_with_peapod"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.order_with_peapod}
                    className={"mt-2 form-control role-edit-select"}
                  >
                    <option value="" disabled className="role-item">Prepord Order</option>
                    <option value="1" className="role-item">
                      Yes
                    </option>
                    <option value="0" className="role-item">
                      No
                    </option>
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label">Create Menus on Day</span>
                  <Form.Select
                    required
                    label={"Please select a Day"}
                    name={"week_menu_generation_day"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.week_menu_generation_day}
                    className={"mt-2 form-control role-edit-select"}
                  >
                    {DaysArray.map((day, index) =>
                      <option key={index + 1} value={day.value} className="role-item">
                        {day.label}
                      </option>)}
                  </Form.Select>
                </div>
              </Col>
              <Col className="right-col" md={6}>
                <div>
                  <span className="text-label">Create Menus on Time</span>
                  <Form.Select
                    required
                    label={"Select Create Menus on Time"}
                    name={"week_menu_generation_time"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.week_menu_generation_time}
                    className={"mt-2 form-control role-edit-select"}
                  >
                    {TimeArray.map((day, index) =>
                      <option key={index + 1} value={day.value} className="role-item">
                        {day.label}
                      </option>)}
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label">Publish Menus on Day</span>
                  <Form.Select
                    required
                    label={"Please select a Day"}
                    name={"week_menu_publishing_day"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.week_menu_publishing_day}
                    className={"mt-2 form-control role-edit-select"}
                  >
                    {DaysArray.map((day, index) =>
                      <option key={index + 1} value={day.value} className="role-item">
                        {day.label}
                      </option>)}
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label">Publish Menus on Time</span>
                  <Form.Select
                    required
                    label={"Please select a Time Frame"}
                    name={"week_menu_publishing_time"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.week_menu_publishing_time}
                    className={"mt-2 form-control role-edit-select"}
                  >
                    {TimeArray.map((day, index) =>
                      <option key={index + 1} value={day.value} className="role-item">
                        {day.label}
                      </option>)}
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label">Sale Period Start</span>
                  <Form.Select
                    required
                    label={"Select sale period start"}
                    name={"sale_period_start"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.sale_period_start}
                    className={"mt-2 form-control role-edit-select"}
                  >
                    {DaysArray.map((day, index) =>
                      <option key={index + 1} value={day.value} className="role-item">
                        {day.label}
                      </option>)}
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label">Sale Period End</span>
                  <Form.Select
                    required
                    label={"Select sale period end"}
                    name={"sale_period_end"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.sale_period_end}
                    className={"mt-2 form-control role-edit-select"}
                  >
                    {DaysArray.map((day, index) =>
                      <option key={index + 1} value={day.value} className="role-item">
                        {day.label}
                      </option>)}
                  </Form.Select>

                </div>
                <div>
                  <span className="text-label">Order with Peapod Demo URL</span>
                  <TextInput
                    label={"Peapod Demo URL"}
                    name={"order_with_peapod_demo_url"}
                    type={"text"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.order_with_peapod_demo_url}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                <span className="text-label">State</span>
                  <CustomSelect
                    onSelectChange={(e)=>setState(e)}
                    placeholder="Select state"
                    options={statedata}
                    multi={true}
                    value={state}
                    formField="stateIds"
                  />
                </div>
              </Col>
            </Row>
            {isLoading && <Loader loadingMsg={props?.editdata?.id? "Updating...":"Adding..."}/>}
            <div className="btn-wrapper">
              <Button
                className="cancel-btn w-25"
                variant="outline-primary rounded-pill"
                onClick={() => { resetForm(); props?.onHide() }}
                disabled={isLoading || isSubmitting ? true : false}
              >
                Cancel
              </Button>
              <Button
                className="save-btn w-25"
                variant="primary rounded-pill"
                type="submit"
                disabled={isLoading || isSubmitting ? true : false}
              >
               {props?.editdata?.id ? "Update" : "Add"}
              </Button>
            </div>
          </form>
          {error && (
              <ErrorMsg errormsg={error} />
            )}
             {showAddSuccess && (
               <SuccessMsg successmsg={showAddSuccess} />
            )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddNewStore
