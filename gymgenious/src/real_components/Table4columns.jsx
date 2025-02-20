import React, { useState, useEffect } from 'react';
import { Box, Paper, useMediaQuery} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const CustomTable = ({ columnsToShow, data, handleSelectEvent,vals }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const isMobileScreen = useMediaQuery('(min-height:750px)');
    const [maxHeight, setMaxHeight] = useState('600px');
    const [dense, setDense] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    useEffect(() => {
    if(isSmallScreen) {
        setRowsPerPage(10);
    } else {
        setRowsPerPage(5)
    }
    if(isMobileScreen) {
        setMaxHeight('700px');
    } else {
        setMaxHeight('600px')
    }
    }, [isSmallScreen, isMobileScreen])

    
    const visibleRows = React.useMemo(
    () =>
    [...data]
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
    [order, orderBy, page, rowsPerPage, data]
    );
    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };
    
    return (
        <div className="Table-Container">
        <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#F5F5F5', border: '2px solid #424242', borderRadius: '10px' }}>
            <Paper sx={{ width: '100%', backgroundColor: '#F5F5F5', borderRadius: '10px' }}>
            <TableContainer sx={{ maxHeight: '525px', overflow: 'auto' }}>
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow sx={{ height: '5vh', width: '5vh' }}>
                        <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                            {columnsToShow[0]}
                        </TableCell>
                    {!isSmallScreen && (
                        <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                            {columnsToShow[1]}
                        </TableCell>
                    )}
                        <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                            {columnsToShow[2]}
                        </TableCell>
                    {!isSmallScreen && (
                        <TableCell align="right" sx={{ borderBottom: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                            {columnsToShow[3]}
                        </TableCell>
                    )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleRows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={isSmallScreen ? 2 : 4} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                        {columnsToShow[4]}
                        </TableCell>
                    </TableRow>
                    ) : (
                    <>
                        {visibleRows.map((row) => (
                        <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                            <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                {row[vals[0]]}
                            </TableCell>
                            {!isSmallScreen && (
                                <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                {row[vals[1]]}
                            </TableCell>
                            )}
                            <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                {row[vals[2]]}
                            </TableCell>
                            {!isSmallScreen && (
                                <TableCell align="right" sx={{ borderBottom: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                {row[vals[3]]}
                            </TableCell>
                            )}
                        </TableRow>
                        ))}
                    </>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
            {visibleRows.length !== 0 && (
                <>
                {isSmallScreen ? (
                    <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    />
                ) : (
                    <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
                </>
            )}
            </Paper>
        </Box>
        </div>
    );
};

export default CustomTable;
