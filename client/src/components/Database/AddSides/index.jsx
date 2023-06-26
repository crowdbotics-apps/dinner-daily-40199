import React, { useState, useEffect } from "react"
import { Modal, Button } from "react-bootstrap"
import AsyncSelect from 'react-select/async';
import { multiSelectValue } from "../../../utils/helpers";
import { debounce } from 'lodash';
import ErrorMessage from "../../../customComponents/ErrorMessage"
import "./sides.scss"
import { sidesInitailValue } from "../../../utils/initialValues"

const AddSides = props => {
  const [isLoading, setisLoading] = useState(false);
  const [defaultOptions,setDefaultOptions] =  useState([]);
  const [formData,setFormData] = useState(sidesInitailValue)
  const [requirdField,setRequirdField] = useState(false);

  useEffect(()=>{
      if(props?.tags.length){
        setDefaultOptions(multiSelectValue(props?.tags.slice(0, 10)))
      }
  },[props.tags])

    // Debounce function with a delay of 3 milliseconds
    const delayedSearch = debounce(async (searchTerm) => {
      const results = props?.tags.filter((tag) => {
        return tag.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      });
         return multiSelectValue(results)
    }, 200);
    
    const promiseOptions = (inputValue) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(delayedSearch(inputValue));
        }, 1000);
    })


    const promiseOptions2 = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(delayedSearch(inputValue));
      }, 1000);
  })

 const handleSubmit = ()=>{
    setisLoading(true);
  if(formData.firstSide.length){
      props?.onHide("add",formData);
  }else{
    setRequirdField(true);
  }
  setisLoading(false)     
 }

 useEffect(()=>{
  if(props?.alterdata?.sno){
    setFormData(props?.alterdata)
  }else if(props?.alterdata?.rsid) {
    updateOldValues(props.alterdata);
  }
},[props.alterdata]);

function updateOldValues (oldValues){
   setFormData({
    firstSide:oldValues?.firstSides || oldValues?.firstSide,
    secondSide:oldValues?.secondSides || oldValues?.secondSide,
    rsid:oldValues?.rsid  
  })
}

 const handleSelectionChange = (e,field)=>{
  if(field === 'firstSide'){
    setRequirdField(false);
    setFormData({...formData,"firstSide":e})
  }else
    setFormData({...formData,"secondSide":e})
 }


  return (
    <div className="add-new-recipe-wrapper">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="add-new-side-modal"
        centered
      >
        <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
          {props?.alterdata !== null ? "Edit Sides" : "Add Sides"}
        </Modal.Header>
        <Modal.Body className="change-password-body p-0 pt-2 text-center">
          <form className="w-100">
              <div className="exclude-ingredients-wrapper mt-4">
                <div className="text-label">First Side</div>
              <AsyncSelect 
                cacheOptions 
                isMulti
                loadOptions={promiseOptions} 
                defaultOptions={defaultOptions}
                value={formData?.firstSide}
                onChange={(e)=>handleSelectionChange(e,"firstSide")}                
                />  
            </div>
            {requirdField && <ErrorMessage
                errormsg={"First side is required"}
                touchedmsg={"First side is required"}
              />}
            {props?.totalside > 1 && <div>
              <div className="exclude-ingredients-wrapper mt-4">
                <div className="text-label">Second Side</div>
                <AsyncSelect 
                isMulti
                cacheOptions 
                loadOptions={promiseOptions2} 
                defaultOptions={defaultOptions}
                value={formData?.secondSide}
                onChange={(e)=>handleSelectionChange(e,"secondSide")}           
                />  
              </div>
            </div>
            }
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
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {props?.alterdata !== null ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddSides
