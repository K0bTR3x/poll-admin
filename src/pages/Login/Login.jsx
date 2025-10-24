import React, { useState, useEffect } from "react";
import "./Login.scss";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice/AuthSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { token, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) navigate("/dashboard");
    }, [token, navigate]);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Düzgün e-poçt ünvanı daxil edin")
            .required("E-poçt tələb olunur"),
        password: Yup.string().required("Şifrə tələb olunur"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(loginUser(values)).unwrap();
            toast.success("Daxil olundu");
            navigate("/dashboard");
        } catch (err) {
            toast.error("E-poçt və ya şifrə yanlışdır");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <Toaster position="top-right" />
            <div className="login-box">
                <div className="login-form-side">
                    <div className="login-card">
                        <h2>Xoş Gəlmisiniz!</h2>
                        <p>Şəxsi məlumatlarınızı daxil edin</p>
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Field type="email" name="email" placeholder="E-poçt" />
                                    <ErrorMessage
                                        name="email"
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

                                    <button type="submit" disabled={isSubmitting || loading}>
                                        {isSubmitting || loading ? "Daxil olunur..." : "Daxil ol"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
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
