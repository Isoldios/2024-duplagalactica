import React, { useEffect, useState } from 'react';
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

function EnhancedTable({ rows, user, userType, handleBookClass, handleUnbookClass }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isSmallScreen400 = useMediaQuery('(max-width:400px)');
  const isSmallScreen500 = useMediaQuery('(max-width:500px)');
  const isSmallScreen600 = useMediaQuery('(max-width:600px)');
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
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

  const visibleRows = React.useMemo(
    () =>
      [...rows]
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
    [order, orderBy, page, rowsPerPage, rows]
  );
  return (
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
                <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold',color: '#424242' }}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'name')}
                  >
                    Name
                    {orderBy === 'name' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
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
                    There are no classes
                </TableCell>
                </TableRow>
              ) : (
                <>
                  {visibleRows.map((row) => {
                    const isTransparent = user && userType === 'client' &&
                      (new Date(row.dateInicio).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000) &&
                      (new Date(row.dateInicio).getTime() >= new Date().setHours(0, 0, 0, 0)) &&
                      (row.BookedUsers.length<row.capacity);

                    return (
                      <TableRow
                        onClick={() => handleSelectEvent(row)}
                        hover
                        tabIndex={-1}
                        key={row.id}
                        sx={{
                          cursor: 'pointer',
                          borderBottom: '1px solid #424242',
                          opacity: !isTransparent ? 0.5 : 1,
                        }}
                      >
                        <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
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
                    );
                  })}
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                sx={{color:'#424242'}}
                onPageChange={handleChangePage}
              />
            ) : (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                sx={{color:'#424242'}}
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
            <h2>Class details:</h2>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
            <p><strong>Date:</strong> {formatDate(new Date(selectedEvent.dateInicio))}</p>
            <p><strong>Start time:</strong> {new Date(new Date(selectedEvent.dateInicio).getTime() + 3 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <p><strong>End time:</strong> {selectedEvent.dateFin.split('T')[1].split(':').slice(0, 2).join(':')}</p>
            <p><strong>Recurrent:</strong> {selectedEvent.permanent === 'Si' ? 'Yes' : 'No'}</p>
            <p><strong>Participants:</strong> {selectedEvent.BookedUsers.length}/{selectedEvent.capacity}</p>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Coach:</strong> {selectedEvent.owner}</p>
            {user && userType==='client' && (new Date(selectedEvent.dateInicio).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000) &&
            (new Date(selectedEvent.dateInicio).getTime() >= new Date().setHours(0, 0, 0, 0))
            ? (
            <>
            {selectedEvent.BookedUsers && selectedEvent.BookedUsers.includes(user)  ? (
                  <button onClick={() => handleUnbookClass(selectedEvent.id)}>Unbook</button>
                ) : (
                  <>
                  {selectedEvent.BookedUsers.length<selectedEvent.capacity ? (
                  <button onClick={() => handleBookClass(selectedEvent.id)}>Book</button>
                  ) :
                  (<>
                  <button style={{background:'red'}}>Full</button>
                  </>)
                  }
                  </>
            )}
            <button onClick={handleCloseModal}>Close</button>
            </>) : (
            <button onClick={handleCloseModal}>Close</button>
          )}
          </div>
        </div>
      )}
    </Box>
  );
}

EnhancedTable.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default EnhancedTable;
