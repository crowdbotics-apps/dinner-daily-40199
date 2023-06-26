import React from "react";
import './header.scss';
import { getLoginId } from "../../api/config";

const Header = () =>{
    return(
        <div className="admin-header">
            {getLoginId(true)}
        </div>
    )
}

export default Header;