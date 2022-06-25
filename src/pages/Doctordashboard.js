import { filter } from 'lodash';
import { useState,useEffect,useContext } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Collapse,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Alert
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

import {UserContext} from "../hooks/UserContext"
import axiosInstance from "../axiosInstance"
import CloseIcon from '@mui/icons-material/Close';
import useAuth from "../hooks/useAuth"
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Patient Name', alignRight: false },
  { id: 'address', label: 'Patient Address', alignRight: false },
  { id: 'phone', label: 'Phone No', alignRight: false },
  { id: 'age', label: 'Patient Age', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// location.reload();

export default function Doctordashboard(props) {
  // console.log("prinitng props : ",props)
  const { user,isLoading } = useContext(UserContext);
  const {userlist, getUserList} = useAuth()
  const [page, setPage] = useState(0);
  const [openAlert, setOpenAlert] = useState(true);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  // const [userlist,setUserlist] = useState([])
  const [err,setErr]=useState()
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const obj = JSON. parse(user)
  

  useEffect(()=>{
    getUserList()
  },[userlist])

  // useEffect(()=>{
  //   axiosInstance.get(`getnotpat/${obj['id']}`)
  //   .then((res)=>{
  //     if(res.data==="False"){
  //       setUserlist([])
  //     }
  //     else{setUserlist(res.data)}
      
  //   })
  //   .catch(err=>setErr(err))
  // },[obj['id']])

  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userlist.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleCallback=(err)=>{
    if(err=="reload"){getUserList()}
    else{setErr([err,'error'])}
    
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userlist.length) : 0;

  let filteredUsers
  if(userlist.length>0){
    filteredUsers = applySortFilter(userlist, getComparator(order, orderBy), filterName)
  }
  else{
    filteredUsers =[]
  }

  const isUserNotFound = filteredUsers.length === 0;

 
  let sentence=""
  let color

  return (
    <Page title="Medical Staff | AutoBuddys">
      <Container>
        
      {err?<Collapse in={openAlert}>
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {err}
                  </Alert>
                </Collapse>
          :null}


        {userlist?
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            whatselected={selected}
            parentCallback = {handleCallback}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userlist.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, pname, pphone, page, address, approved, rejected } = row;
                      // console.log(id)

                      if(approved==true){
                        sentence="Approved"
                        color="success"
                      }
                      else if(rejected==true){
                        sentence="Rejected"
                        color="error"
                      }
                      else {
                        sentence="Pending"
                        color="info"
                      }

                    

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selected.indexOf(id) !== -1}
                          aria-checked={selected.indexOf(id) !== -1}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selected.indexOf(id) !== -1}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar />
                              <Typography variant="subtitle2" noWrap>
                                {pname}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{address}</TableCell>
                          <TableCell align="left">{pphone}</TableCell>
                          <TableCell align="left">{page}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={color}
                            >
                              {sentence}
                              
                            </Label>
                          </TableCell>

                          {/* <TableCell align="right">
                            <UserMoreMenu />
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userlist.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        :null} 
      </Container>
    </Page>
  );
}
