import { useState } from 'react'
import { registerApi } from '../services/registerApi';
import { isAuthenticated } from '../services/Auth';
import './RegisterPage.css'
import { Link, Navigate } from 'react-router-dom';

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

    const [loading,setLoading]  =  useState(false);

    const handleSubmit = (event)=>{
        event.preventDefault();
        let errors =initialStateErrors; 
        let hasError = false; 
        if (inputs.firstname === "") {
            errors.firstname.required =true;
            hasError=true;
        }
        if (inputs.lastname === "") {
            errors.lastname.required =true;
            hasError=true;
        }
        if (inputs.job === "") {
            errors.job.required =true;
            hasError=true;
        }
        if (inputs.streetAddress === "") {
            errors.streetAddress.required =true;
            hasError=true;
        }
        if (inputs.city === "") {
            errors.city.required =true;
            hasError=true;
        }
        if (inputs.state === "") {
            errors.state.required =true;
            hasError=true;
        }
        if (inputs.country === "") {
            errors.country.required =true;
            hasError=true;
        }
        if (inputs.postalCode === "") {
            errors.postalCode.required =true;
            hasError=true;
        }
        if (inputs.email === "") {
            errors.email.required =true;
            hasError=true;
        }
        if (inputs.password === "") {
            errors.password.required =true;
            hasError=true;
        }

        if (!hasError) {
            setLoading(true)
            //sending register api request
            registerApi(inputs).then((response)=>{
                console.log(response);
            }).catch((err) => {
                console.log(err);
               if(err.response.data.error === "Email Already Exists"){
                    setErrors({...errors,custom_error:"Already this email has been registered!"})
               }
            setErrors({ ...errors, custom_error: err.response.data.error });

            }).finally(()=>{
                setLoading(false)
            })
        }
        console.log(initialStateErrors,errors);
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

    if (isAuthenticated()) {
        return <Navigate to="/dashboard" />
    }
    
    return (
        <div>
            <section className="register-block">
                <div className="container">
                <div className="row ">
                    <div className="col register-sec">
                        <h2 className="text-center">Register Now</h2>
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
            
                            <input type="text"  className="form-control" onChange={handleInput} name="email" id=""  />
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