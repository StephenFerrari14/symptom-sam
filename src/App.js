import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import Container from "@material-ui/core/Container";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import RelevantConditions from "./components/RelevantConditions";
import {
  getAllSymptoms,
  getConditionForSymptom,
  getReportForCondition,
  getConditionsForSymptom,
  saveDiagnosis,
} from "./services";

function App() {
  const [symptoms, setSymptoms] = useState([]);

  // Initialize dropdown
  useEffect(() => {
    getAllSymptoms().then((response) => {
      if (response.ok) {
        response.json().then(function (data) {
          if (data.symptoms) {
            setSymptoms(data.symptoms);
          }
        });
      }
    });
  }, []);

  const defaultProps = {
    options: symptoms,
    getOptionLabel: (option) => option.name,
  };

  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptomSubmitted, setSymptomSubmitted] = useState(false);
  const [diagnosisReceived, setDiagnosisReceived] = useState(false);
  const [showConditionFrequency, setShowConditionFrequenecy] = useState(false);
  const [condition, setCondition] = useState({});
  const [enableDiagnoseOptionNo, setDiagnoseOptionNo] = useState(true);
  const [showRelevantConditions, setShowRelevantConditions] = useState(false);
  const [relevantConditions, setRelevantConditions] = useState([]);
  const [enableDiagnoseOptionYes, setDiagnoseOptionYes] = useState(true);
  const [conditionFrequency, setConditionFrequency] = useState(0);
  const [additionalFrequency, setAdditionalFrequency] = useState({});

  const submitSymptom = (e) => {
    e.preventDefault();
    setSymptomSubmitted(true);
    getConditionForSymptom({ symptom: selectedSymptom.id })
      .then((response) => {
        if (response.ok) {
          response.json().then(function (data) {
            if (data.condition) {
              setCondition(data.condition);
            }
          });
        }
      })
      .finally(() => {
        setDiagnosisReceived(true);
        setSymptomSubmitted(false);
      });
  };

  const resetForm = () => {
    setSelectedSymptom(null);
    setSymptomSubmitted(false);
    setDiagnosisReceived(false);
    setCondition({});
    setDiagnoseOptionNo(true);
    setDiagnoseOptionYes(true);
    setShowConditionFrequenecy(false);
    setShowRelevantConditions(false);
    setAdditionalFrequency({});
  };

  const handleRelevantConditionClick = (condition) => {
    const conditionId = condition.id;
    saveDiagnosis({ conditionId });
    getReportForCondition({ condition: conditionId }).then((response) => {
      if (response.ok) {
        response.json().then(function (data) {
          if (data.report) {
            setAdditionalFrequency(data.report);
          }
        });
      }
    });
  };

  const handleSymptomChange = (e, value) => {
    setSelectedSymptom(value);
  };

  const handleConditionConfirm = () => {
    saveDiagnosis({ conditionId: condition.id });
    getReportForCondition({ condition: condition.id })
      .then((response) => {
        if (response.ok) {
          response.json().then(function (data) {
            if (data.report) {
              setConditionFrequency(data.report.frequency);
            }
          });
        }
      })
      .finally(() => {
        setShowConditionFrequenecy(true);
        setDiagnoseOptionNo(false);
      });
  };

  const handleConditionRejection = () => {
    getConditionsForSymptom({ symptom: selectedSymptom.id })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            if (data.conditions) {
              setRelevantConditions(data.conditions);
            }
          });
        }
      })
      .finally(() => {
        setDiagnoseOptionYes(false);
        setShowRelevantConditions(true);
      });
  };
  return (
    <div className="App">
      <Header />
      <Container maxWidth="sm">
        <Typography style={{marginTop: "7px"}}>Hello! Lets help get you diagnosed</Typography>
        <Typography style={{marginTop: "7px"}}>
          Start your diagnosis over by clicking the button below.
        </Typography>
        <Button variant="contained" size="small" onClick={resetForm}>
          Start Over
        </Button>
        <br />
        <Typography style={{marginTop: "7px"}}>What is your symptom?</Typography>
        <form onSubmit={submitSymptom}>
          <Autocomplete
            {...defaultProps}
            id="symptoms"
            clearOnEscape
            onChange={handleSymptomChange}
            value={selectedSymptom}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select your symptom..."
                margin="normal"
              />
            )}
          />
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!selectedSymptom}
          >
            {symptomSubmitted ? (
              <CircularProgress color="secondary" />
            ) : (
              "Get Diagnosis"
            )}
          </Button>
        </form>
        {diagnosisReceived && (
          <div style={{marginTop: "7px"}}>
            <Typography>Do you have the condition?</Typography>
            <Typography style={{fontWeight: "bold"}}>{condition.name}</Typography>
            <Button
              variant="contained"
              onClick={handleConditionConfirm}
              disabled={!enableDiagnoseOptionYes}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              disabled={!enableDiagnoseOptionNo}
              onClick={handleConditionRejection}
              style={{marginLeft: "7px"}}
            >
              No
            </Button>
          </div>
        )}
        {showConditionFrequency && (
          <div style={{marginTop: "7px"}}>
            <Typography>Thank you!</Typography>
            <Typography>
              Here is the number of similar diagnosis of this condition in
              the last month
            </Typography>
            <div style={{fontWeight: "bold"}}>{conditionFrequency}</div>
          </div>
        )}
        <RelevantConditions 
          showRelevantConditions={showRelevantConditions}
          relevantConditions={relevantConditions}
          handleRelevantConditionClick={handleRelevantConditionClick}
          additionalFrequency={additionalFrequency}
        />
      </Container>
    </div>
  );
}

export default App;
