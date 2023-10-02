import React from "react";
import { Outlet } from "react-router-dom";
import AuthFooter from "./footer/Authfooter";
import AuthNavbar from "./navbar/Authnavbar";

const Auth = () => {
    return (
        <React.Fragment>
            <AuthNavbar />
            <Outlet />
            <AuthFooter /> 
        </React.Fragment>
    );
}
export default Auth;