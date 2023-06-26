import React from "react"
import svg from "../../assets/images/svg/index"
import { Modal, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import "./logout.scss"

const Logout = props => {
  const navigate = useNavigate()
  return (
    <div className="delete-popup-cont">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="delete-acc-popup"
        centered
      >
        <>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => props?.onHide()}
            className="delete-acc-closeicon"
          />
          <img
            src={svg?.DeleteSuccess}
            alt="icon np"
            className="delete-success-icon"
          />
          <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
            Logout Successfully
          </Modal.Header>

          <Modal.Body className="provide-feedback-body p-0 pt-2  text-center">
            <div className="delete-acc-subheading font-medium-16">
              You've been successfully logged out
            </div>
            <div className="delete-btn-wrapper">
              <Button
                variant="primary"
                className="rounded-pill delete-btn"
                onClick={() => {
                  navigate("/admin")
                  props?.onHide()
                }}
              >
                Login
              </Button>
            </div>
          </Modal.Body>
        </>
      </Modal>
    </div>
  )
}

export default Logout
