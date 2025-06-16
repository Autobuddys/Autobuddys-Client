import * as React from 'react';
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
  Alert,
  TextField,
  Snackbar,
  Grid,Menu,MenuItem,Button
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

// for chart of patient clicked
import DailyChart from 'src/sections/@dashboard/charts/DailyChart';
import { makeStyles } from '@mui/styles';
import Iconify from '../components/Iconify';
import AllCharts from '../sections/@dashboard/charts/AllCharts'


// for report download of patients
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios'


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Patient Name', alignRight: false },
  { id: 'address', label: 'Patient Address', alignRight: false },
  { id: 'phone', label: 'Phone No', alignRight: false },
  { id: 'age', label: 'Patient Age', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// for chart of patient clicked
const useStyles = makeStyles({
  customWidth: {
    '& div': {
        width: '150px',
    }
}
});

const SORT_BY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
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
    return filter(array, (_user) => _user.pname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// location.reload();

export default function Doctordashboard(props) {

  const { user,isLoading } = useContext(UserContext);
  const {userlist, getUserList} = useAuth()
  const [page, setPage] = useState(0);
  const [openAlert, setOpenAlert] = useState(true);
  const [openAlert1, setOpenAlert1] = useState(true);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [err,setErr]=useState()
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const obj = JSON. parse(user)

  // for chart of patient clicked
  const classes = useStyles();
  const [open, setOpen] = useState(null);
  const [nottoday,setNottoday] = useState()
  const [graph,setGraph] = useState()
  const [chart,setChart] = useState()
  const [option,setOption] = useState("Daily");
  const [patid,setPatid] = useState(null)
  const [patname,setPatname] = useState(null)
  

  //for report download of patient clicked
  const [open1, setOpen1] = useState(true);
  const [able1,setAble1] = useState(false);
  const [able2,setAble2] = useState(false);
  const [fromto,setFromto] = useState(false);
  const [from,setFrom] = useState(null)
  const [to,setTo] = useState(null)
  const [year,setYear] = useState(null)
  const [monyear,setMonyear] = useState(null)
  const [snack, setSnack] = useState(false);
  const [snackmsg,setSnackmsg] = useState(false)
  const [alertDur,setAlertDur] = useState('')
  const [openalert,setOpenalert] = useState(false);


  useEffect(()=>{
    getUserList()
  },[userlist.length])

  const [openProf, setOpenprof] = useState(false);

  const handleClickProf = () => {
    setOpenprof(true);
  };

  const handleCloseProf = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenprof(false);
  };

  const actionProf = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseProf}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

// functions for chart of patient
// functions for chart of patient
// functions for chart of patient
// functions for chart of patient


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };


  const handleShow = async (item) =>{

    if(item=="Weekly"){
      await axiosInstance.get(`chart-data/W${patid}`)
        .then((res)=>{
          if(res.data=="No readings for the week!"){
            setNottoday(res.data)
          }
          else{
            setNottoday(null)
            setChart(res.data)
          }
        })
    }
    else if(item=="Yearly"){
      await axiosInstance.get(`chart-data/Y${patid}`)
        .then((res)=>{
          if(res.data=="No readings for the year!"){
            setNottoday(res.data)
          }
          else{
            setNottoday(null)
            setChart(res.data)
          }
      })
    }
    else if(item=="Monthly"){
      await axiosInstance.get(`chart-data/M${patid}`)
        .then((res)=>{
          if(res.data=="No readings for the month!"){
            setNottoday(res.data)
          }

          else{
            setNottoday(null)
            setChart(res.data)
          }
      })
    }
    else{
      await axiosInstance.get(`graph-dashboard/${patid}`)
      .then((res)=>{
        if(res.data=="No readings for today!"){
          setNottoday(res.data)
        }
        else{
          setGraph(res.data)
        }
      })
    }
   
    setOption(item)
    setOpen(null)
  }


  let alert;
  const openpatProf=(id,name,sentence)=>{
    if(sentence=="Rejected" || sentence=="Pending"){
      handleClickProf()
    }
    else{
      alert=null
      setPatid(id)
      setPatname(name)
      axiosInstance.get(`graph-dashboard/${patid}`)
      .then((res)=>{
        if(res.data=="No readings for today!"){
          setNottoday(res.data)
        }
        else{
          setGraph(res.data)
        }
      })
    }
    

  }
// functions for chart of patient
// functions for chart of patient
// functions for chart of patient
// functions for chart of patient


// function for report of patient clicked
// function for report of patient clicked
// function for report of patient clicked
// function for report of patient clicked
// function for report of patient clicked

  const handleClose1 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack(false);
    setSnackmsg(false);
  };

  const notvalidDur=(r)=>{
    setAlertDur(r)
    setOpenalert(true)
  }



  const handleReport = async (e)=>{
    e.preventDefault();
    let now = new Date();
    if(from && to){
      
      if(((from.getFullYear()-to.getFullYear()<0) 
      || (from.getFullYear()==to.getFullYear() && (from.getMonth()<to.getMonth() || (from.getMonth()==to.getMonth() && from.getDate()<to.getDate()))) 
      || (from.getFullYear()==to.getFullYear() && from.getMonth()==to.getMonth() && from.getDate()==to.getDate()) )
      && (((from.getFullYear()<now.getFullYear()) && (to.getFullYear()<now.getFullYear())) || ((from.getFullYear()==now.getFullYear()) && (to.getFullYear()==now.getFullYear()) && ((from.getMonth()<now.getMonth()) && (to.getMonth()<now.getMonth()) || (from.getMonth()==now.getMonth()) && (to.getMonth()==now.getMonth()) && (from.getDate()<=now.getDate()) && (to.getDate()<=now.getDate()))))
      ){
        // console.log(from.getDate(),to.getDate())
        await axiosInstance.post('/report-data/', {
          type:"dates",
          fromY:from.getFullYear(),
          toY:to.getFullYear(),
          fromM:from.getMonth(),
          toM:to.getMonth(),
          fromD:from.getDate(),
          toD:to.getDate(),
          dur:"total",
          patID:patid
        })
        .then((res)=>{
          if(res.data==='done!'){
            axios.get(`https://autobuddys-server.herokuapp.com/elder/report-data/3`,{
            headers: {
              Authorization: localStorage.getItem('access_token')? ('JWT ' + localStorage.getItem('access_token')): null,
            },
            responseType: 'blob'
          }).then((response) => {

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
          })
          }
          else notvalidDur(res.data)
          
        })
      }
      else{
        setSnackmsg(true)
      }
    }
    else if(monyear){
      if(monyear.getFullYear()<=now.getFullYear() && monyear.getMonth()<=now.getMonth()){
        await axiosInstance.post('/report-data/', {
          type:"dates",
          fromY:monyear.getFullYear(),
          fromM:monyear.getMonth(),
          dur:"monyear",
          patID:patid
        })
        .then((res)=>{
          if(res.data==='done!'){
            axios.get(`https://autobuddys-server.herokuapp.com/elder/report-data/3`,{
            headers: {
              Authorization: localStorage.getItem('access_token')? ('JWT ' + localStorage.getItem('access_token')): null,
            },
            responseType: 'blob'
          }).then((response) => {

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
          })
          }
          else notvalidDur(res.data)
        })
      }
      else{
        setSnackmsg(true)
      }
    }
    else if(year){
      if(year.getFullYear()<=now.getFullYear()){
        await axiosInstance.post('/report-data/', {
          type:"dates",
          fromY:year.getFullYear(),
          dur:"year",
          patID:patid
        })
        .then((res)=>{
          if(res.data==='done!'){
            axios.get(`https://autobuddys-server.herokuapp.com/elder/report-data/3`,{
            headers: {
              Authorization: localStorage.getItem('access_token')? ('JWT ' + localStorage.getItem('access_token')): null,
            },
            responseType: 'blob'
          }).then((response) => {

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
          })
          }
          else notvalidDur(res.data)
        })
        

        }
        else{
          setSnackmsg(true)
        }
      }
      else{
        setSnack(true);
      }
  }

  const action = (
    <React.Fragment>
      
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


// function for report of patient clicked
// function for report of patient clicked
// function for report of patient clicked
// function for report of patient clicked
// function for report of patient clicked

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
    if(err=="reload"){
      console.log("err=reload")
      getUserList()
    }
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
        
      {!patid?<>
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

              <Collapse in={openAlert1}>
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenAlert1(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2,width:'500px' }}
                  >
                    Select on the patient avatar to open profile.
                  </Alert>
                </Collapse>
          


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
                      console.log(id,sentence)
                    

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
                          <TableCell component="th" scope="row" padding="none" >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar onClick={()=>openpatProf(id,pname,sentence)}/>
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
        <Snackbar
          open={openProf}
          autoHideDuration={2000}
          onClose={handleCloseProf}
          message="The status needs to be Accepted!"
          action={actionProf}
        />
        </> :
        <>
        {/* chart wala display */}
        {/* chart wala display */}
        {/* chart wala display */}
        {/* chart wala display */}

        <Typography variant="h3" >
          Charts
        </Typography>
        <Typography variant="body">
          Patient ID : {patid}
        </Typography>
        <br/>
        <Typography variant="body">
          Patient Name : {patname}
        </Typography>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-center"
          sx={{ mb: 5,mt:3 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ChartSort /> */}
            <Button
              color="inherit"
              variant="contained"
              disableRipple
              onClick={handleOpen}
              endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              style={{height:'60px',width:'300px',fontSize:'20px'}}
            >
              Choose&nbsp;:&nbsp;&nbsp;
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary',fontSize:'20px' }}>
                {option}
              </Typography>
            </Button>
            <Menu
              keepMounted
              anchorEl={open}
              open={Boolean(open)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              className={classes.customWidth}
            >
              {SORT_BY_OPTIONS.map((item) => (
                <MenuItem
                  key={item.value}
                  selected={item.label === option}
                  onClick={()=>handleShow(item.label)}
                  sx={{ typography: 'h5' }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>
        {!alert?<Grid container spacing={3}>
          
            {option=="Daily"?
            <Grid item xs={12} md={12} lg={12}>
              {!nottoday && graph?<DailyChart data={graph}/>:<Alert severity='info' style={{width:'400px',fontSize:'20px'}}>{nottoday}</Alert>}
            </Grid>:!nottoday && chart?<AllCharts data={chart} name={option}/>:<Alert severity='info' style={{width:'400px',fontSize:'20px'}}>{nottoday}</Alert>}

        </Grid>:alert}

        {/* report wala display */}
        {/* report wala display */}
        {/* report wala display */}
        {/* report wala display */}

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={8}>
          <Typography variant="h3" gutterBottom>
            Reports
          </Typography>

          <Collapse in={open1}>
            <Alert
            severity='info'
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen1(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Either choose "date FROM and TO" or "YEAR and MONTH" or just "YEAR".
            </Alert>
          </Collapse>
          
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <DatePicker
                disabled={fromto}
                openTo="year"
                views={['year', 'month', 'day']}
                label="FROM : "
                value={from}
                onChange={(newValue) => {
                  setFrom(newValue);
                  setAble1(true)
                  setAble2(true)
                }}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <DatePicker
                  openTo="year"
                  disabled={fromto}
                  views={['year', 'month', 'day']}
                  label="TO : "
                  value={to}
                  onChange={(newValue) => {
                    setTo(newValue);
                    setAble1(true)
                    setAble2(true)
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </Grid>
              {/* <h5>OR</h5> */}
              <Grid item xs={12} sm={6} lg={3}>
                <DatePicker
                  disabled={able1}
                  views={['year', 'month']}
                  label="YEAR AND MONTH :"
                  minDate={new Date('2012-03-01')}
                  maxDate={new Date('2023-06-01')}
                  value={monyear}
                  onChange={(newValue) => {
                    setMonyear(newValue);
                    setFromto(true)
                    setAble2(true)
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </Grid>
              {/* <h5>OR</h5> */}

              <Grid item xs={12} sm={6} lg={3}>
                <DatePicker
                  disabled={able2}
                  views={['year']}
                  label="YEAR : "
                  value={year}
                  onChange={(newValue) => {
                    setYear(newValue);
                    setFromto(true)
                    setAble1(true)
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </Grid>
            
            </Grid>
          {/* </Stack> */}
        </LocalizationProvider>

        <Stack direction="row" spacing={2} sx={{marginTop:5}}>
          <Button
              style={{width:'150px',alignSelf:'center',fontSize:'17px'}}
              size="large"
              variant="contained"
              onClick={handleReport}
              >
              Get Report
            </Button>

            <Button
              style={{width:'150px',alignSelf:'center',fontSize:'17px'}}
              size="large"
              variant="contained"
              onClick={()=>{
                setMonyear(null)
                setYear(null)
                setTo(null)
                setFrom(null)
                setFromto(false)
                setAble1(false)
                setAble2(false)
                setOpenalert(false)
              }}
              >
              Reset All
            </Button>
        </Stack>
        

      
        {alertDur?
        <Collapse in={openalert}>
            <Alert
            severity='warning'

              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenalert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2, width:'500px'}}
            >
              {alertDur}
            </Alert>
          </Collapse>:null}
        <Snackbar
          open={snack}
          autoHideDuration={6000}
          onClose={handleClose1}
          message="Please select a duration!"
          action={action}
      />
      <Snackbar
        open={snackmsg}
        autoHideDuration={6000}
        onClose={handleClose1}
        message="The duration entered is invalid!"
        action={action}
      />

    
        
        </>}
      </Container>
    </Page>
  );
}
