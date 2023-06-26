import React, { useState,useEffect } from "react"
import { Modal, Button, Col, Row, Form} from "react-bootstrap"
import { useFormik } from "formik"
import TextInput from "../../../customComponents/TextInput"
import { recipeSchema } from "../../../utils/addRecipeValidations"
import CustomSelect from "../../../customComponents/React-Select/customSelect"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import RecipeSide from "./RecipeSide"
import RecipeIngredient from "./RecipeIngredient"
import ErrorMessage from "../../../customComponents/ErrorMessage"
import Loader from "../../../customComponents/Spinner"
import "./addnewrecipe.scss"
import { recipeInitialValues } from "../../../utils/initialValues"
import { CookingType, DishType, Sides, Status } from "../../../utils/constants"
import SuccessMsg from "../../../customComponents/SuccessMessage"
import { formateDateTime, multiSelectValue, recipeCombinationId, recipeCombinationTagId } from "../../../utils/helpers"
import { addRecipe,updateRecipe } from "../../../api/request"
import { IS_STAPLE_YES } from "../../../utils/constants"

const AddNewRecipe = props => { 
  const {taglist,measurmentlist} = props 
  const [isloading, setisLoading] = useState(false);
  const [tag_names,setTagName] =  useState([]);
  const [showAddSuccess,setshowAddSuccess] = useState(false);
  const [getError,setError] = useState(false);
  const [ingredientData,setIngredientData]= useState([]);
  const [sidesData,setSidesData] =  useState([]);
  const [otherDeleteData,setOtherDeleteData] = useState({rsid:[],rscid:[]})

  const {
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    touched,
    errors,
    isSubmitting
  } = useFormik({
    initialValues:recipeInitialValues,
    validationSchema: recipeSchema ,
    onSubmit: async () => {
      setisLoading(true);
      const updateObj = (({  
      calories,
      fats,
      saturated_fats,
      sodium,
      carbs,
      fiber,
      protein, 
      ...other }) => other)(values) 
      const payLoadBody = {
          ...updateObj,
          status:parseInt(updateObj?.status || 0),
          dish_type:parseInt(updateObj?.dish_type || 0),
          number_of_sides:parseInt(updateObj?.number_of_sides ||0),
          recipe_group_id:updateObj?.recipe_group_id !=="" ? parseInt(updateObj?.recipe_group_id):null,
          cooking_time:parseInt(updateObj?.cooking_time ||0),
          cooking_type:updateObj?.cooking_type !== "" ? parseInt(updateObj?.cooking_type):null,
          preparation_time:parseInt(updateObj?.preparation_time || 0),
          tag_names:tag_names.length > 0 ? tag_names.map(tag => tag.label).join(','):"",
          tag_ids:tag_names.length > 0 ? tag_names.map(tag => tag.value):"",
          ingredients:ingredientData,
          nutritional:{
            calories:parseInt(values?.calories ||0),
            fats: parseInt(values?.fats ||0),
            saturated_fats: parseInt(values?.saturated_fats ||0),
            sodium:parseInt(values?.sodium ||0),
            carbs:parseInt(values?.carbs ||0),
            fiber:parseInt(values?.fiber ||0),
            protein:parseInt(values?.protein ||0),
          }
      }
      if(sidesData.length){
          payLoadBody.sides = sidesData;
       }
      if(props?.alterdata?.id){
        payLoadBody.created = formateDateTime(values?.created);
      }
      let resp
      if(props?.alterdata?.id){
        resp = await updateRecipe(payLoadBody,props?.alterdata?.id, props?.alterdata?.sides.length ? otherDeleteData:"");
      }else{
        resp = await addRecipe(payLoadBody);
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

  useEffect(()=>{
    if(props?.alterdata?.id){
      const fields = Object.keys(props?.alterdata);
      fields.forEach(field => setFieldValue(field, props?.alterdata[field] || recipeInitialValues[field], false));
      if(props?.alterdata?.tag_names){
        getTagsData(props?.alterdata?.tag_names)
      }
      if(props.alterdata?.sides.length){
           setOtherDeleteData({
             rsid:recipeCombinationId(props.alterdata?.sides),
             rscid:recipeCombinationTagId(props.alterdata?.sides),
           });
      }
    }
  },[props.alterdata,taglist])

  function getTagsData (tagData){
    let tagsArr=[];
    const tags = tagData?.split(",");
      for(let i=0; i<tags.length; i++){
        const tagDetails = taglist?.find(item=>item.name === tags[i]);
        if(tagDetails) tagsArr.push(tagDetails)
      }
     setTagName(multiSelectValue(tagsArr));
  }

  const handleChangecheckBox = (e)=>{
    const fields = [e.target.name];
     fields.forEach(field => setFieldValue(field, e.target.checked? 1:0, false));
   }

   const handleIngredient = (data)=>{
    let ingredient =[];
      if(data.length){
        ingredient = data?.map((item)=>{
            return{
              rid:item?.rid ? item.rid :"new",
              cooking_measurement_id:item?.measurmentId || item?.cooking_measurement_id,
              amount:item?.amount,
              ingredient_id:item?.ingredientId || item?.ingredient_id,
              preparation:item?.preparation,
              is_optional:item?.is_optional === IS_STAPLE_YES ? 1:0 ,
              is_round_up_for_half_family_size:item?.is_round_up_for_half_family_size  === IS_STAPLE_YES ? 1:0
            }    
        })
       }
    setIngredientData(ingredient); 
   }


   const handleSide = (data)=>{
    let results = [];
       const totalside = parseInt(values?.number_of_sides);
       if(data.length && totalside > 0){
       results = data.map((item)=>{
          let res = {side_0:item?.firstSideids}
           if(totalside === 2) res['side_1']=item?.secondSideids
          return res   
        })
       }
       setSidesData(results)
   }


  return (
    <div className="add-new-recipe-wrapper">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-modal add-new-recipe-modal"
        centered
        // scrollable={true}
      >
        <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
         {props?.alterdata?.id ? "Update New Recipe": "Add New Recipe"}
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2  text-center">
          <form onSubmit={handleSubmit} className="w-100 p-4" autoComplete="off">
            <Row className="main-dish-row">
              <Col md={4}>
                <div
                  className={errors.name && touched.name
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
                  <span className="text-label">Dish Type</span>
                  <Form.Select
                    label={"Please select a Dish"}
                    name={"dish_type"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.dish_type}
                    className={"mt-2 form-control role-edit-select"}
                  >
                  {DishType?.map((item,index)=>
                     <option key={index+1} value={item.value} className="role-item">
                      {item.label}
                   </option>
                    )}
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label">Number of Sides</span>
                  <Form.Select
                    label={"Please select a Sides"}
                    name={"number_of_sides"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.number_of_sides}
                    className={"mt-2 form-control role-edit-select"}
                  >
                     {Sides?.map((item,index)=>
                     <option key={index+1} value={item.value} className="role-item">
                      {item.label}
                   </option>
                    )} 
                  </Form.Select>
                </div>
                <div className="mt-3">
                  <span className="text-label">
                    Serves
                  </span>
                  <input
                    type="number"
                    label={"Serves"}
                    name={"number_of_servings"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.number_of_servings}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
                <div>
                  <span className="text-label">Cooking Type</span>
                  <Form.Select
                    label={"Please select cooking type"}
                    name={"cooking_type"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.cooking_type}
                    className={"mt-2 form-control role-edit-select"}
                  >
                     {CookingType?.map((item,index)=>
                     <option key={index+1} value={item.value} className="role-item">
                      {item.label}
                   </option>
                    )}
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label">Group</span>
                  <Form.Select
                    label={"Please select a Group"}
                    name={"recipe_group_id"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.recipe_group_id}
                    className={"mt-2 form-control role-edit-select"}
                  >
                     {DishType?.map((item,index)=>
                     <option key={index+1} value={item.value} className="role-item">
                      {item.label}
                   </option>
                    )}
                  </Form.Select>
                </div>
                <div className="exclude-ingredients-wrapper mt-2">
                      <div className="text-label">Tags</div>
                     <CustomSelect
                        onSelectChange={(e)=>setTagName(e)}
                        placeholder="Select Tags"
                        options={taglist}
                        multi={true}
                        value={tag_names}
                        formField="tag_names"
                        stringData={true}
                      />
                    </div>
                <div className="mt-3">
                  <span className="text-label">
                    Preparation Time
                  </span>
                  <input
                    type="number"
                    label={"Preparation Time"}
                    name={"preparation_time"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.preparation_time}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
                <div>
                  <span className="text-label">
                    Cooking Time
                  </span>
                  <input
                    type="number"
                    label={"Cooking Time"}
                    name={"cooking_time"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.cooking_time}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
                <div>
                  <span className="text-label">Calories</span>
                  <TextInput
                    label={"Calories"}
                    name={"calories"}
                    type={"number"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.calories}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">Fat</span>
                  <TextInput
                    label={"Fat"}
                    name={"fats"}
                    type={"number"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.fats}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">Saturated Fat</span>
                  <TextInput
                    label={"Saturated Fat"}
                    name={"saturated_fats"}
                    type={"number"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.saturated_fats}
                    className={"mt-2 form-control"} 
                  />
                </div>
                <div>
                  <span className="text-label">Sodium (mg)</span>
                  <TextInput
                    label={"Sodium"}
                    name={"sodium"}
                    type={"number"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.sodium}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">Carbs</span>
                  <TextInput
                    label={"Carbs"}
                    name={"carbs"}
                    type={"number"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.carbs}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">Fiber</span>
                  <TextInput
                    label={"Fiber"}
                    name={"fiber"}
                    type={"number"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.fiber}
                    className={"mt-2 form-control"}
                  />
                </div>
                <div>
                  <span className="text-label">Protien</span>
                  <TextInput
                    label={"Protien"}
                    name={"protein"}
                    type={"number"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.protein}
                    className={"mt-2 form-control"}
                  />
                </div>
              </Col>
              <Col md={8}>
              <div>
                  <span className="text-label">Status</span>
                  <Form.Select
                    label={"Status"}
                    name={"status"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.status}
                    className={"mt-2 form-control role-edit-select"}
                  >
                  {Status?.map((item,index)=>
                     <option key={index+1} value={item.value} className="role-item">
                      {item.label}
                   </option>
                    )}
                  </Form.Select>
                </div>
                <div>
                  <span className="text-label w-100">Tested</span>
                  <Form.Check
                    type="switch"
                    id="is_tested"
                    name="is_tested"
                    checked={values?.is_tested}
                    onChange={handleChangecheckBox}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <span className="text-label w-100">Ok for half?</span>
                  <Form.Check
                    type="switch"
                    id="is_ok_for_half"
                    name="is_ok_for_half"
                    checked={values?.is_ok_for_half}
                    onChange={handleChangecheckBox}
                    onBlur={handleBlur}
                  />
                </div>
                <div className={
                    errors.instructions &&
                    touched.instructions &&
                    errors.instructions
                      ? "emailredborder"
                      : ""
                  }
                >
                  <span className="text-label">Instruction</span>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    style={{ height: "150px" }}
                    label={"Instruction"}
                    name={"instructions"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.instructions}
                    className={`mt-2 form-control role-edit-select ${
                      touched &&
                      touched[values?.instructions] &&
                      errors[values?.instructions]
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    errormsg={errors?.instructions}
                    touchedmsg={touched?.instructions}
                  />
                </div>

                <div>
                  <span className="text-label">Half Instruction</span>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    style={{ height: "150px" }}
                    label={"Half Instruction"}
                    name={"half_instructions"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.half_instructions}
                    className={"mt-2 form-control role-edit-select"}
                  />
                  <ErrorMessage
                    errormsg={errors?.half_instructions}
                    touchedmsg={touched?.half_instructions}
                  />
                </div>
                <div>
                  <span className="text-label">Heart Healthy Instructions</span>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    style={{ height: "150px" }}
                    label={"Heart Healthy Instructions"}
                    name={"alt_instructions"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.alt_instructions}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
                <div>
                  <span className="text-label">Heart Healthy Half Instructions</span>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    style={{ height: "150px" }}
                    label={"Heart Healthy Half Instructions"}
                    name={"alt_half_instructions"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.alt_half_instructions}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
                <div>
                  <span className="text-label">Do Ahead</span>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    style={{ height: "150px" }}
                    label={"Do Ahead"}
                    name={"do_ahead"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.do_ahead}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
                <div>
                  <span className="text-label">Corner Note</span>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    style={{ height: "150px" }}
                    label={"Corner Note"}
                    name={"corner_note"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.corner_note}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
                <div>
                  <span className="text-label">Additional Note</span>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    style={{ height: "150px" }}
                    label={"Additional Note"}
                    name={"additional_note"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.additional_note}
                    className={"mt-2 form-control role-edit-select"}
                  />
                </div>
              </Col>
            </Row>
             <RecipeIngredient ingredients={props?.alterdata?.ingredients || []} measurmentlist={measurmentlist}  ingredientdata={handleIngredient}/>
             {values?.number_of_sides >0 && <RecipeSide sides={props?.alterdata?.sides || []} tags={taglist} totalside={values?.number_of_sides} sidedata={handleSide}/>} 
            {isloading && <Loader loadingMsg={props?.alterdata?.id? "Updating...":"Adding..."}/>}
            <div className="btn-wrapper mx-2">
              <Button
                className="cancel-btn w-25"
                variant="outline-primary rounded-pill"
                onClick={() => { resetForm(); props?.onHide() }}
                disabled={isloading || isSubmitting ? true : false}
              >
                Cancel
              </Button>
              <Button
                className="save-btn w-25"
                variant="primary rounded-pill"
                type="submit"
                disabled={isloading || isSubmitting ? true : false}
              >
               {props?.alterdata?.id ? "Update" : "Add"}
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

export default AddNewRecipe
