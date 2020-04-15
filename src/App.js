import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Container from "@material-ui/core/Container";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAllSymptoms, getConditionForSymptom } from "./services";

function App() {
  

  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    getAllSymptoms().then(response => {
      if (response.ok) {
        response.json().then(function(data) {
          if (data.symptoms) {
            console.log(data);
            setSymptoms(data.symptoms)
          }
        });
      }
    })
  }, [])

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
  const [enableDiagnoseOptionYes, setDiagnoseOptionYes] = useState(true);

  const submitSymptom = (e) => {
    e.preventDefault();
    setSymptomSubmitted(true);
    getConditionForSymptom({symptom: selectedSymptom.id}).then(response => {
      console.log(response)
      if (response.ok) {
        response.json().then(function(data) {
          if (data.condition) {
            console.log(data.condition)
            setCondition(data.condition)
          }
        });
      }
    }).finally(() => {
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
    setDiagnoseOptionNo(true)
    setDiagnoseOptionYes(true)
    setShowConditionFrequenecy(false)
    setShowRelevantConditions(false)
  };
  return (
    <div className="App">
      <Header></Header>
      <Container maxWidth="sm">
        <Typography>Hello! Lets help get you diagnosed</Typography>
        <Typography>Start over by clicking the button below.</Typography>
        <Button variant="contained" onClick={resetForm}>
          Start Over
        </Button>
        <br />
        <Typography>What are your symptoms?</Typography>
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
              onClick={() => {
                setShowConditionFrequenecy(true)
                setDiagnoseOptionNo(false)
              }}
              disabled={!enableDiagnoseOptionYes}
            >
              Yes
            </Button>
            <Button variant="contained" disabled={!enableDiagnoseOptionNo} onClick={() => {
              setDiagnoseOptionYes(false)
              setShowRelevantConditions(true)
            }}>No</Button>
          </div>
        )}
        {showConditionFrequency && (
          <div>
            <Typography>Thank you!</Typography>
            <Typography>Here is are the number of similar diagnosis of this condition</Typography>
            <div>6</div>
          </div>
        )}
        {
          showRelevantConditions && (
            <div>
              Sorry we couldn't diagnose your condition. Please check out these other conditions you might have.
            </div>
          )
        }
      </Container>
    </div>
  );
}

export default App;
