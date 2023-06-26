import React from "react"

const SuccessMsg = ({successmsg}) => {
  return (
    <div className="alert alert-success mt-4" role="alert">
     {successmsg}
    </div>
  )
}

export default SuccessMsg