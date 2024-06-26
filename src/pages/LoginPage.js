import './LoginPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../services/loginApi';
import { message } from 'antd';
import { login } from "../services/Storage";
import { isAuthenticated } from '../services/Auth';

export default function LoginPage() {

    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null
    };
    const [errors, setErrors] = useState(initialStateErrors);
    
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    })
    const handleInput = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = { ...initialStateErrors }; 
        let hasError = false;

        Object.keys(inputs).forEach((key) => {
            if (inputs[key] === "") {
                errors[key].required = true;
                hasError = true;
            }
        });
       
        if (!hasError) {
            setLoading(true)
            loginApi(inputs).then((response) => {
                if (response.status === 200) {
                    login(response.data.accessToken, response.data.userId);
                    messageApi.open({
                        type: 'success',
                        content: response.data.msg,
                    });
                    setTimeout(() => {
                        if (isAuthenticated) {
                            navigate('/dashboard');
                        }
                    }, 2000);
                }
            }).catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: err.response.data.error,
                  });
            }).finally(() => {
                setLoading(false);
            })
            }
            setErrors({ ...errors });
        }

        return (
            <div>
                <section className="login-block">
                    <div className="container">
                        <div className="row ">
                            <div className="col login-sec">
                                <h2 className="text-center">Login Now</h2>
                                {contextHolder}
                                <form onSubmit={handleSubmit} className="login-form" action="">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                        <input type="email" className="form-control" onChange={handleInput} name="email" id="" placeholder="email" />
                                        {errors.email.required ?
                                            (<span className="text-danger" >
                                                Email is required.
                                            </span>) : null
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                        <input className="form-control" type="password" onChange={handleInput} name="password" placeholder="password" id="" />
                                        {errors.password.required ?
                                            (<span className="text-danger" >
                                                Password is required.
                                            </span>) : null
                                        }
                                    </div>
                                    <div className="form-group">
                                        {loading ?
                                            (<div className="text-center">
                                                <div className="spinner-border text-primary " role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>) : null
                                        }
                                        <span className="text-danger" >
                                            {errors.custom_error ?
                                                (<p>{errors.custom_error}</p>)
                                                : null
                                            }
                                        </span>
                                        <input type="submit" className="btn btn-login float-right" disabled={loading} value="Login" />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        Create new account ? Please <Link to="/register">Register</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }