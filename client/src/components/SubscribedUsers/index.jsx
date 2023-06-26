import React, { useState, useRef, useEffect } from "react"
import { Button, Image, Row, Col } from "react-bootstrap"
import { Dropdown, Form } from "react-bootstrap"
import { useFormik } from "formik"
import ErrorMessage from "../../customComponents/ErrorMessage"
import TextInput from "../../customComponents/TextInput"
// import { loginSchema } from "../../utils/editUserFormvalidations"
import svg from "../../assets/images/svg/index"
import "./style.scss"

const cardData = [
  {
    id: 1,
    name: "Laurin Mills - Name of the Company Here"
  },
  {
    id: 2,
    name: "Laurin Mills - Name of the Company Here"
  },
  {
    id: 3,
    name: "Laurin Mills - Name of the Company Here"
  },
  {
    id: 4,
    name: "Laurin Mills - Name of the Company Here"
  }
]

const SubscribedUsers = () => {
  const dropdownRef = useRef(null)
  const editdropdownRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showEditDropdown, setShowEditDropdown] = useState(false)
  const [showCardclass, setCardclass] = useState({})
  const [selectedCardId, setSelectedCardId] = useState(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        editdropdownRef.current &&
        !editdropdownRef.current.contains(event.target)
      ) {
        setShowEditDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editdropdownRef])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown)
  }
  const handleEditDropdownToggle = () => {
    setShowEditDropdown(!showEditDropdown)
  }

  const handleUsercardClick = id => {
    console.log("inside handleUsercardClick", id)
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
    errors,
    isSubmitting
  } = useFormik({
    initialValues: {
      username: "",
      emailId: "",
      phonenum: "",
      role: ""
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
    <div className="internal-users">
      <Row className="first-row">
        <Col className="d-flex user-heading-col" md={5}>
          <div className="users-heading">
            <img
              src={svg?.subscribedusersicon}
              className="internal-user-img"
              alt="internal-user-img Np"
            />
            <span className="heading-txt">Subscribed Users</span>
          </div>
        </Col>
      </Row>

      <Row className="second-row">
        <Col className="second-row-first-col border-right" md={5}>
          <div className="second-row-first-col-div">
            <div className="role-dropdown" ref={dropdownRef}>
              <Dropdown show={showDropdown} onToggle={handleDropdownToggle}>
                <Dropdown.Toggle
                  className="role-btn"
                  // onClick={() => setShowDropdown(!showDropdown)}
                >
                  User Type
                </Dropdown.Toggle>

                <Dropdown.Menu className="role-menu">
                  <Form>
                    {["All", "Corporate", "Retail", "Trial"].map(option => (
                      <Form.Check
                        className="role-items"
                        type="checkbox"
                        key={option}
                        id={option}
                        label={option}
                      />
                    ))}
                  </Form>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="search-bar-div">
              <div className="input-group search-bar">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <button
                  className="btn btn-outline-secondary search-btn"
                  type="button"
                >
                  <img
                    src={svg?.searchicon}
                    className="search-icon"
                    alt="search icon NP"
                  />
                </button>
              </div>
            </div>
            <div className="sorting">
              <img
                src={svg?.sorting}
                className="sorting-img"
                alt="sorting Img Np"
              />
            </div>
          </div>

          <div className="user-data-card">
            {cardData?.map((item, index) => (
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
                      <span className="user-initials">LJ</span>
                      <span className="user-fullname">
                        Laurin Mills - Name of the Company Here
                      </span>
                    </div>
                    <div className="user-delete">
                      <img
                        src={svg?.subscribeduserstag}
                        className="delete-user-img"
                        alt="delete user img NP"
                      />
                    </div>
                  </div>

                  <Row className="user-role">Subscribed</Row>
                </div>
                <div className="user-email d-flex">
                  <img
                    src={svg?.emailicon}
                    alt="email icon"
                    className="email-img"
                  />
                  <span className="email-text">lmilssfive@gmail.com</span>
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col className="second-row-second-col" md={4}>
          <div className="second-row-second-col-div">
            <div className="edit-card-heading">Details</div>
            <form onSubmit={handleSubmit} className="w-75">
              <div
                className={
                  errors.username && touched.username && errors.username
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Name</span>
                <TextInput
                  label={"Name"}
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
                  errors.usertype && touched.usertype && errors.usertype
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label  pt-1 pb-2">User Type</span>
                <div className="role-dropdown">
                  <Dropdown
                    show={showEditDropdown}
                    onToggle={handleEditDropdownToggle}
                    ref={editdropdownRef}
                  >
                    <Dropdown.Toggle
                      className="role-btn"
                      // onClick={() => setShowDropdown(!showDropdown)}
                    >
                      User Type
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="role-menu">
                      {["All", "Corporate", "Retail", "Trial"].map(option => (
                        <Form.Check
                          className="role-items"
                          type="checkbox"
                          key={option}
                          id={option}
                          label={option}
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <ErrorMessage
                  errormsg={errors?.usertype}
                  touchedmsg={touched?.usertype}
                />
              </div>

              <div
                className={
                  errors.subscriptionPlan &&
                  touched.subscriptionPlan &&
                  errors.subscriptionPlan
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label pt-4 pb-2">Plan of Subscription</span>
                <TextInput
                  label={"Name"}
                  name={"subscriptionPlan"}
                  type={"text"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subscriptionPlan}
                  className={`mt-2 form-control ${
                    touched &&
                    touched[values?.subscriptionPlan] &&
                    errors[values?.subscriptionPlan]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.subscriptionPlan}
                  touchedmsg={touched?.subscriptionPlan}
                />
              </div>

              <div
                className={
                  errors.memberSince &&
                  touched.memberSince &&
                  errors.memberSince
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label  pt-1 pb-2">Member Since</span>
                <input
                  type="date"
                  className={`mt-2 form-control date-time-cont ${
                    touched &&
                    touched[values?.memberSince] &&
                    errors[values?.memberSince]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.memberSince}
                  touchedmsg={touched?.memberSince}
                />
              </div>

              <div
                className={
                  errors.lastActivesession &&
                  touched.lastActivesession &&
                  errors.lastActivesession
                    ? "emailredborder inputdiv pt-2"
                    : "inputdiv pt-2"
                }
              >
                <span className="text-label pt-3 pb-2">Last Active Session</span>
                <input
                  type="date"
                  className={`mt-2 form-control date-time-cont ${
                    touched &&
                    touched[values?.lastActivesession] &&
                    errors[values?.lastActivesession]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.lastActivesession}
                  touchedmsg={touched?.lastActivesession}
                />
              </div>

              <div
                className={
                  errors.totalHoursSpent &&
                  touched.totalHoursSpent &&
                  errors.totalHoursSpent
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label pt-3 pb-2">Total Hours Spent</span>
                <TextInput
                  label={"Name"}
                  name={"totalHoursSpent"}
                  type={"text"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.totalHoursSpent}
                  className={`mt-2 form-control ${
                    touched &&
                    touched[values?.totalHoursSpent] &&
                    errors[values?.totalHoursSpent]
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  errormsg={errors?.totalHoursSpent}
                  touchedmsg={touched?.totalHoursSpent}
                />
              </div>

              <div className="edit-btns justify-content-end">
                <Button
                  variant=""
                  className="w-50 rounded-pill cancel-btn"
                  type="submit"
                >
                  Deactivate Account
                </Button>
                {/* <Button
                  variant=""
                  className="w-50 rounded-pill save-btn"
                  type="submit"
                >
                  Save
                </Button> */}
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SubscribedUsers
