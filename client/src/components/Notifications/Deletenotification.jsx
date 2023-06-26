import React, { useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { deleteNotification } from "../../api/request"
import ErrorMsg from "../../customComponents/ErrorMsg"
import SuccessMsg from "../../customComponents/SuccessMessage"
import "./deletenotification.scss"
import Loader from "../../customComponents/Spinner"

const Deletenotification = props => {
  const [showDelSuccess, setshowDelSuccess] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [getError, setError] = useState(false);
  const [successMsg,setSuccessMsg] =  useState("");

  const handleUserdelete = async () => {
    setisLoading(true);
    const resp = await deleteNotification(props?.deleteid);
    if (resp?.status) {
      setshowDelSuccess(true);
      setSuccessMsg(resp?.message);
      setTimeout(()=>{
        props?.onHide(props?.deleteid);
      },2000)
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
          className="delete-notification-modal"
          centered
        >
          <>
            <Modal.Header className="heading text-center">
              Delete Notification
            </Modal.Header>

            <Modal.Body className="provide-feedback-body text-center">
              <div className="delete-acc-subheading font-medium-16">
                Are you sure you want to delete Notification?
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
                  <ErrorMsg errormsg={getError} />
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

export default Deletenotification
