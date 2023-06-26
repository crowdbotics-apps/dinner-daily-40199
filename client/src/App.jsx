import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.scss";
import AdminLogin from "./components/AdminLogin";
import AppRoutes from "./components/Routes";
import MainLayout from "./MainLayout";
import { checkLoginUser } from "./api/config";
import ResetPasssword from "./screens/Password-reset/ResetPassword";
import ResetPasswordStatus from "./screens/Password-reset/ResetPasswordStatus";
import EnterEmail from "./screens/Password-reset/EnterEmail";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(checkLoginUser());
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith("/auth")) return;
        if (checkLoginUser()) {
            setIsLoggedIn(true);
            userRouter();
        } else {
            navigate("/");
        }
    }, []);

    function userRouter() {
        if (location.pathname == "/") {
            navigate("/dashboard");
        } else {
            navigate(location.pathname);
        }
    }

    const authRoutes = () => {
        return (
            <Routes>
                <Route path="/auth">
                    <Route path="forgot-password" element={<EnterEmail />} />
                    <Route path="reset-password" element={<ResetPasssword />} />
                    <Route
                        path="reset-password/state"
                        element={<ResetPasswordStatus />}
                    />
                </Route>
            </Routes>
        );
    };

    const adminRoutes = () => {
        if (!checkLoginUser()) {
            return (
                <Routes>
                    <Route path="/" element={<AdminLogin />} />
                </Routes>
            );
        } else {
            return (
                <MainLayout isLoggedIn={isLoggedIn}>
                    <AppRoutes />
                </MainLayout>
            );
        }
    };

    return (
        <div className="App">
            {location.pathname.startsWith("/auth")
                ? authRoutes()
                : adminRoutes()}
        </div>
    );
};

export default App;
