import React, {useContext, useState} from 'react'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext.js'
import './Signin.css'

function Signin(){
    const [email, setEmail] = useState("")

    const [error, setError] = useState("");
    const [password, setPassword] = useState("");

    const { dispatch } = useContext(AuthContext)

    const API_URL =process.env.REACT_APP_API_URL

    const loginCall = async (userCredential, dispatch) =>{
        dispatch({type: "LOGIN_START"});
        try{
            const res = await axios.post(API_URL+"api/auth/signin", userCredential);
            dispatch({type: "LOGIN_SUCCESS", payload: res.data});
            alert("Đăng nhập thành công!!")
        }
        catch (err){
            dispatch({type: "LOGIN_FAILURE", payload: err});
            setError("Sai mật khẩu hoặc tên đăng nhập");
        }
    }

    const handleForm = (e) =>{
        e.preventDefault();
        loginCall({email,password}, dispatch);
    }

    return (
        <div className='signin-container'>
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title">Đăng nhập</h2>
                    <p className="line"></p>


                    <div className="error-message">
                        <p>
                            {error}
                        </p>
                    </div>

                    <div className="signin-fields">
                        <label > <b>Email</b></label>
                        <input 
                            type="email" 
                            placeholder="Nhập Email"
                            name="email"
                            className="signin-textbox" 
                            required
                            onChange={e=> {setEmail(e.target.value) ; setError("")}}            
                        />

                        <label htmlFor="password"><b>Mật khẩu</b></label>
                        <input 
                        type="password" 
                        className="signin-textbox"
                        minLength='6'
                        placeholder='Nhập mật khẩu'
                        name='psw'
                        required
                        onChange={e => setPassword(e.target.value)}
                        />

                    </div>

                    <button className="signin-button">
                        Đăng nhập
                    </button>

                    <a href="#" className="forget-pass">Bạn quên mật khẩu?</a>


                </form>
                <div className='signup-option'> 
                    <p className="signup-question">Bạn chưa có tài khoản? <a href="/signup" className="forget-pass">Đăng ký ngay</a></p>
                </div>
            </div>
        </div>


    )






}


export default Signin;