import React, { useState,useEffect } from "react"
import { Button, Image, Row, Col } from "react-bootstrap"
import { Dropdown, Form } from "react-bootstrap"
import { useFormik } from "formik"
import ErrorMsg from "../../customComponents/ErrorMsg"
import SuccessMsg from "../../customComponents/SuccessMessage"
import ErrorMessage from "../../customComponents/ErrorMessage"
import TextInput from "../../customComponents/TextInput"
import { UserSchema } from "../../utils/UserFormvalidations"
import roles from "../../utils/Roles"
import Removeuser from "./Removeuser";
import Adduser from './Adduser.jsx';
import svg from "../../assets/images/svg/index"
import "./internalusers.scss"
import { getAdminUsers,updateAdminUser } from "../../api/request"
import { firstLetterUpperCase,shortName,formatRole,formatPhoneNumber } from "../../utils/helpers"
import { getLoginId } from "../../api/config"
import Loader from "../../customComponents/Spinner"

const InternalUsers = () => {
  const initialValue = {id:"",name: "",emailId: "",phonenum: "",role: ""}
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCardclass, setCardclass] = useState({})
  const [showDeletepopup ,setShowDeletepopup] =  useState(false);
  const [deleteId ,setDeleteId] =  useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [showAddpopup, setShowAddpopup]= useState(false);
  const [error,setError] = useState({show:false, message:""});
  const [successMsg,setSuccessMsg] = useState(false);
  const [usersList,setUsersList] =  useState([]);
  const [filterList,setFilterList] = useState([]);
  const [formData,setFormData] = useState(initialValue);
  const [searchUser,setSearchUser] = useState("");
  const [roleTypeFilter,setRoleTypeFilter] = useState({});

  useEffect(()=>{
      getUserList()
  },[])

  useEffect(()=>{
    if(error.show || successMsg){
      setTimeout(()=>{
        if(successMsg) setSuccessMsg(false);
        if(error.show) setError({show:false, message:""});
      },2000);
    }
  },[error.show,successMsg])

  useEffect(()=>{
    if(selectedCardId){
      const selectedCard = usersList.find(user => user.id === selectedCardId);
      if(selectedCard){
        const roleData = roles.find((item)=> item.id === selectedCard.roles);
        setFormData({...selectedCard,emailId:selectedCard.email,role: roleData.id})
      }
    }
  },[selectedCardId,usersList])


  useEffect(()=>{
   if(Object.keys(roleTypeFilter).length){ 
      if(!roleTypeFilter.hasOwnProperty("ALL") || !roleTypeFilter["ALL"]){
      const filterKey= getTrueKeys(roleTypeFilter);
      if(filterKey.length){
        const results = filterList.filter((item)=> {
          if(filterKey.includes(item.roles)) return item;
        });
        setUsersList(results)
        return
      }}
    setUsersList(filterList)
   }
  },[roleTypeFilter])


  function getTrueKeys(obj) {
    let ret = [];
    for (let key in obj) {
       if (obj.hasOwnProperty(key) && obj[key] === true) {
          ret.push(key);
       }
    }
    return ret;
 }


  async function getUserList(){
    let resp = await getAdminUsers();
    if(resp?.status){
      setUsersList(formatList(resp?.data));
      setFilterList(formatList(resp?.data))
    }
  }

  const newUserAdded = (data)=>{
    const usersLists = [...usersList];
    usersLists.push(data);
    setUsersList(formatList(usersLists));
    setFilterList(formatList(usersLists))
  }

 const  userListSearch = (e)=>{
  const search =  e.target.value;
    if (search !== '') {
      const results = filterList.filter((user) => {
        return user.name.toLowerCase().startsWith(search.toLowerCase());
      });
      setUsersList(results);
    }else{
      setUsersList(filterList);
    }
    setSearchUser(search);
 }

  const handleRoleChecked = (e)=>{
     const checkedName =  e.target.name;
     const checkedValue = e.target.checked;
     setRoleTypeFilter({...roleTypeFilter, [checkedName]: checkedValue})
  }

  function formatList (list){
      const userList = list.map((item)=>{
          return{
            ...item,
            name:firstLetterUpperCase(item?.name),
            shortname:shortName(item?.name),
            phonenum:formatPhoneNumber(item?.phone_number),
            role:formatRole(item?.roles)
          }
      })
      return userList
  }

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown)
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

  const handleUserDelete = (id)=>{
      setShowDeletepopup(true)
      setDeleteId(id)
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
    initialValues:initialValue,
    validationSchema: UserSchema,
    onSubmit: async () => {
      const userBody = {
          id:values?.id,
          name:values?.name,
          email:values?.emailId,
          phone_number:values?.phonenum,
          roles: values?.role
      }
      let resp = await updateAdminUser(userBody);
      if(resp?.status){
          setSuccessMsg(resp?.message)
          const user = [...usersList];
          const Index = user.findIndex((us) => us.id === values?.id);
          user[Index] = resp?.data
          setUsersList(formatList(user));
          setFormData(initialValue);
          setSelectedCardId(null);
          setCardclass({})
          resetForm();
        }else{
          setError({show:true,message:resp.message})
        }
    }
  })

  useEffect(()=>{
    if(formData.id){
      const fields = Object.keys(formData);
      fields.forEach(field => setFieldValue(field, formData[field], false));
     }
  },[formData])


  const hideModal = (data) => {
    setShowAddpopup(false);
    setShowDeletepopup(false);
    if(data){
      const user = [...usersList];
      const Index = user.findIndex((item) => item.id === data);
      user.splice(Index, 1);
      setUsersList(formatList(user));
      setFilterList(formatList(user))
    }
    resetForm();
    setDeleteId(null);
  }

  return (
    <div className="internal-users">
      <Row className="first-row">
        <Col className="d-flex user-heading-col" md={4}>
          <div className="users-heading">
            <img
              src={svg?.internalusersicon}
              className="internal-user-img"
              alt="internal-user-img Np"
            />
            <span className="heading-txt">Internal User</span>
          </div>

          <div className="add-user">
            <Button variant="primary" className="add-user-btn" onClick={()=> setShowAddpopup(true)}>
              <Image
                src={svg?.addusericon}
                alt="Button image"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Add User
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="second-row">
        <Col className="second-row-first-col border-right" md={4}>
          <div className="second-row-first-col-div">
            <div className="role-dropdown">
              <Dropdown show={showDropdown} onToggle={handleDropdownToggle}>
                <Dropdown.Toggle
                  className="role-btn"
                >
                  Role Type
                </Dropdown.Toggle>

                <Dropdown.Menu className="role-menu">
                  <Form>{roles.map((option,index) => (
                      <Form.Check
                        className="role-items"
                        type="checkbox"
                        name={option.id}
                        key={index}
                        id={option.id}
                        onChange={handleRoleChecked}
                        label={option.lable}
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
                  value={searchUser}
                  onChange={userListSearch}
                />
                {/* <button
                  className="btn btn-outline-secondary search-btn"
                  type="button"
                  onClick={userListSearch}
                >
                  <img
                    src={svg?.searchicon}
                    className="search-icon"
                    alt="search icon NP"
                  />
                </button> */}
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
            {usersList?.map((item) => (
              <div className={`${showCardclass[item?.id] === true
                    ? "user-card greenbg"
                    : "user-card"}`}
                key={item?.id}
                onClick={() => handleUsercardClick(item?.id)}
              >
                <div className="user-name">
                  <div className="user-card-first-row">
                    <div className="child-div">
                      <span className="user-initials">{item?.shortname}</span>
                      <span className="user-fullname">{item?.name}</span>
                    </div>
                    {item?.id !== getLoginId() && <div className="user-delete">
                      <img
                        src={svg?.deleteuser}
                        className="delete-user-img delete-user-click"
                        alt="delete user img NP"
                        onClick={()=>handleUserDelete(item?.id)}
                      />
                    </div>}
                  </div>
                  <Row className="user-role">{item?.role}</Row>
                </div>
                <div className="user-email d-flex">
                  <img
                    src={svg?.emailicon}
                    alt="email icon"
                    className="email-img"
                  />
                  <span className="email-text">{item?.email}</span>
                </div>
                <div className="user-phone d-flex">
                  <img
                    src={svg?.phoneicon}
                    alt="email icon"
                    className="email-img"
                  />
                  <span className="email-text">{item?.phonenum || "" }</span>
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
                  errors.name && touched.name && errors.name
                    ? "emailredborder inputdiv"
                    : "inputdiv"
                }
              >
                <span className="text-label">Name</span>
                <TextInput
                  label={"Name"}
                  name={"name"}
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.name || ""}
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
                  title="Roles"
                  required
                  label={"Role *"}
                  name={"role"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.role || ""}
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
                  value={values?.emailId || ""}
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
                  type={"text"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.phonenum || ""}
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
              {isSubmitting && <Loader loadingMsg={"Updating.."}/>}
              <div className="edit-btns">
                <Button
                  variant=""
                  disabled = {isSubmitting || values?.id === "" ? true : false}
                  onClick={()=>resetForm()}
                  className="w-50 rounded-pill cancel-btn"
                  type="reset"
                >
                  Cancel
                </Button>
                <Button
                  variant=""
                  disabled = {isSubmitting || values?.id === "" ? true : false}
                  className="w-50 rounded-pill save-btn"
                  type="submit"
                >
                 {isSubmitting ? "Please wait" :"Update"}
                </Button>
              </div>
            </form>
            {error.show && (
              <ErrorMsg errormsg={error.message} />
            )}
             {successMsg && (
               <SuccessMsg successmsg={successMsg} />
            )}
          </div>
        </Col>
      </Row>
      {showAddpopup && <Adduser show={showAddpopup} onHide={hideModal} newuserdata={newUserAdded}/>}
      {showDeletepopup && deleteId && (
          <Removeuser show={showDeletepopup} onHide={hideModal} deleteid={deleteId}/>
        )}
    </div>
  )
}

export default InternalUsers
