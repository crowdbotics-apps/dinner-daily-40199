import React from "react"

const ErrorMsg = ({errormsg}) => {
  return (
    <div className="alert alert-danger mt-4" role="alert">
     {errormsg}
    </div>
  )
}

export default ErrorMsg
