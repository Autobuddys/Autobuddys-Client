// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.boxes.tempText,
  backgroundColor: theme.palette.boxes.tempBack
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.boxes.tempText,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.boxes.tempText, 0)} 0%, ${alpha(
    theme.palette.boxes.tempText,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------


export default function Temperature(props) {
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="fa6-solid:temperature-high" width={28} height={30} />
      </IconWrapperStyle>
      <Typography variant="h3">{props.vitalpar}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        TEMPERATURE
      </Typography>
    </RootStyle>
  );
}
