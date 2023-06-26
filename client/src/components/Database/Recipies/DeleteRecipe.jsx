import React, { useEffect, useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { deleteRecipe } from "../../../api/request"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import SuccessMsg from "../../../customComponents/SuccessMessage"
import "./deleteRecipe.scss"
import Loader from "../../../customComponents/Spinner"
import { recipeCombinationId, recipeCombinationTagId } from "../../../utils/helpers"

const DeleteRecipe = props => {
  const {id, sides} =  props?.delete
  const [showDelSuccess, setshowDelSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false)
  const [otherDeleteData,setOtherDeleteData] = useState({rsid:[],rscid:[]})


  useEffect(()=>{
   if(sides.length){
    setOtherDeleteData({
      rsid:recipeCombinationId(sides),
      rscid:recipeCombinationTagId(sides),
    })
   }
  },[sides])

  const handleRecipedelete = async () => {
    setisLoading(true);
    const queryParam = {
      rsid:otherDeleteData?.rsid.join(","),
      rscid:otherDeleteData?.rscid.join(",")
    }
    const resp = await deleteRecipe(id, sides.length ? queryParam:"");
    if (resp?.status) {
      setshowDelSuccess(resp?.message);
      setError(false);
      props?.onHide(true);
    } else {
      setshowDelSuccess(false);
      setError(resp?.message)
    }
    setisLoading(false)
  }

  return (
    <div className="delete-user-wrapper">
      <>
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          className="delete-recipe-modal"
          centered
        >
          <>
            <Modal.Header className="heading text-center">
              Delete Recipe
            </Modal.Header>

            <Modal.Body className="provide-feedback-body text-center">
              <div className="delete-acc-subheading font-medium-16">
                Are you sure you want to delete  recipe?
              </div>
              {isLoading && <Loader loadingMsg={"deleting.."}/>}
              <div className="delete-btn-wrapper">
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
                  onClick={() => handleRecipedelete()}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>
              <>
              {getError && (
                  <ErrorMsg errormsg={getError} />
                )}
                {showDelSuccess && (
                   <SuccessMsg successmsg={showDelSuccess} />
                )}
              </>
            </Modal.Body>
          </>
        </Modal>
      </>
    </div>
  )
}

export default DeleteRecipe
