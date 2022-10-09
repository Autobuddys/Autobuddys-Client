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
          <div
            id="report"
            style={{ backgroundColor: "white", padding: "3rem" }}
          >
            <img
              src="/static/logoFinal.svg"
              alt="Logo"
              style={{ width: "250px", height: "80px" }}
            />
            <div style={{ textAlign: "center", margin: "3rem auto" }}>
              <h2>Health Report</h2>
            </div>
            <div className="contents">
              <ul style={{ listStyle: "none" }}>
                <li>Pateint Name: </li>
                <li>Phone Number(Patient): </li>
                <li>Patient Age: </li>
                <li>Patient Address: </li>
                <li>Doctor Name: </li>
                <li>Contact Number(Doctor): </li>
                <li>Report Generated Duration : </li>
                <li>Timestamp of Report Generation : </li>
              </ul>
              <ul style={{ listStyle: "none", margin: '1rem auto' }}>
                <li>Temperature Average: </li>
                <li>SpO<sub>2</sub> Average: </li>
                <li>Blood Pressure Average: </li>
                <li>Beats Per Minute(BPM) Average: </li>
              </ul>
            </div>
          </div>
        </div>
        <Button
          className="print"
          style={{ width: "150px", alignSelf: "center", fontSize: "17px" }}
          size="large"
          variant="contained"
          onClick={() => {
            var reportPrint = document.querySelector("#report");
            var opt = {
              margin: 0,
              filename: "Report.pdf",
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 1, scrollY: 0 },
              jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
            };
            html2pdf().set(opt).from(reportPrint).save();
          }}
        >
          Print
        </Button>
      </div>
    );
}
 
export default ReportComp;