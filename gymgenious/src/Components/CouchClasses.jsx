import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Box, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import Loader from '../real_components/loader.jsx'
function CouchClasses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [maxNum,setMaxNum] = useState(null);
  const [salas, setSalas] = useState([]);
  const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
  const [salaAssigned, setSala] = useState(null);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen400 = useMediaQuery('(max-width:400px)');
  const isSmallScreen500 = useMediaQuery('(max-width:500px)');
  const isSmallScreen600 = useMediaQuery('(max-width:600px)');
  const [classes,setClasses]=useState([])
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');
  const [type, setType] = useState(null);
  const [errorSala, setErrorSala] = useState(false);
  const [errorEndTime, setErrorEndTime] = useState(false);


  const [fetchId,setFetchId] = useState('');
  const [fetchDateFin,setFetchDateFin]= useState('¿');
  const [fetchDateInicio,setFetchDateInicio]=useState('');
  const [fetchDay,setFetchDay]=useState('');
  const [fetchName,setFetchName]=useState('');
  const [fetchHour,setFetchHour]=useState('');
  const [fetchPermanent,setFetchPermanent]=useState('');
  const [fetchClass,setFetchClass]=useState({});
  const [fetchSala,setFetchSala] = useState('')
  const [fetchCapacity, setFetchCapacity] = useState('')
  const [failureErrors, setFailureErrors] = useState(false);
  const [errorForm, setErrorForm] = useState(false);

  const day = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
  };

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    if (userMail && (maxNum || fetchCapacity)) {
      fetchSalas();
    }
  }, [userMail,maxNum,fetchCapacity]);
  
  const fetchSalas = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_salas`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const data = await response.json();
        let dataFinal=[]
        if(maxNum!=null){
          dataFinal = data.filter((sala)=>parseInt(sala.capacidad)>=maxNum)
        } else {
          dataFinal = data.filter((sala)=>parseInt(sala.capacidad)>=fetchCapacity)
        }
        setSalas(dataFinal);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningFetchingRoutines(true);
        setTimeout(() => {
            setWarningFetchingRoutines(false);
        }, 3000);
    }
  };
  
  function formatDateForInput(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  const handleEditClass = (selectedEvent) => {
    setEditClass(!editClass);
    setFetchId(selectedEvent.id)
    setFetchDateFin(selectedEvent.dateFin)
    setFetchDateInicio(selectedEvent.dateInicio)
    setFetchDay(selectedEvent.day)
    setFetchName(selectedEvent.name)
    setFetchHour(selectedEvent.hour)
    setFetchPermanent(selectedEvent.permanent)
    setFetchClass(selectedEvent)
    setFetchSala(selectedEvent.sala)
    setFetchCapacity(selectedEvent.capacity)
    setHour('');
    setHourFin('');
    setPermanent('');
    setDate('');
    setName('');
    setMaxNum(null);
    setSala(null);
    setErrorForm(false);
    setErrorSala(false);
  } 


  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }


  const fetchModifyClassInformation = async () => {
    setOpenCircularProgress(true);
    setErrorSala(false);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }

        const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
        if (!response2.ok) {
            throw new Error('Error al obtener las clases: ' + response2.statusText);
        }
        const data2 = (await response2.json()).filter((res)=> res.id!=fetchId);
        const isoDateString = date.toString() || fetchDateInicio.split('T')[0]; 

        const newPreviousDate = fetchDateInicio ? fetchDateInicio.split('T')[0] : null;
        const newPreviousDateFin = fetchDateFin ? fetchDateFin.split('T')[0] : null;
        const newPreviousHour = fetchDateInicio ? fetchDateInicio.split('T')[1].split('Z')[0] : "00:00:00";
        const newPreviousHourFin = fetchDateFin ? fetchDateFin.split('T')[1].split('Z')[0] : "00:00:00";

        const finalDateStart = date || newPreviousDate;
        const finalHourStart = hour || newPreviousHour;
        const finalDateEnd = date || newPreviousDateFin;
        const finalHourEnd = hourFin || newPreviousHourFin;

        const newClassStartTime = new Date(`${finalDateStart}T${finalHourStart}Z`);
        const newClassEndTime = new Date(`${finalDateEnd}T${finalHourEnd}Z`);
        const newClassStartTimeInMinutes = timeToMinutes(finalHourStart);
        const newClassEndTimeInMinutes = timeToMinutes(finalHourEnd);
        const conflictingClasses = data2.filter(classItem => 
          classItem.sala === (salaAssigned || fetchSala) &&
          classItem.day === day(isoDateString) 
        );
        if ((permanent || fetchPermanent) == "No") {
          const hasPermanentConflict = conflictingClasses.some(existingClass => 
            existingClass.permanent == "Si" && 
            newClassStartTime > new Date(existingClass.dateFin) &&
            newClassEndTime > new Date(existingClass.dateInicio) &&
            newClassEndTime > new Date(existingClass.dateFin) &&
            newClassStartTime > new Date(existingClass.dateInicio) &&
            newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
            newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5))
          );
          const hasNonPermanentConflict = conflictingClasses.some(existingClass =>
              newClassStartTime < new Date(existingClass.dateFin) &&
              newClassEndTime > new Date(existingClass.dateInicio)
          );
          if (hasNonPermanentConflict || hasPermanentConflict) {
              console.error('Conflicto de horario con clases existentes en esta sala.');
              setOpenCircularProgress(false);
              throw new Error('Error al crear la clase: Conflicto de horario con clases existentes en esta sala.');
          }
        } 
        else if ((permanent || fetchPermanent) == "Si") {
            const hasPastPermanentConflict = conflictingClasses.some(existingClass =>
                existingClass.permanent == "Si" &&
                newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
                newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5)) &&
                newClassStartTime.getFullYear()>= (new Date(existingClass.dateFin)).getFullYear() &&
                newClassEndTime.getFullYear()>= (new Date(existingClass.dateInicio)).getFullYear() &&
                String((newClassStartTime.getMonth() + 1)).padStart(2, '0')>= String((new Date(existingClass.dateFin).getMonth() + 1)).padStart(2, '0') &&                
                String((newClassEndTime.getMonth() + 1)).padStart(2, '0')>= String((new Date(existingClass.dateInicio).getMonth() + 1)).padStart(2, '0') &&
                String((newClassStartTime.getDate())).padStart(2, '0') >= String((new Date(existingClass.dateFin).getDate())).padStart(2, '0') && 
                String((newClassEndTime.getDate())).padStart(2, '0') >= String((new Date(existingClass.dateInicio).getDate())).padStart(2, '0')
            );

            const hasNonPermanentConflict = conflictingClasses.some(existingClass =>
              newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
              newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5)) &&
              newClassStartTime.getFullYear()<= (new Date(existingClass.dateFin)).getFullYear() &&
              newClassEndTime.getFullYear()<= (new Date(existingClass.dateInicio)).getFullYear() &&
              String((newClassStartTime.getMonth() + 1)).padStart(2, '0')<= String((new Date(existingClass.dateFin).getMonth() + 1)).padStart(2, '0') &&                
              String((newClassEndTime.getMonth() + 1)).padStart(2, '0')<= String((new Date(existingClass.dateInicio).getMonth() + 1)).padStart(2, '0') &&
              String((newClassStartTime.getDate())).padStart(2, '0') <= String((new Date(existingClass.dateFin).getDate())).padStart(2, '0') && 
              String((newClassEndTime.getDate())).padStart(2, '0') <= String((new Date(existingClass.dateInicio).getDate())).padStart(2, '0')
            );

            const hasPermanentConflict = conflictingClasses.some(existingClass =>
              newClassStartTime < new Date(existingClass.dateFin) &&
              newClassEndTime > new Date(existingClass.dateInicio)
            );
            if (hasPastPermanentConflict || hasPermanentConflict || hasNonPermanentConflict) {
                console.error('Ya existe una clase permanente en esta sala para este horario.');
                setOpenCircularProgress(false);
                throw new Error('Error al crear la clase: Ya existe una clase permanente en esta sala para este horario.');
            }
        }
        

        const previousDate = fetchDateInicio ? fetchDateInicio.split('T')[0] : null;
        const previousDateFin = fetchDateFin ? fetchDateFin.split('T')[0] : null;

        const previousHour = fetchDateInicio ? fetchDateInicio.split('T')[1].split('Z')[0].slice(0, -7) : "00:00"; 
        const previousHourFin = fetchDateFin ? fetchDateFin.split('T')[1].split('Z')[0].slice(0, -7) : "00:00"; 

        const isoDateStringInicio = `${date || previousDate}T${hour || previousHour}:00.000Z`;
        const isoDateStringFin = `${date || previousDateFin}T${hourFin || previousHourFin}:00.000Z`;
        
        const formData = new FormData();
        formData.append('cid', fetchId);
        formData.append('DateFin', isoDateStringFin);
        formData.append('DateInicio', isoDateStringInicio);
        formData.append('Day', day(date.toString()) || fetchDay);
        formData.append('Name',name || fetchName);
        formData.append('Hour', hour || fetchHour);
        formData.append('Permanent',permanent || fetchPermanent);
        formData.append('sala', salaAssigned || fetchSala);
        formData.append('capacity', maxNum || fetchCapacity);
        const response = await fetch('http://127.0.0.1:5000/update_class_info', {
            method: 'PUT', 
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
        }
        setTimeout(() => {
          setOpenCircularProgress(false);
        }, 2000);
        window.location.reload()
    } catch (error) {
        console.error("Error updating user:", error);
        setOpenCircularProgress(false);
        setErrorSala(true);
    }
};
  const validateForm = () => {
    let res = true;
    console.log(name)
    if (name==='' && hour === '' && hourFin === '' && date=== '') {
        setErrorForm(true);
        res = false;
    } else {
        setErrorForm(false);
    }
    return res;
  }

  const saveClass = (event) => {
    if(validateForm()){
      event.preventDefault(); 
      fetchModifyClassInformation();
    }
  };

  const handleDeleteClass = async (event) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/delete_class', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      const filteredClasses = data.filter(event => event.owner == userMail);
      const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_salas');
      if (!response2.ok) {
        throw new Error('Error al obtener las salas: ' + response2.statusText);
      }
      const salas = await response2.json();
  
      const dataWithSala = filteredClasses.map(clase => {
        const salaInfo = salas.find(sala => sala.id === clase.sala);
        return {
          ...clase,
          salaInfo, 
        };
      });
      setClasses(dataWithSala);
      setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };


  const verifyToken = async (token) => {
    setOpenCircularProgress(true);
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setOpenCircularProgress(false);
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
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser();
    }
}, [userMail]);


  useEffect(() => {
    if(type==='coach'){
        fetchClasses();
    }
  }, [type])

  useEffect(() => {
    if(isSmallScreen400 || isSmallScreen500) {
      setRowsPerPage(10);
    } else {
      setRowsPerPage(5)
    }
    if(isMobileScreen) {
      setMaxHeight('700px');
    } else {
      setMaxHeight('600px')
    }
  }, [isSmallScreen400, isSmallScreen500, isMobileScreen])

  const fetchUser = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
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
        if(data.type!='coach'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const visibleRows = React.useMemo(
    () =>
      [...classes]
        .sort((a, b) =>
          order === 'asc'
            ? a[orderBy] < b[orderBy]
              ? -1
              : 1
            : a[orderBy] > b[orderBy]
            ? -1
            : 1
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, classes]
  );

  return (
    <div className="App">
        {type!='coach' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <Loader></Loader>
            </Backdrop>
        ) : (
          <>
        <NewLeftBar/>
        {openCircularProgress ? (
            <Backdrop open={openCircularProgress} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <Loader></Loader>
            </Backdrop>
        ) : (
            null
        )}
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
        <div className="Table-Container">
        <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#F5F5F5', border: '2px solid #424242', borderRadius: '10px' }}>
            <Paper
                sx={{
                width: '100%',
                backgroundColor: '#F5F5F5',
                borderRadius: '10px'
                }}
            >
                <TableContainer sx={{maxHeight: {maxHeight}, overflow: 'auto'}}>
                    <Table
                        sx={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <TableHead>
                            <TableRow sx={{ height: '5vh', width: '5vh' }}>
                                <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                        <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'name')}>
                                            Name
                                            {orderBy === 'name' ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : (
                                                null
                                            )}
                                        </TableSortLabel>
                                    </TableCell>
                                    {!isSmallScreen500 && (
                                    <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                                        <TableSortLabel
                                        active={orderBy === 'hour'}
                                        direction={orderBy === 'hour' ? order : 'asc'}
                                        onClick={(event) => handleRequestSort(event, 'hour')}
                                        >
                                        Start time
                                        {orderBy === 'hour' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                    )}
                                    {!isSmallScreen400 && (
                                    <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                                        <TableSortLabel
                                        active={orderBy === 'dateInicio'}
                                        direction={orderBy === 'dateInicio' ? order : 'asc'}
                                        onClick={(event) => handleRequestSort(event, 'dateInicio')}
                                        >
                                        Date
                                        {orderBy === 'dateInicio' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                    )}
                                    {!isSmallScreen600 && (
                                    <TableCell align="right" sx={{ borderBottom: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                                        <TableSortLabel
                                        active={orderBy === 'permanent'}
                                        direction={orderBy === 'permanent' ? order : 'asc'}
                                        onClick={(event) => handleRequestSort(event, 'permanent')}
                                        >
                                        Recurrent
                                        {orderBy === 'permanent' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {visibleRows.length===0 ? (
                              <TableRow>
                              <TableCell colSpan={isSmallScreen500 ? 2 : 4} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                                  There are no created classes
                              </TableCell>
                              </TableRow>
                            ) : (
                              <>
                                {visibleRows.map((row) => (
                                    <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #424242' }}>
                                    <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', color:'#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                        {row.name}
                                    </TableCell>
                                    {!isSmallScreen500 && (
                                        <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>{row.hour}</TableCell>
                                    )}
                                    {!isSmallScreen400 && (
                                        <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>{formatDate(new Date(row.dateInicio))}</TableCell>
                                    )}
                                    {!isSmallScreen600 && (
                                        <TableCell align="right" sx={{ borderBottom: '1px solid #424242', color: '#424242' }}>{row.permanent === 'Si' ? 'Yes' : 'No'}</TableCell>
                                    )}
                                    </TableRow>
                                ))}
                              </>
                            )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {visibleRows.length!=0 ? (
                      <>
                        {isSmallScreen500 ? (
                        <TablePagination
                            rowsPerPageOptions={[10]}
                            component="div"
                            count={classes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                        />
                        ) : (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={classes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        )}
                      </>
                    ) : (
                      null
                    )}
                </Paper>
                {selectedEvent && (
                    <div className="Modal" onClick={handleCloseModal}>
                        <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                            <h2>Class details</h2>
                            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
                            <p><strong>Date:</strong> {formatDate(new Date(selectedEvent.dateInicio))}</p>
                            <p><strong>Start time:</strong> {selectedEvent.hour}</p>
                            <p><strong>End time:</strong> {selectedEvent.dateFin.split('T')[1].split(':').slice(0, 2).join(':')}</p>
                            <p><strong>Sala:</strong> {selectedEvent.salaInfo.nombre}</p>
                            <p><strong>Recurrent:</strong> {selectedEvent.permanent==='Si' ? 'Yes' : 'No'}</p>
                            <p><strong>Participants:</strong> {selectedEvent.BookedUsers.length}</p>
                            <button style={{marginLeft:'10px'}} onClick={()=>handleEditClass(selectedEvent)}>Edit class</button>
                            <button style={{marginLeft:'10px'}} onClick={handleCloseModal}>Close</button>
                            <button style={{marginLeft:'10px'}} onClick={() => handleDeleteClass(selectedEvent.id)}>Delete class</button>
                        </div>
                    </div>
                )}
                {editClass && (
                    <div className="Modal">
                        <div className="Modal-Content-class-creation" onClick={(e) => e.stopPropagation()}>
                          <form autoComplete='off' onSubmit={saveClass}>
                            <h2>Class details</h2>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                    <div className="input-small-container">
                                        <label htmlFor="hour" style={{color:'#14213D'}}>Start time:</label>
                                        <input 
                                        type='time'
                                        id="hour" 
                                        name="hour"
                                        value={hour || fetchHour} 
                                        onChange={(e) => setHour(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-small-container">
                                        <label htmlFor="hourFin" style={{color:'#14213D'}}>End time:</label>
                                        <input 
                                            id="hourFin"
                                            type='time'
                                            name="hourFin" 
                                            value={hourFin || selectedEvent.dateFin.split('T')[1].split(':').slice(0, 2).join(':')} 
                                            onChange={(e) => setHourFin(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-small-container">
                                        <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                                        <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={fetchName}/>
                                    </div>
                                </div>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                    <div className="input-small-container" style={{width:"100%"}}>
                                        <label htmlFor="permanent" style={{color:'#14213D'}}>Recurrent:</label>
                                          <select
                                            id="permanent"
                                            name="permanent"
                                            value={permanent || fetchPermanent}
                                            onChange={(e) => setPermanent(e.target.value)}
                                          >
                                            <option value="Si">Yes</option>
                                            <option value="No">No</option>
                                          </select>
                                    </div>
                                    <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                                        <label htmlFor="date" style={{color:'#14213D'}}>Date:</label>
                                        <input 
                                            type='date'
                                            id='date'
                                            name='date'
                                            value={date || formatDateForInput(new Date(selectedEvent.dateInicio))}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                <div className="input-small-container">
                                      <label htmlFor="salaAssigned" style={{ color: '#14213D' }}>Gymroom:</label>
                                      <select
                                          id="salaAssigned"
                                          name="salaAssigned"
                                          value={salaAssigned || selectedEvent.sala}
                                          onChange={(e) => setSala(e.target.value)}
                                          style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                                      >
                                          {salas.map((sala) => (
                                              <option style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} key={sala.id} value={sala.id}>
                                                  {sala.nombre.length > 50 ? `${sala.nombre.substring(0, 50)}...` : sala.nombre}
                                              </option>
                                          ))}
                                      </select>
                                      {errorSala && (<p style={{color: 'red', margin: '0px'}}>Room no available</p>)}
                                  </div>
                                </div>
                                <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                                  <label htmlFor="maxNum" style={{color:'#14213D'}}>Participants:</label>
                                  <input
                                    type="number" 
                                    id="maxNum" 
                                    name="maxNum"
                                    min='1'
                                    max='500'
                                    step='1'
                                    value={maxNum || fetchCapacity} 
                                    onChange={(e) => setMaxNum(e.target.value)}
                                  />
                                  {errorForm && (<p style={{color: 'red', margin: '0px'}}>There are no changes</p>)}
                                </div>
                                <button   onClick={handleEditClass} className='button_login'>Cancell</button>
                                <button style={{merginTop:'10px'}} type="submit" className='button_login'>Save changes</button>
                              </form>
                        </div>
                    </div>
                )}
            </Box>
        </div>
        </>
        )}
    </div>
    
  );
}

export default CouchClasses;
