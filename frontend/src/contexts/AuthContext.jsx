import { createContext, useContext, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import httpstatus from "http-status";

export const AuthContext = createContext({});

const client = axios.create({
    // baseURL:"http://192.168.1.171:4000/api/v1/users
    baseURL: "https://22615a6419e3.ngrok-free.app/api/v1/users"
})
export const AuthProvider = ({children})=>{
    const usercontext =  useContext(AuthContext);

    const [userData,setUserData] = useState(AuthContext)

    const router = useNavigate();
    const handleregister = async (name,username,password) => {
        try {   
            let request = await client.post("/register",{
                name: name,
                username:username,
                password:password
            })
            if (request.status=== httpstatus.CREATED){
                return request.data.message;
            }
        } catch (err){
            throw err;
        }
    }

    const handlelogin = async (username,password) => {
        try {   
            let request = await client.post("/login",{
                username:username,
                password:password
            })
            if (request.status=== httpstatus.OK){
                localStorage.setItem("token",request.data.token)
                router("/home")
                // return request.data.message;
            }
        } catch (err){
            throw err;
        }
    }

    const data ={
        userData,setUserData,handleregister,handlelogin
    }

    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
