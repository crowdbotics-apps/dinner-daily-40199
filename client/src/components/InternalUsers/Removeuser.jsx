import React, { useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { deleteUser } from "../../api/request"
import ErrorMsg from "../../customComponents/ErrorMsg"
import SuccessMsg from "../../customComponents/SuccessMessage"
import "./deleteuser.scss"
import Loader from "../../customComponents/Spinner"

const Removeuser = props => {
  const [showDelSuccess, setshowDelSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false);
  const [successMsg,setSuccessMsg] =  useState("");

  const handleUserdelete = async () => {
    setisLoading(true);
    const resp = await deleteUser(props?.deleteid);
    if (resp?.status) {
      setshowDelSuccess(true);
      setSuccessMsg(resp?.message);
      setError(false);
      props?.onHide(props?.deleteid);
    } else {
      setshowDelSuccess(false);
      setSuccessMsg(false);
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
          className="delete-user-modal"
          centered
        >
          <>
            <Modal.Header className="heading text-center">
              Delete User
            </Modal.Header>

            <Modal.Body className="provide-feedback-body text-center">
              <div className="delete-acc-subheading font-medium-16">
                Are you sure you want to delete user?
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
                  onClick={() => handleUserdelete()}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>
              <>
                {getError && (
                  <ErrorMsg errormsg={"Error in User Deletion"} />
                )}
                {showDelSuccess && (
                   <SuccessMsg successmsg={successMsg} />
                )}
              </>
            </Modal.Body>
          </>
        </Modal>
      </>
    </div>
  )
}

export default Removeuser
