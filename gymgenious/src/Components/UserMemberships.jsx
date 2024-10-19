import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import moment from 'moment'
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Popper from '@mui/material/Popper';
import {jwtDecode} from "jwt-decode";
import { useMediaQuery } from '@mui/material';
import Loader from '../real_components/loader.jsx'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';


export default function UserMemberships() {
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [salas, setSalas] = useState([]);
  const [showSalas, setShowSalas] = useState(false);
  const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
  const [salaAssigned, setSala] = useState(null); 
  const [name, setName] = useState('');
  const [maxNum,setMaxNum] = useState(1);
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState('')
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [failureErrors, setFailureErrors] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const [type, setType] = useState(null);
  const [myMembership, setMyMembership] = useState(false);

  const handleChangeMyMembership = () => {
    setMyMembership(!myMembership);
  };

  const ComponenteBotonCreateMembership = () => {
    return (
      <>
      {isSmallScreen ? (
          <div className="grid-container">
            <button className="draw-outline-button-small">Acquire</button>
          </div>
      ) : (
          <div className="grid-container">
            <CreateClass>Acquire</CreateClass>
          </div>
      )}
      </>
    );
  };

  const ComponenteBotonEditMembership = () => {
    return (
      <>
      {isSmallScreen ? (
          <div className="grid-container">
            <button className="draw-outline-button-small">Edit Membership</button>
          </div>
      ) : (
          <div className="grid-container">
            <CreateClass>Edit Membership</CreateClass>
          </div>
      )}
      </>
    );
  };
  
  const CreateClass = ({ children, ...rest }) => {
    return (
      <button {...rest} className="draw-outline-button">
        <span>{children}</span>
        <span className="top" />
        <span className="right" />
        <span className="bottom" />
        <span className="left" />
    </button>
    );
  };

  const validateForm = () => {
      let errors = [];
      

      setErrors(errors);
      return errors.length === 0;
  }

  const handleComeBack = (e) => {
    setShowSalas(false);
  };

  const verifyToken = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setErrorToken(true);
        setTimeout(() => {
          setErrorToken(false);
        }, 3000);
        throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token);
    } else {
        navigate('/');
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
      fetchUser();
    }
  }, [userMail]);

  const fetchUser = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
      //const response = await fetch(`http://127.0.0.1:5000/get_unique_user_by_email?mail=${encodedUserMail}`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        setType(data.type);
        if(data.type!='client'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const ComponentViewMemberships = () => {
    return (
        <div className='class-creation-container'>
            <div className='class-creation-content'>
            <h2 style={{color:'#424242'}}>Acquire Membership</h2>
                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                    <div className="input-small-container" style={{width:"100%", marginBottom: '0px'}}>
                        <label htmlFor="permanent" style={{color:'#424242'}}>Type:</label>
                        <select
                            id="permanent" 
                            name="permanent" 
                            value={permanent} 
                            onChange={(e) => setPermanent(e.target.value)} 
                        >
                            <option value="" >Select</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>
                <ComponenteBotonCreateMembership/>
                <button onClick={handleChangeMyMembership}>view my membership</button>
            </div>
        </div>
    )
  }

  const ComponentMyMembership = () => {
    return (
        <div className='class-creation-container'>
            <div className='class-creation-content'>
            <h2 style={{color:'#424242'}}>My Membership</h2>
                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                    <div className="input-small-container" style={{width:"100%", marginBottom: '0px'}}>
                        <p>my membership</p>
                        <p>months remaining</p>
                    </div>   
                </div>
                <button>cancel my membership</button>
                <button onClick={handleChangeMyMembership}>upgrade</button>
            </div>
        </div>
    )
  }

  return (
    <div className='full-screen-image-2'>
      {type!='client' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
            <LeftBar/>
            {!myMembership ? (
                <ComponentViewMemberships/>
            ) : (
                <ComponentMyMembership/>
            )}
           
          </>
      )}
      {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <Loader></Loader>
                </Backdrop>
            ) : null}
            { success ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                          <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                              Class successfully created!
                          </Alert>
                          </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            { failureErrors ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failureErrors} mountOnEnter unmountOnExit>
                        <div>
                            <Alert severity="error" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                            Error creating class!
                            </Alert>
                            {errors.length > 0 && errors.map((error, index) => (
                            <Alert key={index} severity="info" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                                <li>{error}</li>
                            </Alert>
                            ))}
                        </div>
                        </Slide>
                    </Box>
                    </div>
                </div>
              
            ) : (
                null
            )}
            { failure ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Error creating class. Try again!</Alert>
                        </Slide>
                    </Box>
                </div>
            </div>
            ) : (
                null
            )}
            { errorToken ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                                Invalid Token!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
    </div>
  );
}