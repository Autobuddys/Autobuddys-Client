import {Grid,Container, Stack, Typography,Alert,Button,Snackbar,IconButton,Collapse,TextField } from '@mui/material';
import palette from 'src/theme/palette';

const ReportComp = () => {

    return (
      <div>
        <div
          style={{
            margin: "3rem auto",
            padding: "2rem",
            backgroundColor: palette.grey[200],
            borderRadius: "1rem",
          }}
        >
          <div  className="report" style={{ backgroundColor: "white", padding: "3rem" }}>
            <img
              src="/static/logoFinal.svg"
              alt="Logo"
              style={{ width: "250px", height: "80px" }}
            />
            <div style={{ textAlign: "center", margin: "3rem auto" }}>
              <h2>Health Report</h2>
            </div>
            <div className="contents">
              Pateint Name: <br />
              Phone Number(Patient): <br />
              Patient Age: <br />
              Patient Address: <br />
              Doctor Name: <br />
              Contact Number(Doctor):
            </div>
          </div>
        </div>
        <Button
          className="print"
          style={{ width: "150px", alignSelf: "center", fontSize: "17px" }}
          size="large"
          variant="contained"
          onClick={ () => {
            const report = document.querySelector(".report");
            html2pdf().from(report).save();
          } }
        >
          Print
        </Button>
      </div>
    );
}
 
export default ReportComp;