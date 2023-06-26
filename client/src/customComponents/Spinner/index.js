import React from "react"
import { Spinner } from "react-bootstrap"
import './spinner.scss';

const Loader = ({ loadingMsg }) => {
  return (
    <div className="spinner-container">
      <Spinner animation="border" role="status"></Spinner>
      <pre>{loadingMsg}</pre>
    </div>
  )
}

export default Loader
