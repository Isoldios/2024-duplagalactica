import {jwtDecode} from "jwt-decode";
import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ExitToApp from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import SportsIcon from '@mui/icons-material/Sports';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState('')
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState(null)
  const goToMainPage = () => navigate('/');
  const goToLogin = () => navigate('/login');
  const goToUserProfile = () => navigate('/user-profile');
  const goToClassCreation = () => navigate('/class-creation');
  const goToManageRoutines = () => navigate('/managing-routines');
  const goToCouchClasses = () => navigate('/couch-classes');
  const goToBookedClasses = () => navigate('/user-classes');
  const goToLogout = () => navigate('/logout');
  const goToUserRoutines = () => navigate('/user-routines');
  const goToCoachRoutines = () => navigate('/coach-routines');
  const goToCoachClasses = () => navigate('/coach-exercises');
  const goToAllRoutines = () => navigate('/all-routines');
  const goToTopRoutines = () => navigate('/top-routines');

  const navigateTo = (index) => {
    const routes = [
      goToMainPage,
      goToUserProfile,
      goToClassCreation,
      goToCouchClasses,
      goToManageRoutines,
      goToCoachClasses,
      goToCoachRoutines,
      goToAllRoutines,
      goToTopRoutines,
      goToLogout,
    ];
    routes[index]();
  };

  const navigateFromUserTo = (index) => {
    const routes = [
      goToMainPage,
      goToUserProfile,
      goToBookedClasses,
      goToUserRoutines,
      goToTopRoutines,
      goToLogout,
    ];
    routes[index]();
  };

  const navigateToNotLogged = (index) => {
    if (index === 0) goToMainPage();
    else if (index === 1) goToLogin();
  };

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const DrawerListNotauthenticated = (
    <Box sx={{ width: 250, background: '#FEFAE0' }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Login'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigateToNotLogged(index)}>
              <ListItemIcon>
                {index === 0 && <HomeIcon sx={{ color: '#BC6C25' }} />}
                {index === 1 && <PersonIcon sx={{ color: '#BC6C25' }} />}
              </ListItemIcon>
              <ListItemText primary={text} primaryTypographyProps={{ sx: { color: '#BC6C25', fontWeight: 'bold' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const DrawerListCoach = (
    <Box sx={{ width: 250, background: '#FEFAE0' }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Profile', 'Create class', 'My classes', 'Managing', 'Exercises', 'My routines', 'All routines', 'Top routines', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigateTo(index)}>
              <ListItemIcon>
                {index === 0 && <HomeIcon sx={{ color: '#BC6C25' }} />}
                {index === 1 && <PersonIcon sx={{ color: '#BC6C25' }} />}
                {index === 2 && <AddIcon sx={{ color: '#BC6C25' }} />}
                {index === 3 && <SportsGymnasticsIcon sx={{ color: '#BC6C25' }} />}
                {index === 4 && <SportsIcon sx={{ color: '#BC6C25' }} />}
                {index === 5 && <FitnessCenterIcon sx={{ color: '#BC6C25' }} />}
                {index === 6 && <DirectionsRunIcon sx={{ color: '#BC6C25' }} />}
                {index === 7 && <DirectionsRunIcon sx={{ color: '#BC6C25' }} />}
                {index === 8 && <DirectionsRunIcon sx={{ color: '#BC6C25' }} />}
                {index === 9 && <ExitToApp sx={{ color: '#BC6C25' }} />}
              </ListItemIcon>
              <ListItemText primary={text} primaryTypographyProps={{ sx: { color: '#BC6C25', fontWeight: 'bold' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );


  const DrawerListClient = (
    <Box sx={{ width: 250, background: '#FEFAE0' }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Profile', 'Booked classes', 'My routines', 'Top routines', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigateFromUserTo(index)}>
              <ListItemIcon>
                {index === 0 && <HomeIcon sx={{ color: '#BC6C25' }} />}
                {index === 1 && <PersonIcon sx={{ color: '#BC6C25' }} />}
                {index === 2 && <CheckIcon sx={{ color: '#BC6C25' }} />}
                {index === 3 && <SportsIcon sx={{ color: '#BC6C25' }} />}
                {index === 4 && <SportsIcon sx={{ color: '#BC6C25' }} />}
                {index === 5 && <ExitToApp sx={{ color: '#BC6C25' }} />}
              </ListItemIcon>
              <ListItemText primary={text} primaryTypographyProps={{ sx: { color: '#BC6C25', fontWeight: 'bold' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const fetchUser = async () => {
    try {
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        setType(data.type);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const isAuthenticated = localStorage.getItem('authToken');
  const verifyToken = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
      } catch (error) {
        console.error('Error al verificar el token:', error);
        throw error;
      }
    };
    
  useEffect(() => {
    let token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token)
    } else {
      console.error('No token found');
    }
  }, []);

  useEffect(() => {
    console.log(userMail)
    if (userMail) {
      fetchUser(); 
    }
  }, [userMail]);


  return (
    <div className='leftBar'>
      <Button
        onClick={toggleDrawer(true)}
        style={{
          backgroundColor: '#432818',
          borderRadius: '50%',
          top: '0.5vh',
          left: '0.5vh ',
          width: '5vh',
          height: '5vh',
          minWidth: '0',
          minHeight: '0',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MenuIcon sx={{ color: '#FEFAE0' }} />
      </Button>
      <Drawer open={open} PaperProps={{ sx: { backgroundColor: '#FEFAE0' } }} onClose={toggleDrawer(false)}>
        {isAuthenticated ? (
          <>
          {type ? (
            <>
              {(type=='client') ? (
                DrawerListClient
              ) : (
                DrawerListCoach
              )}
            </>
          ) : (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
          )}
          
          </>
        ) : (
          DrawerListNotauthenticated
        )}
      </Drawer>
    </div>
  );
}
