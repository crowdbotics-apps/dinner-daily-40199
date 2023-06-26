import React from "react"
import { Container } from "react-bootstrap"

const NotFound = () => {
  return (
    <Container className="h-100vh d-flex justify-content-center align-items-center" style={{backgroundColor: 'snow'}}>
      <div className="text-danger text-center">
        <h1>ERROR 404</h1>
        <h1>Page Not Found</h1>
      </div>
    </Container>
  )
}

export default NotFound
