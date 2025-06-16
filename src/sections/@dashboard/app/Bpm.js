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
  color: theme.palette.boxes.heartText,
  backgroundColor: theme.palette.boxes.heartBack
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
  color: theme.palette.boxes.heartText,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.boxes.heartText, 0)} 0%, ${alpha(
    theme.palette.boxes.heartText,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1352831;

export default function Bpm(props) {
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="emojione-monotone:beating-heart" width={28} height={30} />
      </IconWrapperStyle>
      <Typography variant="h3">{props.vitalpar}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        HEART BEAT RATE
      </Typography>
    </RootStyle>
  );
}
