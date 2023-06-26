import React, { useState, useEffect } from "react"
import { Button, Image, Row, Col } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { useFormik } from "formik"
import ErrorMessage from "../../customComponents/ErrorMessage"
import TextInput from "../../customComponents/TextInput"
import { subscriptionSchema } from "../../utils/subscription"
import { getSubscriptions,updateSubscription} from "../../api/request"
import AddSubscription from "./AddSubscription.jsx"
import svg from "../../assets/images/svg/index"
import "./style.scss"
import { subInitialValue } from "../../utils/initialValues"
import { BillingArray } from "../../utils/constants"
import Loader from "../../customComponents/Spinner"

const Subscription = () => {
  const [showCardclass, setCardclass] = useState({})
  const [isloading,setisLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [subscriptionList,setSubscriptionList] = useState([]);
  const [filterList,setFilterList] = useState([]);
  const [formData,setFormData] =  useState(subInitialValue);
  const [showDeletepopup,setShowDeletepopup] = useState (true)
  const [deleteId,setDeleteId] = useState(null);
  const [successMsg,setSuccessMsg] = useState(false);
  const [getError,setError] = useState(false);
  const [showAddpopup, setShowAddpopup] = useState(false)

  useEffect(()=>{
    setisLoading(true);
    getSubscriptionList()
 },[])

async function getSubscriptionList(){
  let resp = await getSubscriptions();
  if(resp?.status){
    setSubscriptionList(resp?.data);
    setisLoading(false);
    setFilterList(resp?.data);
  }else{
    setisLoading(false);
  }
}

useEffect(()=>{
  if(selectedCardId){
    const selectedCard = subscriptionList.find(sub => sub.id === selectedCardId);
    if(selectedCard && deleteId === null){
      const recurringData = BillingArray.find((item)=>item.interval === selectedCard.recurring_interval && item.interval_count === selectedCard.recurring_count)
      setFormData({...selectedCard,amount:selectedCard?.amount/100,recurring:recurringData?.value})
    }
  }
},[selectedCardId,subscriptionList])

  const hideModal = (data) => {
    if(data){
      getSubscriptionList()
    }
    setShowAddpopup(false);
  }
  const handleUsercardClick = id => {
    if (id === selectedCardId) {
      // If the user clicked on the already selected card, unselect it
      setSelectedCardId(null)
      setCardclass({})
    } else {
      // If the user clicked on a new card, update the state for that card
      setSelectedCardId(id)
      setCardclass({ [id]: true })
    }
  }

  const {
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    setFieldValue,
    errors,
    isSubmitting
  } = useFormik({
    initialValues:subInitialValue,
    validationSchema: subscriptionSchema,
    onSubmit: async () => {
      setisLoading(true);
      const payload = {
        ...values,
        amount:values?.amount,
        name:values?.name,
      }
      const recurringObj =BillingArray.find((item)=>item.value == parseInt(values?.recurring))
      payload['recurringObj'] ={interval:recurringObj?.interval,interval_count:recurringObj?.interval_count}
      let resp = await updateSubscription(payload,values?.id);
      if(resp?.status){
          getSubscriptionList();
          setSuccessMsg(resp?.message)
          handleCancel()
        }else{
          setError(resp.message)
        }
        setTimeout(()=>{
          setSuccessMsg(null);
          setError(null)
          setisLoading(false);
        },2000)
    }
  })

  useEffect(()=>{
    if(formData.id){
      const fields = Object.keys(formData);
      fields.forEach(field => setFieldValue(field, formData[field] || "", false));
     }
  },[formData])

  const handleCancel = ()=>{
    resetForm();
    setSelectedCardId(null);
    setCardclass({});
    setShowAddpopup(false);
  }

  return (
    <div className="subscription">
      <Row className="first-row">
        <Col className="d-flex user-heading-col" md={5}>
          <div className="users-heading">
            <span className="heading-txt">Subscription</span>
          </div>

          <div className="add-user">
            <Button
              variant="primary"
              className="add-user-btn"
              onClick={() => setShowAddpopup(true)}
            >
              <Image
                src={svg?.addusericon}
                alt="Button image"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Add New
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="second-row">
        <Col className="second-row-first-col border-right" md={3}>
        {isloading && <Loader loadingMsg={"loading.."}/>}
          <div className="user-data-card">
            {subscriptionList?.map((item, index) => (
              <div
                className={`${
                  showCardclass[item?.id] === true
                    ? "user-card greenbg"
                    : "user-card"
                }`}
                key={index}
                onClick={() => handleUsercardClick(item?.id)}
              >
                <div className="user-name">
                  <div className="user-card-first-row">
                    <div className="child-div">
                      <span className="user-fullname">{item?.name}</span>
                    </div>
                    <div className="user-delete">
                      <img
                        src={svg?.deleteuser}
                        className="delete-user-img"
                        alt="delete user img NP"
                      />
                    </div>
                  </div>

                </div>
                <div className="user-phone d-flex">
                  <img
                    src={svg?.subscription}
                    alt="email icon"
                    className="email-img"
                  />
                  <span className="email-text">{item?.amount/100}</span>
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col className="second-row-second-col" md={4}>
          <div className="second-row-second-col-div">
            <div className="edit-card-heading">Details</div>
            <form onSubmit={handleSubmit} className="w-75" autoComplete="off">
              <div className={errors.name && touched.name ? "emailredborder inputdiv": "inputdiv"}>
                <span className="text-label">Package Name</span>
                <TextInput
                  label={"Package Name"}
                  name={"name"}
                  type={"text"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.name}
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
                   errors.amount && touched.amount
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Cost</span>
                <TextInput
                  label={"Please enter cost"}
                  name={"amount"}
                  type={"number"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.amount}
                  className={`mt-2 form-control ${
                    touched &&
                    touched[values?.amount] &&
                    errors[values?.amount]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.amount}
                  touchedmsg={touched?.amount}
                />
              </div>

              <div
                className={
                  errors.recurring && touched.recurring
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Billing Cycle</span>
                <Form.Select
                  required
                  label={"Select Billing Cycle"}
                  name={"recurring"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.recurring}
                  className={`mt-2 form-control role-edit-select ${
                    touched && touched[values?.recurring] && errors[values?.recurring]
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="" disabled className="role-item">
                  Billing Cycle
                  </option>
                 {BillingArray?.map((bill,index)=>{
                  return <option key={index+1} value={bill?.value} className="role-item">
                     {bill?.label}
                   </option>
                  }) 
                  }
                </Form.Select>
                <ErrorMessage
                  errormsg={errors?.recurring}
                  touchedmsg={touched?.recurring}
                />
              </div>
              {isloading && isSubmitting && <Loader loadingMsg={"Updating.."}/>}
              <div className="edit-btns">
                <Button
                  variant=""
                  className="w-50 rounded-pill cancel-btn"
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting || values?.id === undefined ? true:false}
                >
                  Cancel
                </Button>
                <Button
                  variant=""
                  className="w-50 rounded-pill save-btn"
                  type="submit"
                  disabled={isSubmitting || values?.id === undefined ? true:false}
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </Col>
      </Row>

      {showAddpopup && (
        <AddSubscription show={showAddpopup} onHide={hideModal} />
      )}
    </div>
  )
}

export default Subscription
