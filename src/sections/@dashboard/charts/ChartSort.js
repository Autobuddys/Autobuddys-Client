import { useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

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

export default function ChartSort() {
  const classes = useStyles();
  const [open, setOpen] = useState(null);
  const [option,setOption] = useState("Daily");

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleShow = (item) =>{
    setOption(item)
    setOpen(null)
  }

  return (
    <>
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
            selected={item.value === 'daily'}
            onClick={()=>handleShow(item.label)}
            sx={{ typography: 'h5' }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
