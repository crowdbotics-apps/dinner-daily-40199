import React from "react"
import { NavLink } from "react-router-dom"
import svg from "../../assets/images/svg/index"
import { useNavigate } from "react-router-dom"
// import Logout from "../Logout"
import "./sidenav.scss"

const Sidenav = () => {
 // const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  // const hideModal = () => {
  //   setShowPopup(false)
  // }

  const handleLogout= () => {
    //setShowPopup(true)
    localStorage.removeItem("user")
    navigate("/");
  }

  return (
    <>
      <div className="sidenavbar">
        <nav>
          <ul>
            <li>
              <NavLink to="/dashboard" activeclassname="active">
                <img
                  src={svg?.admindashboard}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/internal-users" activeclassname="active">
                <img
                  src={svg?.user}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Internal User
              </NavLink>
            </li>
            

            {/* <li>
              <NavLink to="/subscribedusers" activeclassname="active">
                <img
                  src={svg?.subscribedusers}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Subscribed User
              </NavLink>
            </li> */}

            <li>
              <NavLink to="/notifications" activeclassname="active">
                <img
                  src={svg?.notifications}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Notifications
              </NavLink>
            </li>

            <li>
              <NavLink to="/uploadcontent" activeclassname="active">
                <img
                  src={svg?.uploadcontent}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Upload Content
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                exact="true"
                to="/feedback"
                activeclassname="active"
              >
                <img
                  src={svg?.feedback}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Feedback
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink to="/subscription" activeclassname="active">
                <img
                  src={svg?.subscription}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Subscription
              </NavLink>
            </li> */}

            <li>
              <NavLink to="/database" activeclassname="active">
                <img
                  src={svg?.database}
                  className="settings-icon"
                  alt="settings icon np"
                />{" "}
                Database
              </NavLink>
            </li>

            <li>
              <span
                onClick={handleLogout}
                className="logout"
              >
                <img
                  src={svg?.logout}
                  className="logout-icon"
                  alt="logout icon np"
                />{" "}
                Log out
              </span>
            </li>
          </ul>
        </nav>

        {/* {showPopup && <Logout show={showPopup} onHide={hideModal} />} */}
      </div>
    </>
  )
}

export default Sidenav
