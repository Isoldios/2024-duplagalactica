import React, { useState, useEffect } from 'react';
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
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { jwtDecode } from "jwt-decode";
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Loader from '../real_components/loader.jsx';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

function BarAnimation({ routines, isSmallScreen }) {
    const [itemNb, setItemNb] = React.useState(5);

    const orderedRoutines = routines.sort((a, b) => b.cant_asignados - a.cant_asignados);
  
    const routineNames = orderedRoutines?.map(routine => routine.name);
    const routineData = orderedRoutines?.map(routine => routine.cant_asignados);
  
    const handleItemNbChange = (event, newValue) => {
      if (typeof newValue !== 'number') {
        return;
      }
      setItemNb(newValue);
    };
    
    const routinesData = routines?.map(routine => ({
      label: routine.name,
      value: routine.cant_asignados, 
    }));

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%',backgroundColor:'#F5F5F5',marginTop:'10px',borderRadius:'10px',marginLeft:'2px' }}>
          <BarChart
            height={250}
            series={[{
              data: routineData.slice(0, itemNb),
              valueFormatter: (item) => `${item} users`,
            }]}
            xAxis={[{
              scaleType: 'band',
              data: routineNames.slice(0, itemNb),
            }]}   
          />
          {!isSmallScreen && (
          <PieChart
            height={250}
             legend= {{ hidden: true }}
                series={[{
                  data: routinesData.slice(0,itemNb),
                  innerRadius: 50,
                  // arcLabel:(params) => params.label ?? '',
                  // arcLabelMinAngle: 20,
                  valueFormatter: (item) => `${item.value} users`,              
                }]}
          />
        )}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 230, textAlign: 'center', marginRight: '1%' }}>
            <Typography id="input-item-number" gutterBottom>
              Routines number
            </Typography>
            <Slider
              value={itemNb}
              orientation="vertical"
              onChange={handleItemNbChange}
              valueLabelDisplay="auto"
              min={1}
              max={5}
              sx={{ height: '100%' }}
              aria-labelledby="input-item-number"
            />
        </Box>
      </Box>
    );
  }

  

const day = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[date.getDay()];
};

function TopRoutines() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('cant_asignados');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const isSmallScreen250 = useMediaQuery('(max-width:400px)');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const navigate = useNavigate();
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');
  const [viewExercises, setViewExercises] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);
  const [filterRoutines, setFilterRoutines] = useState('');
  const [totalRoutines, setTotalRoutines] = useState([]);

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setRoutines(totalRoutines);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    handleCloseSearch();
};

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setViewExercises(false);
  };

  const handleViewExercises = () => {
    setViewExercises(!viewExercises);
};

const fetchRoutines = async () => {
  setOpenCircularProgress(true);
  try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
      }

      // Fetch rutinas
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_routines`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      });
      if (!response.ok) {
          throw new Error('Error al obtener las rutinas: ' + response.statusText);
      }
      const routines = await response.json();

      // Fetch rutinas asignadas
      const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_assigned_routines', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      });
      if (!response2.ok) {
          throw new Error('Error al obtener las rutinas asignadas: ' + response2.statusText);
      }
      const assignedRoutines = await response2.json();
      const response3 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_excersices', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      });
      if (!response3.ok) {
          throw new Error('Error al obtener los ejercicios: ' + response3.statusText);
      }
      const exercisesData = await response3.json();
      const response4 = await fetch('https://train-mate-api.onrender.com/api/exercise/get-all-exercises', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}` 
          }
      });
      if (!response4.ok) {
          throw new Error('Error al obtener los ejercicios de Train Mate: ' + response4.statusText);
      }
      const exercisesDataFromTrainMate = await response4.json();
      const routinesWithExercisesData = routines.map((routine) => {
          const updatedExercises = routine.excercises.map((exercise) => {
              let matchedExercise = exercisesData.find((ex) => ex.id === exercise.id);
              
              if (!matchedExercise && Array.isArray(exercisesDataFromTrainMate.exercises)) {
                  matchedExercise = exercisesDataFromTrainMate.exercises.find((ex) => ex.id === exercise.id);
              }
              if (matchedExercise) {
                  return {
                      ...exercise,
                      name: matchedExercise.name,
                      description: matchedExercise.description,
                  };
              }

              return exercise; 
          });

          return {
              ...routine,
              excercises: updatedExercises,
          };
      });


      const routinesWithAssignedCount = routinesWithExercisesData.map((routine) => {
          const assignedForRoutine = assignedRoutines.filter((assigned) => assigned.id === routine.id);
          const totalAssignedUsers = assignedForRoutine.reduce((acc, assigned) => {
              return acc + (assigned.users ? assigned.users.length : 0);
          }, 0);

          return {
              ...routine,
              cant_asignados: totalAssignedUsers,
          };
      });

      setRoutines(routinesWithAssignedCount);
      setTotalRoutines(routinesWithAssignedCount);
      setOpenCircularProgress(false);
  } catch (error) {
      console.error("Error fetching rutinas:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
          setWarningConnection(false);
      }, 3000);
  }
};

useEffect(() => {
  if(filterRoutines!=''){
    const filteredRoutinesSearcher = totalRoutines.filter(item => 
      item.name.toLowerCase().startsWith(filterRoutines.toLowerCase())
    );
    setRoutines(filteredRoutinesSearcher);
  } else {
    setRoutines(totalRoutines);
  }
}, [filterRoutines]);

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
            navigate('/');
            console.error('No token found');
        }
      }, []);
    
      useEffect(() => {
        if (userMail) {
            fetchRoutines();
        }
    }, [userMail]);

      useEffect(() => {
        if(isMobileScreen) {
          setMaxHeight('700px');
        } else {
          setMaxHeight('600px')
        }
      }, [isSmallScreen, isMobileScreen])

    const visibleRows = React.useMemo(
      () =>
        [...routines]
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
      [order, orderBy, page, rowsPerPage, routines]
    );

    return (
      <div className="App">
        {!userMail ? (
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
              <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <NewLeftBar/>
            <div className='input-container' style={{marginLeft: '50px', width: '30%', position: 'absolute', top: '0.5%'}}>
                        <div className='input-small-container'>
                            {openSearch ? (
                                <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                style={{
                                position: 'absolute',
                                borderRadius: '10px',
                                padding: '0 10px',
                                transition: 'all 0.3s ease',
                                }}
                                id={filterRoutines}
                                onChange={(e) => setFilterRoutines(e.target.value)} 
                            />
                            ) : (
                            <Button onClick={handleOpenSearch}
                            style={{
                                backgroundColor: '#48CFCB',
                                position: 'absolute',
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
                            >
                            <SearchIcon sx={{ color: '#424242' }} />
                            </Button>
                            )}
                            </div>
                    </div>
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
                          {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', fontWeight: 'bold',color:'#424242' }}>
                              <TableSortLabel active={orderBy === 'owner'} direction={orderBy === 'owner' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'owner')}>
                                Owner
                                {orderBy === 'owner' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                          {!isSmallScreen250 && (
                            <TableCell align="right" sx={{borderBottom: '1px solid #424242',borderRight: '1px solid #424242', fontWeight: 'bold',color:'#424242' }}>
                              <TableSortLabel active={orderBy === 'excercises'} direction={orderBy === 'excercises' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'excercises')}>
                                Exercises
                                {orderBy === 'excercises' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                          {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', fontWeight: 'bold',color:'#424242' }}>
                              <TableSortLabel active={orderBy === 'cant_asignados'} direction={orderBy === 'cant_asignados' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'cant_asignados')}>
                                Users
                                {orderBy === 'cant_asignados' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {visibleRows.length===0 ? (
                            <TableRow>
                            <TableCell colSpan={isSmallScreen ? 2 : 4} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                                There are no created routines
                            </TableCell>
                            </TableRow>
                        ) : (
                          <>
                            {visibleRows.map((row) => (
                              <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', color:'#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                  {row.name}
                                </TableCell>
                                {!isSmallScreen && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242',color:'#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                    {row.owner}
                                  </TableCell>
                                )}
                                {!isSmallScreen250 && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242',color:'#424242' }}>
                                    {row.excercises.length}
                                  </TableCell>
                                )}
                                {!isSmallScreen && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242',color:'#424242' }}>
                                    {row.cant_asignados} 
                                  </TableCell>
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
                        <TablePagination
                            rowsPerPageOptions={[5]}
                            component="div"
                            count={routines.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                        />
                    </>
                  ) : (
                    null
                  )}
                </Paper>
              </Box> 
              <div className='graphic-container'>
              <BarAnimation routines={routines} isSmallScreen={isSmallScreen}/>
            </div>
            </div>
            {selectedEvent && (
              <div className="Modal" onClick={handleCloseModal}>
                <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
                  <p><strong>Users:</strong> {selectedEvent.cant_asignados}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Owner:</strong> {selectedEvent.owner}</p>
                  <button onClick={handleViewExercises}>View exercises</button>
                  <button onClick={handleCloseModal} style={{marginLeft:'10px'}}>Close</button>
                </div>
              </div>
            )}
            {viewExercises && (
                <div className="Modal" onClick={handleViewExercises}>
                    <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                        <h2>Exercises from {selectedEvent.routine}</h2>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Exercise</TableCell>
                                            <TableCell>Series</TableCell>
                                            <TableCell>Reps</TableCell>
                                            <TableCell>Timing</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedEvent?.excercises?.map((exercise) => (
                                            <TableRow key={exercise.id}>
                                                <TableCell>{exercise.name}</TableCell>
                                                <TableCell>{exercise.series} x</TableCell>
                                                <TableCell>{exercise.reps.join(', ')}</TableCell>
                                                <TableCell>{exercise.timing}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <button onClick={handleViewExercises} style={{marginTop:'10px'}}>Close</button>
                    </div>
                </div>
            )}
            {openCircularProgress ? (
              <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={openCircularProgress}
              >
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
          </>
        )}
      </div>
    );
}

export default TopRoutines;
