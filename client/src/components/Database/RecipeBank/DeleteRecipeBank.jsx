import React, { useState } from "react"
import { Modal, Button } from "react-bootstrap"
// import { deleteAccount } from "../../api/request"
import ErrorMsg from "../../../customComponents/ErrorMsg"
import "./recipebank.scss"

const DeleteRecipeBank = props => {
  console.log("props inside DeleteRecipeBank", props)
  const [showDelSuccess, setshowDelSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false)

  const handleAccountdelete = async () => {
    /* for testing-- start */
    setshowDelSuccess(true)
    setError(false)

    /* for testing--- end */

    // setisLoading(true)
    // const resp = await deleteUser(props?.userid)
    // console.log("resp of delete user", resp)
    // if (resp === '') {
    //   setshowDelSuccess(true)
    //   setisLoading(false)
    //   setError(false)
    // } else {
    //   setshowDelSuccess(false)
    //   setisLoading(false)
    //   setError(true)
    // }
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
              Delete Recipe Bank
            </Modal.Header>

            <Modal.Body className="provide-feedback-body text-center">
              <div className="delete-acc-subheading font-medium-16">
                Are you sure you want to delete Recipe Bank?
              </div>

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
                  onClick={() => handleAccountdelete()}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>
              <>
                {getError === true && (
                  <ErrorMsg errormsg={"Error in Recipe Bank Deletion"} />
                )}
                {showDelSuccess === true && (
                  <span className="SuccessMsg text-center font-medium-20 mt-3 d-flex justify-content-center align-items-center">
                    Recipe Bank has been deleted successfully
                  </span>
                )}
              </>
            </Modal.Body>
          </>
        </Modal>
      </>
    </div>
  )
}

export default DeleteRecipeBank
