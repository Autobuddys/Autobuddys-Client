import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';


export default function useFindUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() =>{
        async function findUser() {
        await axiosInstance.post('verify/')
        .then(res => {
            setUser(res.data);
            // console.log("userdaat: ",res.data)
            setLoading(false);
        }).catch((err) => {
            // console.log("usefinduser err: ",err);
            setLoading(false);
        });
           
        // console.log("useFindUser : ",user)

        }
        
        findUser();  
    }, []);
    
    return {
        user,
        setUser,
        isLoading
    }
}