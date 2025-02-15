import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';
import { green } from '@mui/material/colors';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const oobCode = query.get('code');
    const auth = getAuth();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPasswordRepeated, setErrorPasswordRepeated] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [openPasswordRequirements2, setOpenPasswordRequirements2] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPasswordRequirements, setOpenPasswordRequirements] = useState(false);
    const id = openPasswordRequirements ? 'simple-popper' : undefined;
    const id2 = openPasswordRequirements2 ? 'simple-popper' : undefined;

    useEffect(() => {
      if (!oobCode) {
        navigate('/');
      }
    }, [oobCode, navigate]);
    
    const validateForm = () => {
      let errors = [];
      const hasNumber = /[0-9]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isValidLength = password.length > 7;
      const samePasswords = password == passwordAgain;

      if(!(hasNumber && hasLowerCase && hasUpperCase && hasSpecialChar && isValidLength)){
        setErrorPassword(true);
      } else {
        setErrorPassword(false);
      }
      if (!samePasswords) {
        errors.push('Passwords must be the same.');
        setErrorPasswordRepeated(true);
      } else {
        setErrorPasswordRepeated(false);
      }
      return errors.length === 0;
    }
    
    const handleResetPassword = async () => {
      setOpenCircularProgress(true);
        try {
          await confirmPasswordReset(auth, oobCode, password);
          setOpenCircularProgress(false);
          setSuccess(true);
          setTimeout(() => {
              setSuccess(false);
              navigate('/login');
              }, 3000);
        } catch (error) {
          console.error('Password reset error:', error);
          setOpenCircularProgress(false);
          setFailure(true);
          setTimeout(() => {
              setFailure(false);
              }, 3000);
        }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if(validateForm()){
        handleResetPassword();
      }
    }

    const handleOpenPasswordRequirements = (event) => {
      if (openPasswordRequirements) {
          setAnchorEl(null); 
      } else {
          setAnchorEl(event.currentTarget); 
      }
      setOpenPasswordRequirements(!openPasswordRequirements);
    };  

    const handleOpenPasswordRequirements2 = (event) => {
      if (openPasswordRequirements2) {
          setAnchorEl2(null); 
      } else {
          setAnchorEl2(event.currentTarget); 
      }
      setOpenPasswordRequirements2(!openPasswordRequirements2);
    };
 
    const handleClosePasswordRequirements = () => {
      setOpenPasswordRequirements(false);
    };

    const handleClosePasswordRequirements2 = () => {
      setOpenPasswordRequirements2(false);
    };

        const [colorHasNumber, setColorHasNumber] = useState('red');
        const [colorHasLowerCase, setColorHasLowerCase] = useState('red');
        const [colorHasUpperCase, setColorHasUpperCase] = useState('red');
        const [colorHasSpecialChar, setColorHasSpecialChar] = useState('red');
        const [colorIsValidLength, setColorIsValidLength] = useState('red');
        const [colorSamePassword, setColorSamePassword] = useState('red');
        useEffect(() => {
            const hasNumber = /[0-9]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasUpperCase = /[A-Z]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const isValidLength = password.length > 7;
            if(hasNumber){
                setColorHasNumber('green');
            } else {
                setColorHasNumber('red');
            }
            if(hasLowerCase){
                setColorHasLowerCase('green');
            } else {
                setColorHasLowerCase('red');
            }
            if(hasUpperCase){
                setColorHasUpperCase('green');
            } else {
                setColorHasUpperCase('red');
            }
            if(hasSpecialChar){
                setColorHasSpecialChar('green');
            } else {
                setColorHasSpecialChar('red');
            }
            if(isValidLength){
                setColorIsValidLength('green');
            } else {
                setColorIsValidLength('red');
            }
        
        }, [password]);

    useEffect(() => {
      if(password!=passwordAgain){
        setColorSamePassword('red');
      } else {
        setColorSamePassword('green')
      }
    }, [passwordAgain, password])

    return (
    <div className='App'>
          <>
        <LeftBar value={'profile'}/>
        <div className='new-password-container'>
          <div className='new-password-content'>
            <h2>Reset password</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-container" onClick={handleClosePasswordRequirements2}>
                  <label htmlFor="password">Password:</label>
                  <input
                      onClick={handleOpenPasswordRequirements}
                      type="password" 
                      id="password" 
                      name="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                  />
                  <Popper id={id} open={openPasswordRequirements} anchorEl={anchorEl} sx={{maxWidth: '98%'}}>
                      <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenPasswordRequirements}>
                          <p style={{color:colorIsValidLength}}>The password must contain more than 8 characters.</p>
                          <p style={{color:colorHasNumber}}>The password must contain at least 1 number.</p>
                          <p style={{color:colorHasLowerCase}}>The password must contain at least 1 lowercase letter.</p>
                          <p style={{color:colorHasUpperCase}}>The password must contain at least 1 uppercase letter.</p>
                          <p style={{color:colorHasSpecialChar}}>The password must contain at least 1 special character.</p>
                      </Box>
                  </Popper>
                {errorPassword && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a valid password</p>)}
              </div>
              <div className="input-container" onClick={handleClosePasswordRequirements}>
                  <label htmlFor="passwordAgain">Confirm password:</label>
                  <input
                      onClick={handleOpenPasswordRequirements2}
                      type="password" 
                      id="passwordAgain" 
                      name="passwordAgain" 
                      value={passwordAgain} 
                      onChange={(e) => setPasswordAgain(e.target.value)} 
                  />
                  <Popper id={id2} open={openPasswordRequirements2} anchorEl={anchorEl2}>
                        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenPasswordRequirements2}>
                            <p style={{color:colorSamePassword}}>Passwords must be the same</p>
                        </Box>
                    </Popper>
                    {errorPasswordRepeated && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Passwords are not equal</p>)}
                </div>
              <button type="submit" className='button_create_account' style={{width: isSmallScreen ? '70%' : '40%'}}>
                  Confirm new password
              </button>
            </form>
          </div>
        </div>
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
                              Password reset successfully 
                            </Alert>
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
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Password reset error</Alert>
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
}
