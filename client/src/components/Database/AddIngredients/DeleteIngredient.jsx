import React  from "react"
import { Modal, Button } from "react-bootstrap"
import { deleteRecipeIngredient } from "../../../api/request"
import "./deleteIngredient.scss"

const DeleteIngredient = props => {
  const {rid,sno} =  props?.deletedata

  const handledelete = async () => {
     if(rid){
      const resp = await deleteRecipeIngredient(rid);
      if (resp?.status) {
        props?.onHide("delete", rid, "old");
      } 
     }else{
        props?.onHide("delete", sno, "new");
     }
  }

  return (
    <div className="delete-user-wrapper">
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          className="delete-ingredient-modal"
          centered
        >
            <Modal.Header className="heading text-center">
              Delete Ingredient
            </Modal.Header>

            <Modal.Body className="provide-feedback-body text-center">
              <div className="delete-acc-subheading font-medium-16">
                Are you sure you want to delete Ingredient?
              </div>

              <div className="delete-btn-wrapper">
                <Button
                  className="cancel-btn w-25"
                  variant="outline-primary rounded-pill"
                  onClick={() => props?.onHide()}
                >
                  Cancel
                </Button>
                <Button
                  className="save-btn w-25"
                  variant="primary rounded-pill"
                  onClick={() => handledelete()}
                >
                  Delete
                </Button>
              </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default DeleteIngredient
