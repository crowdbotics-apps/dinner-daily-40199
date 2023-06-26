import React, { useState } from "react"
import svg from "../../../assets/images/svg/index"
import { Button } from "react-bootstrap"
import AddNewRoot from "./AddNewRoot.jsx"
import "./categories.scss"
import DeleteRoot from "./DeleteRoot"

const CategoriesHierarchy = (props) => {
  const [showAddRootPopup, setshowAddRootPopup] = useState(false)
  const [showEditRootPopup, setshowEditRootPopup] = useState(false)
  const [showDeleteRootPopup, setShowDeleteRootPopup] = useState(false)
  const [editData, seteditData] = useState(null)

  const hideModal = (data) => {
    if(data){
      props?.changecategory();
    }
    setshowAddRootPopup(false)
    setshowEditRootPopup(false)
    setShowDeleteRootPopup(false)
  }

  const handleEdit = data => {
    seteditData(data)
    setshowAddRootPopup(false)
    setshowEditRootPopup(true)
    setShowDeleteRootPopup(false)
    
  }

  const handleDelete = (data) => {
    seteditData(data)
    setShowDeleteRootPopup(true)
    setshowAddRootPopup(false)
    setshowEditRootPopup(false)
  }

  const handleCategoryChecked = (id)=>{
      console.log('Checking category',id)
  }

  
  return (
    <>
      <div className="CategoriesHierarchy-container">
        <Button
          variant="primary"
          className="add-root-btn"
          onClick={() => setshowAddRootPopup(true)}
        >
          Add Root Category
        </Button>
        {props?.ingredcate?.filter((item)=>item.parentId == null).map((item, index) => (
          <div className="item-container" key={index}>
            <div className="checkbox-wrapper">
              <input
                className="form-check-input item-checkbox"
                type="checkbox"
                onChange={()=>handleCategoryChecked(item?.id)}
                value={item?.id}
              />
              <label
                className="form-check-label categorylabel"
                htmlFor="flexCheckChecked"
              >
                {item?.name}
              </label>
            </div>
            <div className="icons-div">
              <img
                src={svg?.editicon}
                className="edit-icon"
                onClick={() => handleEdit(item)}
                alt="edit icon NP"
              />
              <img
                src={svg?.deleteicon}
                className="delete-icon"
                  onClick={() => handleDelete(item)}
                alt="delete icon NP"
              />
            </div>
          </div>
        ))}
      </div>
      <>
        {showAddRootPopup && (
          <AddNewRoot show={showAddRootPopup} onHide={hideModal} />
        )}
      </>
      <>
        {showEditRootPopup && (
          <AddNewRoot
            show={showEditRootPopup}
            onHide={hideModal}
            editdata={editData}
          />
        )}
      </>
      <>
        {showDeleteRootPopup && (
          <DeleteRoot show={showDeleteRootPopup} onHide={hideModal} editdata={editData} />
        )}
      </>
    </>
  )
}

export default CategoriesHierarchy
