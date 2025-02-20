import '../App.css';
import { useLocation } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';  
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert'; 
import verifyToken from '../fetchs/verifyToken';
import { useMediaQuery } from '@mui/material';
import { auth } from '../firebase-config.js';
import { useNavigate } from 'react-router-dom';
import {signInWithEmailAndPassword } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import Loader from '../real_components/loader.jsx';
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import fetchUser from '../fetchs/fetchUser.jsx';

const MarkAttendance = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const [errorClass, setErrorClass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successLecture,setSuccessLecture] = useState(false)
  const [logeedIn, setLogin] = useState(false)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newToken,setNewToken] = useState(null)
  const params = new URLSearchParams(location.search);
  const [userMail,setUserMail] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const token = params.get("token");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const auth = getAuth();
  const [type, setType] = useState(null);

  useEffect(() => {
    const registerAttendance = async (user) => {
      console.log(type)
      if(type==='client'){
        if (!user) {
          setError("You must login to register assistance");
          setLoading(false);
          return;
        }
  
        if (type!='client') {
          setError('You must be a client to register assistance');
          setLoading(false);
          navigate('/');
          return;
        }
    
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          console.error("Token no disponible en localStorage");
          return;
        }
    
        const formData = new FormData();
        formData.append("timestamp", new Date().toISOString());
        formData.append("uid", user.uid);
    
        try {
          const response = await fetch("https://two024-duplagalactica.onrender.com/mark-attendance", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          });
    
          if (!response.ok) {
            throw new Error("Error al agregar la asistencia al gym " + response.statusText);
          }
          const data = await response.json();
          setSuccessLecture(true);
          setOpenCircularProgress(false);
          setTimeout(()=>{
            navigate('/')
          },2000)
          
          
        } catch (error) {
          console.error(error);
        }
      } else {
        setTimeout(()=>{
          setError('You must be a client to register assistance');
          setLoading(false);
          setTimeout(() => {
            navigate('/');
          }, 3000)
        }, 7500)
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUser(setType,setOpenCircularProgress,user.email,navigate,setError);
      if (user) {
        registerAttendance(user);
      }
    });
  
    return () => unsubscribe();
  }, [type]);

  return (
    <div className='full-screen-image-login'>
          { success ? (
            <div className='alert-container'>
              <div className='alert-content'>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                      <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                        Successful login!
                      </Alert>
                  </Slide>
                </Box>
              </div>
            </div>
          ) : (
            null
          )}
      <>
        { errorClass ? (
          <div className='alert-container'>
            <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Slide direction="up" in={errorClass} mountOnEnter unmountOnExit >
                    <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                      The user is not in this class
                    </Alert>
                </Slide>
              </Box>
            </div>
          </div>
        ) : (
          null
        )}
      {loading && (
        <Loader></Loader>
      )}
      {successLecture ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={successLecture} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                    Assistance checked correctly
                  </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      ) : error ? (
        <div className='alert-container'>
              <div className='alert-content'>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Slide direction="up" in={error} mountOnEnter unmountOnExit >
                        <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                            Error while checking assitance, please try again: {error}
                        </Alert>
                    </Slide>
                  </Box>
              </div>
        </div>
      ) : (
        null
      )}
        </>
    </div>
  );
};

export default MarkAttendance;