import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

function RelevantConditions({showRelevantConditions, relevantConditions, handleRelevantConditionClick, additionalFrequency}) {
  if (showRelevantConditions) {
    return (
      <div style={{ marginTop: "7px" }}>
        Sorry we couldn't diagnose your condition. Please check out these other
        conditions you might have to see more results.
        <div style={{ marginTop: "7px" }}>
          {relevantConditions.length > 0 ? (
            relevantConditions.map((condition) => {
              return (
                <Button
                  key={condition.id}
                  variant="contained"
                  onClick={() => handleRelevantConditionClick(condition)}
                  data-testid="rel-condition"
                >
                  {condition.name}
                </Button>
              );
            })
          ) : (
            <div>Sorry we did not find any similar conditions.</div>
          )}
        </div>
        {additionalFrequency.frequency >= 0 && (
          <div style={{ marginTop: "7px" }}>
            <Typography>Thank you!</Typography>
            <Typography>
              Here is the number of similar diagnosis of this condition in the
              last month
            </Typography>
            <div style={{ fontWeight: "bold" }}>
              {additionalFrequency.frequency}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default RelevantConditions;
