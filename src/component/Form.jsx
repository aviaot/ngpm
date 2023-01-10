import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Details from "./Details";
import PaymentMode from "./PaymentMode";
import Success from "./Success";
import PayCard from "./PayCard";
import Footer from "./Footer";
import { paymentApiCall } from "../api/agent";
import { v4 as uuid } from 'uuid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    justifyContent: "center",
    height: "50vw",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepper: {
    iconColor: "#2E3B55",
  },
}));

function getSteps() {
  // return ["Enter Details", "Payment Mode", "Payment", "Order Confirmed"];
  return ["Payment Mode", "Payment", "Payment Success"];

}

function getStepContent(step) {
  console.log("getStepContent", step);
  switch (step) {
    case 0:
      return <PaymentMode />;
    case 1:
      return <PayCard />;
    case 2:
      console.log("getStepContent", step);
      return <Success />;
    default:
      return "Unknown step";
  }
}


export default function Form({ backToMainScreen, screenData }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === 1) {
      payment(newSkipped);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  async function generateTicketsArray(noOfTickets) {

    let result = [];

    for (let i = 0; i < noOfTickets; i++) {
      const unique_id = uuid();
      const small_id = unique_id.slice(0, 8)
      result.push({
        ticketId:small_id,
        ticketQR: "ABC",
        ticketStatus: "confirmed"
      }
      )
    }

    return result;
  }
  async function payment(newSkipped) {

    try {
      const {sessionId, fare,ticketType,ticketsNo,fromStation,toStation,checkedType,phoneNumber} = screenData;
      const unique_id = uuid();
      //const small_id = unique_id.slice(0, 8)
      let tickestArray = await generateTicketsArray(ticketsNo);
      let price = fare;
      if(checkedType)
      {
        price = fare*ticketsNo*2*0.9;
      } else{
        price = fare*ticketsNo;
      }
        let postData = {
          transactionId: unique_id,
          sessionId:sessionId,
          transactionAmount: price,
          ticketType: checkedType?"two_way":"one_way",
          numberOfTickets: ticketsNo,
          sourceStation: fromStation.stationCode,
          destinationStation: toStation.stationCode,
          phoneNumber:phoneNumber,
          tickets: tickestArray,
        };
      const { data } = await paymentApiCall(postData);

      console.log("data", data)
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    } catch (error) { }
  }
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12}>
          <AppBar position="static" style={{ background: "#2E3B55" }}>

          </AppBar>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ marginTop: "5%" }}>
            <CardContent>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <AppBar
                    position="static"
                    style={{ background: "#2E3B55", alignItems: "center" }}
                  >

                  </AppBar>
                </Grid>
                <Grid item xs={12}>
                  <Stepper activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label, index) => {
                      const stepProps = {};
                      const labelProps = {};
                      if (isStepOptional(index)) {
                        labelProps.optional = (
                          <Typography variant="caption"></Typography>
                        );
                      }
                      if (isStepSkipped(index)) {
                        stepProps.completed = false;
                      }
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.actions}>
                    {activeStep === steps.length ? (
                      <div>
                        <Typography
                          className={classes.instructions}
                        ></Typography>
                        <Button
                          onClick={handleReset}
                          className={classes.button}
                        >
                          Reset
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Typography
                          className={classes.instructions}
                          style={{ height: "350px" }}
                        >
                          {getStepContent(activeStep)}
                          <br />
                        </Typography>
                        <div className={classes.actions}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>

                          <Button
                            variant="contained"
                            style={{ background: "#2E3B55", color: "#ffffff" }}
                            onClick={handleNext}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1
                              ? "Finish"
                              : "Next"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Footer />
        </Grid>
      </Grid>
    </div>
  );
}
