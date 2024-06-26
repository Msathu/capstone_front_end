import { useState } from 'react'
import { registerApi } from '../services/registerApi';
import './RegisterPage.css'
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';

export default function RegisterPage(){
    const initialStateErrors = {
        email:{required:false},
        password:{required:false},
        firstname: { required: false },
        lastname: { required: false },
        job: { required: false },
        streetAddress: { required: false },
        city: { required: false },
        state: { required: false },
        country: { required: false },
        postalCode: { required: false },
        apartmentNumber: {required: false},
        custom_error:null
    };
    const [errors,setErrors] = useState(initialStateErrors);

    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const handleSubmit = async (event)=>{
        event.preventDefault();
        let errors = { ...initialStateErrors }; 
        let hasError = false; 

        Object.keys(inputs).forEach((key) => {
            if (inputs[key] === "" && key !== "apartmentNumber") {
                errors[key].required = true;
                hasError = true;
            }
        });

        if (!hasError) {
            setLoading(true);
            try {
                const response = await registerApi(inputs);
                if (response.status === 200) {
                    messageApi.open({
                        type: 'success',
                        content: response.data.msg,
                    });
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } catch (err) {
                if (err.response.data.error === "Email Already Exists") {
                    errors.custom_error = "This email is already registered!";
                } else {
                    errors.custom_error = err.response.data.error;
                }
            } finally {
                setLoading(false);
            }
        }

        setErrors(errors);
    }

    const [inputs,setInputs] = useState({
        email:"",
        password:"",
        firstname: "",
        lastname: "",
        job: "",
        streetAddress: "",
        city: "",
        state: "",
        country:"",
        postalCode: "",
        apartmentNumber:"",
    })

    const handleInput = (event)=>{
        setInputs({...inputs,[event.target.name]:event.target.value})
    }
    
    return (
        <div>
            <section className="register-block">
                <div className="container">
                <div className="row ">
                        <div className="col register-sec">
                            <h2 className="text-center">Register Now</h2>
                            {contextHolder}
                        <form onSubmit={handleSubmit} className="register-form" action="" >
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase"> First Name</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="firstname" id=""  />
                        { errors.firstname.required?
                            (<span className="text-danger" >
                                    First Name is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Last Name</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="lastname" id=""  />
                        { errors.lastname.required?
                            (<span className="text-danger" >
                                    Last Name is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Profession</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="job" id=""  />
                        { errors.job.required?
                            (<span className="text-danger" >
                                    Profession is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Country</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="country" id=""  />
                        { errors.country.required?
                            (<span className="text-danger" >
                                    Country is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Street Address</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="streetAddress" id=""  />
                        { errors.streetAddress.required?
                            (<span className="text-danger" >
                                    Street Address is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">City</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="city" id=""  />
                        { errors.city.required?
                            (<span className="text-danger" >
                                    City is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">State</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="state" id=""  />
                        { errors.state.required?
                            (<span className="text-danger" >
                                    State is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Postal Code</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="postalCode" id=""  />
                        { errors.postalCode.required?
                            (<span className="text-danger" >
                                    Postal Code is required.
                                </span>):null
                            }
                                </div>
                                <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Apartment Number (optional)</label>
            
                            <input type="text" className="form-control" onChange={handleInput} name="apartmentNumber" id=""  />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1"  className="text-uppercase">Email</label>
            
                            <input type="email"  className="form-control" onChange={handleInput} name="email" id=""  />
                            { errors.email.required?
                            (<span className="text-danger" >
                                Email is required.
                            </span>):null
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                            <input  className="form-control" type="password" onChange={handleInput}  name="password" id="" />
                            { errors.password.required?
                            (<span className="text-danger" >
                                Password is required.
                            </span>):null
                            }
                        </div>
                        <div className="form-group">
            
                            <span className="text-danger" >
                            { errors.custom_error?
                            (<p>{errors.custom_error}</p>)
                            :null
                            }
                            </span>
                            {loading ?
                            (<div  className="text-center">
                                <div className="spinner-border text-primary " role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>):null
                            }
            
                            <input type="submit" className="btn btn-login float-right" disabled={loading}  value="Register" />
                        </div>
                        <div className="clearfix"></div>
                        <div className="form-group">
                        Already have account ? Please <Link to="/login">Login</Link>
                        </div>
            
            
                        </form>
            
            
                    </div>
            
                </div>
            
            
                </div>
            </section>    
        </div>
        )
}