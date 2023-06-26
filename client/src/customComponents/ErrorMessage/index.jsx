import React from "react"
import "./errormessage.scss"
// import svg from "../../assets/images/svg/index"

const ErrorMessage = ({ errormsg, touchedmsg }) => {
  return (
    <p className="error">
      {
        <>
          {/* {errormsg && touchedmsg && errormsg && (
            // <img
            //   src={svg?.ValidationError}
            //   className="validation_error"
            //   alt="validation error NP"
            // />
          )} */}
          <>{errormsg && touchedmsg && errormsg}</>
        </>
      }
    </p>
  )
}

export default ErrorMessage
