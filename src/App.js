import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import './App.css';
import Container from "@material-ui/core/Container";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
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
            console.log(data);
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
  const [additionalFrequency, setAdditionalFrequency] = useState({})

  const handleRelevantConditionClick = (condition) => {
    console.log(condition)
    const conditionId = condition.id
    saveDiagnosis({conditionId})
    getReportForCondition({ condition: conditionId })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        response.json().then(function (data) {
          if (data.report) {
            console.log(data.report);
            setAdditionalFrequency(data.report);
          }
        });
      }
    });
  }

  const submitSymptom = (e) => {
    e.preventDefault();
    setSymptomSubmitted(true);
    getConditionForSymptom({ symptom: selectedSymptom.id })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          response.json().then(function (data) {
            if (data.condition) {
              console.log(data.condition);
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

  const handleSymptomChange = (e, value) => {
    setSelectedSymptom(value);
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
    setAdditionalFrequency({})
  };

  const handleConditionConfirm = () => {
    saveDiagnosis({conditionId: condition.id})
    getReportForCondition({ condition: condition.id })
      .then((response) => {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
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
            console.log(data);
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
      <Header></Header>
      <Container maxWidth="sm">
        <Typography>Hello! Lets help get you diagnosed</Typography>
        <Typography>Start your diagnosis over by clicking the button below.</Typography>
        <Button variant="contained" onClick={resetForm}>
          Start Over
        </Button>
        <br />
        <Typography>What is your symptom?</Typography>
        <form onSubmit={submitSymptom}>
          <Autocomplete
            {...defaultProps}
            id="clear-on-escape"
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
          <div>
            <Typography>Do you have the condition?</Typography>
            <Typography>{condition.name}</Typography>
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
            >
              No
            </Button>
          </div>
        )}
        {showConditionFrequency && (
          <div>
            <Typography>Thank you!</Typography>
            <Typography>
              Here is are the number of similar diagnosis of this condition in the last month
            </Typography>
            <div>{conditionFrequency}</div>
          </div>
        )}
        {showRelevantConditions && (
          <div>
            Sorry we couldn't diagnose your condition. Please check out these
            other conditions you might have to see more results.
            <div>
            {relevantConditions.length > 0 ? relevantConditions.map(condition => {
              return <Button key={condition.id} variant="contained" onClick={() => handleRelevantConditionClick(condition)}>{condition.name}</Button>
            }) : <div>Sorry we did not find any similar conditions.</div>}
            </div>
            {additionalFrequency.frequency && (
              <div>
              <Typography>Thank you!</Typography>
              <Typography>
                Here is are the number of similar diagnosis of this condition in the last month
              </Typography>
              <div>{additionalFrequency.frequency}</div>
            </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;
