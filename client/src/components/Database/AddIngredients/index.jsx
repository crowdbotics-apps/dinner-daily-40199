import React, { useState, useEffect } from "react"
import { Modal, Button,Form} from "react-bootstrap"
import { debounce } from 'lodash';
import { useFormik } from "formik"
import AsyncSelect from 'react-select/async';
import TextInput from "../../../customComponents/TextInput"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import ErrorMessage from "../../../customComponents/ErrorMessage"
import "./style.scss"
import { recipeIngredientInitialValue } from "../../../utils/initialValues"
import { adminIngredients } from "../../../api/request";
import { multiSelectValue } from "../../../utils/helpers";
import { recipeIngredientSchema } from "../../../utils/addNewIngredientValidation";

const AddIngredients = props => {
  const [getError, setError] = useState(false);
  const pagination = {page: 1,pageSize: 10,sortField:"id",sortValue:"asc"}
  const [defaultOptions,setDefaultOptions] = useState([]);
  const [ingredients,setIngredient] = useState([]);
  const [requirdField,setRequirdField] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, [])

  useEffect(()=>{
    if(props?.alterdata?.sno){
      updateValues(props?.alterdata) 
    }
  },[props.alterdata])


  useEffect(()=>{
    if(props?.alterdata?.rid){
      updateValues(props?.alterdata);
      values.measurmentId = props?.alterdata?.cooking_measurement_id
    }
  },[props.alterdata])

  function updateValues (updateData){
    const fields = Object.keys(updateData);
    fields.forEach(field => setFieldValue(field, updateData[field] || recipeIngredientInitialValue[field], false));
    if(updateData?.ingredients){
      setIngredient(updateData?.ingredients)
    }else{
      setIngredient({value:updateData?.id,label:updateData?.name},)
    } 
  }


  const fetchIngredients = async () => {
    try {
      const response = await adminIngredients(pagination);
       if(response?.status){
        setDefaultOptions(multiSelectValue(response?.data))
       }
    }catch (error) {
       setError(error?.message)
    }
  }

  const {
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    isSubmitting
  } = useFormik({
    initialValues:recipeIngredientInitialValue,
    validationSchema: recipeIngredientSchema,
    onSubmit: async () => {
      if(ingredients?.value){
        const ingredientData ={
          ...values,
          ingredients:ingredients
     }
     props?.onHide("add",ingredientData);
      }else{
        setRequirdField("Ingredient can't be blank");
      }
    } 
  })

  // Debounce function with a delay of 3 milliseconds
  const delayedSearch = debounce(async (searchTerm) => {
    const searchQuery = {
      ...pagination,
      searchTerm
    }
    const response = await adminIngredients(searchQuery);
    if(response?.status){
       return multiSelectValue(response?.data)
    }
  }, 300);
  
  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(delayedSearch(inputValue));
      }, 1000);
  });

  return (
    <div className="add-new-recipe-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-ingredient-modal"
        centered
      >
        <Modal.Header className="heading border-bottom-0 mb-3 p-0 font-semi-bold-20 text-center">
          <>{props?.alterdata !==null ? "Edit Ingredient" : "Add Ingredient"}</>
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-100">
            <div>
            <span className="text-label">Ingredient</span>
              <AsyncSelect 
                cacheOptions 
                loadOptions={promiseOptions} 
                defaultOptions={defaultOptions}
                value={ingredients}
                onChange={(e)=>{setRequirdField(false);setIngredient(e)}}               
                />  
            </div>
            {requirdField &&  <ErrorMessage
                    errormsg={requirdField}
                    touchedmsg={requirdField}
                  />}
            <div>
              <span className="text-label">Ingredient UOM</span>
              <Form.Select
                label={"Please select a UOM"}
                name={"measurmentId"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.measurmentId}
                className={"mt-2 mb-2 form-control role-edit-select"}
              >
                <option key={0} value="" className="role-item"></option>
                {props?.measurmentlist?.map((item,index)=>
                  <option key={index+1} value={item.id} className="role-item">
                   {item.name}
                   </option>
                )}
              </Form.Select>
            </div>
            <div>
              <span className="text-label">Ingredient Qty</span>
              <TextInput
                label={"Ingredient Qty"}
                name={"amount"}
                type={"number"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.amount}
                className={"mt-2 form-control"}
              />
            </div>
            <div>
              <span className="text-label">Preparation</span>
              <TextInput
                label={"Preparation"}
                name={"preparation"}
                type={"text"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.preparation}
                className={"mt-2 form-control"}
              />
            </div>
         <div>
              <span className="text-label">Optional?</span>
              <Form.Select
                label={"Please select an Option"}
                name={"is_optional"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.is_optional}
                className={"mt-2 mb-2 form-control role-edit-select"}
              >
              <option value="1" className="role-item">
                Yes
              </option>
              <option value="0" className="role-item">
                No
              </option>
              </Form.Select>
            </div>
            <div>
              <span className="text-label">Round up for 1/2?</span>
              <Form.Select
                label={"Please select an Option"}
                name={"is_round_up_for_half_family_size"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.is_round_up_for_half_family_size}
                className={"mt-2 mb-2 form-control role-edit-select"}
              >
              <option value="1" className="role-item">
                Yes
              </option>
              <option value="0" className="role-item">
                No
              </option>
              </Form.Select>
            </div> 
            <div className="btn-wrapper">
              <Button
                className="cancel-btn w-25"
                variant="outline-primary rounded-pill"
                onClick={() =>{ resetForm();props?.onHide()}}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="save-btn w-25"
                variant="primary rounded-pill"
                type="submit"
                disabled={isSubmitting}
              >
                <>{props?.alterdata !==null ? "Update" : "Add"}</>
              </Button>
            </div>
          </form>
          <>
          {getError && (
              <ErrorMsg errormsg={getError} />
            )}
          </>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddIngredients
