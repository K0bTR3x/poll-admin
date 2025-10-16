import React, { useState } from "react";
import "./Login.scss";
import logo from "../../assets/images/logo.png"; // logo faylını eyni qovluğa əlavə et
import { useNavigate } from "react-router";

const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/dashboard")
    };
    return (
        <div className="login-page">
            <div className="login-box">
                <div className="login-form-side">
                    <div className="login-card">
                        <h2>Xoş Gəlmisiniz !</h2>
                        <p>Şəxsi Məlumatlarınızı daxil edin</p>
                        <form onSubmit={handleSubmit}>
                            <input type="email" placeholder="Email" required />
                            <input type="password" placeholder="Şifrə" required />
                            <button type="submit">Daxil Ol</button>
                        </form>
                        <a href="#" className="forgot">
                            Şifrəni unutmusunuz?
                        </a>
                    </div>
                </div>

                <div className="login-logo-side">
                    <img src={logo} alt="Company Logo" />
                </div>
            </div>
        </div>
    );
};

export default Login;
