import {Col, Row } from "react-bootstrap"
import Sidenav from "./components/Sidenav"
import Header from "./screens/Header"

const MainLayout = (props) => {
    
    return (
        <>
            <Row>
                <Header />
            </Row>
            <Row>
                <Col md={2} lg={2}>
                    <Sidenav />
                </Col>
                <Col md={10} lg={10}>
                    {props?.children}
                </Col>
            </Row>
        </>
    )
}

export default MainLayout