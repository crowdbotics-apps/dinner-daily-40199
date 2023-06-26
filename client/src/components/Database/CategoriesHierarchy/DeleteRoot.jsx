import React, { useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { deleteRootCategory } from "../../../api/request"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import "./categories.scss"
import SuccessMsg from "../../../customComponents/SuccessMessage"
import Loader from "../../../customComponents/Spinner"

const DeleteRoot = props => {
  const {id} = props?.editdata
  const [showDelSuccess, setshowDelSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false)

  const handleIngrCategorydelete = async () => {
    setisLoading(true);
    const resp = await deleteRootCategory(id);
    if (resp?.status) {
      setshowDelSuccess(resp?.message);
      setError(false);
      props?.onHide(id);
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
          className="delete-ingredient-modal"
          centered
        >
          <>
            <Modal.Header className="heading text-center">
              Delete Root
            </Modal.Header>

            <Modal.Body className="provide-feedback-body text-center">
              <div className="delete-acc-subheading font-medium-16">
                Are you sure you want to delete Root?
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
                  onClick={() => handleIngrCategorydelete()}
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

export default DeleteRoot
