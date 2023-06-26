import React, { useState, useEffect } from "react"
import { Modal, Button, Col, Row, Form } from "react-bootstrap"
import { useFormik } from "formik"
import Loader from "../../../customComponents/Spinner"
import CustomSelect from "../../../customComponents/React-Select/customSelect"
import { ingredientSchema } from "../../../utils/ingredientsValidations"
import { ingredientsInitialValues } from "../../../utils/initialValues"
import TextInput from "../../../customComponents/TextInput"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import ErrorMessage from "../../../customComponents/ErrorMessage"
import svg from "../../../assets/images/svg/index"
import { order, tier } from "../../../utils/constants"
import { addIngredient,updateIngredient } from "../../../api/request"
import { formateDateTime, multiSelectValue } from "../../../utils/helpers"
import SuccessMsg from "../../../customComponents/SuccessMessage"

const AddNew = (props) => {
  const {shopcate,ingredcate,ingrdmeas,tagdata} = props;
  const [showAddSuccess, setshowAddSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false)
  const [tagName,setTagName] = useState([]);

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
    initialValues: ingredientsInitialValues,
    validationSchema: ingredientSchema,
    onSubmit: async () => {
      setisLoading(true);
      const updateObj = (({ingredient_category_name,...other }) => other)(values)
      const payLoadBody = {
          ...updateObj,
          status:parseInt(updateObj?.status),
          shopping_category:parseInt(updateObj?.shopping_category || 0),
          shopping_measurement_id:parseInt(updateObj?.shopping_measurement_id ||0),
          tier:parseInt(updateObj?.tier),
          shopping_sort_order:parseInt(updateObj?.shopping_sort_order||0),
          category_ids:parseInt(updateObj?.category_ids || 0),
          nutritional_profile_id:null,
          is_excluded_from_shopping_list:null,
          is_staple:updateObj?.is_staple ? 1:0,
          tag_names:tagName.map(tag => tag.label).join(','),
          user_id:null
      }
      if(props?.alterdata?.id){
        payLoadBody.created = formateDateTime (values?.created);
      }
      let resp
      if(props?.alterdata?.id){
        const updateObj = (({categoryName,...other }) => other)(payLoadBody)
        resp = await updateIngredient(updateObj,props?.alterdata?.id);
      }else{
        resp = await addIngredient(payLoadBody);
      }
      if (resp?.status) {
        setshowAddSuccess(resp?.message);
        setError(false);
        setTimeout(()=>{
          setisLoading(false);
          props?.onHide(resp?.status)
        },2000);
      } else {
        setshowAddSuccess(false)
        setisLoading(false)
        setError(resp?.message)
      }
    }
  })

  const handleCategory = (cateId,cateName)=>{
    const fields = ["category_ids","ingredient_category_name"];
    fields.forEach(field => setFieldValue(field, field === fields[0]? cateId:cateName, false));
  }

  const handleChangeStaple = (e)=>{
   const fields = [e.target.name];
    fields.forEach(field => setFieldValue(field, e.target.checked? 1:0, false));
  }

  useEffect(()=>{
    if(props?.alterdata?.id){
      const fields = Object.keys(props?.alterdata);
      fields.forEach(field => setFieldValue(field, props?.alterdata[field] || "", false));
      const ingredient= ingredcate.find(item=>item.id === parseInt(props?.alterdata?.category_ids ||0))
      values.ingredient_category_name = ingredient ? ingredient.name:""
      if(props?.alterdata?.tag_names){
        getTagsData(props?.alterdata?.tag_names)
      }
    }
  },[props.alterdata,ingredcate])

  function getTagsData (tagData){
    let tagsArr=[];
    const tags = tagData?.split(",");
      for(let i=0; i<tags.length; i++){
        const tagDetails = tagdata?.find(item=>item.name === tags[i]);
        if(tagDetails) tagsArr.push(tagDetails)
      }
     setTagName(multiSelectValue(tagsArr));
  }

  return (
    <div className="AddNew-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-modal"
        centered
      >
        <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
         {props?.alterdata?.id ? "Update Ingredient": "Create a new Ingredient"} 
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-100" autoComplete="off">
            <Row>
              <Col md={4} className="textleft">
                <div className="first-col-heading colheading">
                  Select Category
                </div>
                {ingredcate?.filter(item=>item.parentId == null).map((cate,index)=>
                 <div key={index+1} className="chkClass">
                 <input
                   className="form-check-input"
                   type="radio"
                   name={"ingredient_category_name"}
                   onChange={()=>handleCategory(cate?.id, cate?.name)}
                   checked={values?.category_ids == cate?.id ? true:false }
                   id={cate?.id}
                 />
                 <label
                   className="form-check-label categorylabel"
                   htmlFor={cate?.id}
                 >
                   {cate?.id} - {cate?.name}
                 </label>
               </div>
                )}
              </Col>

              <Col md={8}>
                <div className="sec-col-heading textleft colheading">
                {props?.alterdata?.id ? "Update Ingredient": "Add Ingredient"}
                </div>
                
                <div className="col-cont">
                  <Col md={5} className="textleft">
                    <div
                      className={
                        errors.username && touched.username && errors.username
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
                    <div>
                      <span className="text-label">Plural Name</span>
                      <TextInput
                        label={"Plural Name"}
                        name={"plural_name"}
                        type={"text"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.plural_name}
                        className={"mt-2 form-control"}
                        />
                    </div>
                    <div>
                      <span className="text-label">Shopping Name</span>
                      <TextInput
                        label={"Shopping Name"}
                        name={"shopping_name"}
                        type={"text"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.shopping_name}
                        className={"mt-2 form-control"}
                      />
                    </div>
                    <div>
                      <span className="text-label">Shopping Plural Name</span>
                      <TextInput
                        label={"Shopping Plural Name"}
                        name={"shopping_plural_name"}
                        type={"text"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.shopping_plural_name}
                        className={"mt-2 form-control"}
                      />
                    </div>
                    <div>
                      <span className="text-label">Search Term</span>
                      <TextInput
                        label={"Search Term"}
                        name={"search_term"}
                        type={"text"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.search_term}
                        className={"mt-2 form-control"}
                      />
                    </div>
                    <div>
                      <span className="text-label">ESHA ID</span>
                      <TextInput
                        label={"Esha id"}
                        name={"esha_id"}
                        type={"number"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.esha_id}
                        className={"mt-2 form-control"}
                      />
                    </div>
                    <div
                      className={
                        errors.status && touched.status && errors.status
                          ? "emailredborder"
                          : ""
                      }
                    >
                      <span className="text-label">Status</span>
                      
                       <Form.Select
                        required
                        label={"Please select a Status"}
                        name={"status"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.status}
                        className={`mt-2 form-control role-edit-select ${
                          touched &&
                          touched[values?.status] &&
                          errors[values?.status]
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="" disabled className="role-item">
                          Please select a Status
                        </option>
                        <option value="1" className="role-item">
                          Published
                        </option>
                        <option value="0" className="role-item">
                          Pending
                        </option>
                      </Form.Select> 
                      <ErrorMessage
                        errormsg={errors?.status}
                        touchedmsg={touched?.status}
                      />
                    </div>
                    <div>
                      <span className="text-label">Shopping UOM</span>
                      <Form.Select
                        label={"Select a Shopping UOM"}
                        name={"shopping_measurement_id"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.shopping_measurement_id}
                        className={"mt-2 form-control role-edit-select"}
                      >
                        <option value="" disabled className="role-item">
                          Select a Shopping UOM
                        </option>
                        {ingrdmeas?.map((li,index)=>
                        <option key={index+1} value={li?.id} className="role-item">
                        {li?.name}
                      </option>
                        )}
                      </Form.Select>
                    </div>
                  </Col>
                  
                  <Col md={5} className="textleft">
                  <div>
                      <span className="text-label">Shopping Category</span>
                      <Form.Select
                        label={"Select Shopping Category"}
                        name={"shopping_category"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.shopping_category}
                        className={"mt-2 form-control role-edit-select"}
                      >
                        <option value="" disabled className="role-item">
                          Shopping Category
                        </option>
                        {shopcate?.map((li,index)=>
                        <option key={index+1} value={li?.id} className="role-item">
                        {li?.name}
                      </option>
                        )}
                      </Form.Select>
                    </div>
                    <div className={errors.tier && touched.tier && errors.tier
                          ? "emailredborder"
                          : ""
                      }
                    >
                      <span className="text-label">Tier</span>
                      <Form.Select
                        required
                        label={"Please select a Tier"}
                        name={"tier"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.tier}
                        className={`mt-2 form-control role-edit-select ${
                          touched &&
                          touched[values?.tier] &&
                          errors[values?.tier]
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="" disabled className="role-item">
                          Tier
                        </option>
                        {tier?.map((li,index)=>
                        <option key={index+1} value={li.value} className="role-item">
                        {li.value}
                      </option>
                        )}
                      </Form.Select>
                      <ErrorMessage
                        errormsg={errors?.tier}
                        touchedmsg={touched?.tier}
                      />
                    </div>
                    <div>
                      <span className="text-label">Shopping Sort Order</span>
                      <Form.Select
                        label={"Select an order"}
                        name={"shopping_sort_order"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.shopping_sort_order}
                        className={"mt-2 form-control role-edit-select"}
                      >
                        <option value="" disabled className="role-item">
                         Shopping short order
                        </option>
                        {order?.map((or,index)=>
                          <option key={index+1} value={or.value} className="role-item">{or.label}</option>
                        )}
                      </Form.Select>
                    </div>
                    <div>
                      <img
                        src={svg?.stapleicon}
                        className="staple-icon"
                        alt="staple icon NP"
                      />
                      <div className="staple-heading-div">
                        <span className="text-label">Is Staple</span>
                        <Form.Check
                          type="switch"
                          id="is_staple"
                          name="is_staple"
                          checked={values?.is_staple ? true: false}
                          onChange={handleChangeStaple}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-label">Categories</span>
                      <TextInput
                        label={"Please enter a Categories"}
                        name={"ingredient_category_name"}
                        type={"text"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        showdisabled={true}
                        value={values?.ingredient_category_name}
                        className={"mt-2 form-control"}
                      />
                    </div>
                    <div className="exclude-ingredients-wrapper mt-4">
                      <div className="text-label">Tag</div>
                     <CustomSelect
                        onSelectChange={(e)=>setTagName(e)}
                        placeholder="Select Tags"
                        options={tagdata}
                        multi={true}
                        value={tagName}
                        formField="tag_names"
                        stringData={true}
                      />
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
            {isLoading && <Loader loadingMsg={props?.alterdata?.id? "Updating...":"Adding..."}/>}
            <div className="btn-wrapper">
              <Button
                className="cancel-btn w-25"
                variant="outline-primary rounded-pill"
                onClick={() => { resetForm();props?.onHide()}}
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="save-btn w-25"
                variant="primary rounded-pill"
                type="submit"
                disabled={isLoading || isSubmitting}
              >
                {props?.alterdata?.id ? "Update" :"Add"}
              </Button>
            </div>
          </form>
          <>
            {getError && (
              <ErrorMsg errormsg={getError} />
            )}
             {showAddSuccess && (
               <SuccessMsg successmsg={showAddSuccess} />
            )}
          </>
        </Modal.Body>
      </Modal>
    </div>
  )
}
export default AddNew
