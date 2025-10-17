import React, { useState } from "react";
import "./Login.scss";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("İstifadəçi adı tələb olunur"),
        password: Yup.string().required("Şifrə tələb olunur"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("API_URL:", API_URL);
            const res = await axios.get(`${API_URL}/users?username=${values.username}`);
            const user = res.data[0];

            if (!user) {
                toast.error("İstifadəçi tapılmadı");
                return;
            }

            if (user.password !== values.password) {
                toast.error("Şifrə yanlışdır");
                return;
            }
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Xəta baş verdi, yenidən cəhd edin");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="login-box">
                <div className="login-form-side">
                    <div className="login-card">
                        <h2>Xoş Gəlmisiniz !</h2>
                        <p>Şəxsi Məlumatlarınızı daxil edin</p>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Field
                                        type="text"
                                        name="username"
                                        placeholder="İstifadəçi adı"
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="formik-error red-error"
                                    />

                                    <div className="password-wrapper">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Şifrə"
                                        />
                                        <span
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                        </span>
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="formik-error red-error"
                                    />

                                    <button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Daxil olunur..." : "Daxil Ol"}
                                    </button>
                                </Form>
                            )}
                        </Formik>

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
