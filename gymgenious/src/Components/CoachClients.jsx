import React, {useState, useEffect} from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CustomTable from '../real_components/Table3columns.jsx';
import verifyToken from '../fetchs/verifyToken.jsx'
import fetchUser from '../fetchs/fetchUser.jsx'
import fetchAssistance from '../fetchs/fetchAssistance.jsx';
import QrCodeIcon from '@mui/icons-material/QrCode';
import Button from '@mui/material/Button';
import { QRCodeCanvas } from "qrcode.react";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import CloseIcon from '@mui/icons-material/Close';


function CouchClasses() {
  const [userMail,setUserMail] = useState(null)
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const [newRows, setNewRows] = useState([]);
  const [openQr, setOpenQr] = useState(false);
  const isSmallScreen700 = useMediaQuery('(max-width:700px)');
  const [screenWidth, setWidth] = useState(window.innerWidth);

  const handleOpenQr = () => {
    setOpenQr(true);
  };

  const handleCloseQr = () => {
    setOpenQr(false);
  };

  useEffect(() => {
    if (type!='coach' && type!=null) {
    navigate('/');      
    }
  }, [type]);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken)
    } else {
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser(setType,setOpenCircularProgress,userMail,navigate,setWarningConnection)
    }
  }, [userMail]);

  useEffect(() => {
    if(type==='coach' && userMail!=null){
        fetchAssistance(setOpenCircularProgress,setNewRows,setWarningConnection,userMail)
    }
  }, [type])

  const handleSelectEvent = () => {
    return
  }
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const EventQRCode = () => {
    const token = localStorage.getItem('authToken');
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseQr}>
          <MDBContainer style={{display:'flex'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5" style={{width:'40%'}}>
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black" sx={{justifyContent:'center',alignContent:'center'}}>
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>Assistance for </MDBTypography>
                    </div>
                    <div style={{justifyContent:'center',alignContent:'center',width:'60%',position:'relative'}}>
                    <QRCodeCanvas value={`https://2024-duplagalactica.vercel.app/mark-attendance`} size={screenWidth*0.2} />
                    </div>
                    <button 
                        onClick={handleCloseQr}
                        className="custom-button-go-back-managing"
                        style={{
                          zIndex: '2',
                          position: 'absolute', 
                          top: '1%',
                          left: isSmallScreen700 ? '88%' : '90%',
                        }}
                      >
                        <CloseIcon sx={{ color: '#F5F5F5' }} />
                      </button>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </div>
    );
  };

  return (
    <div className="App">
        {warningConnection ? (
            <div className='alert-container'>
                <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningConnection} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Connection Error. Try again later!
                            </Alert>
                        </Slide>
                    </Box>
                </div>
            </div>
        ) : (
            null
        )}
          <>
        <NewLeftBar/>
        <div className='input-container-buttons' style={{left: '7vh', position: 'absolute', top: '0.5%'}}>
          <div className='input-small-container-buttons'>
            <Button
              style={{
                  backgroundColor: '#48CFCB',
                  borderRadius: '50%',
                  width: '5vh',
                  height: '5vh',
                  minWidth: '0',
                  minHeight: '0',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              }}
              onClick={handleOpenQr}
              >
              <QrCodeIcon sx={{ color: 'light green' }} />
            </Button>
          </div>
        </div>
        {openQr && (
            <div className="Modal" style={{zIndex:'1001'}}>
            <EventQRCode/>
            </div>
        )}
        {openCircularProgress ? (
            <Backdrop open={openCircularProgress} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <Loader></Loader>
            </Backdrop>
        ) : (
            null
        )}
        
        {errorToken ? (
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
        {newRows && (
              <CustomTable columnsToShow={['Assisted class','Assisted date','Student','There are users that take assist to your classes']} data={newRows} handleSelectEvent={handleSelectEvent} vals={['className','fecha','MailAlumno']}/> 
        )}
        </>

    </div>
    
  );
}

export default CouchClasses;
