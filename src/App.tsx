import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { IconButton, Snackbar } from "@mui/material";
import ShareIcon from "@mui/icons-material/ContentCopy";
import Autocomplete from "@mui/material/Autocomplete";
import GoogleMap from "./component/GoogleMap";
import { useToaster } from "react-hot-toast/headless";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Wrapper } from "@googlemaps/react-wrapper";
import PayCard from "./component/PayCard";
import PaymentForm from "./component/Form";
import { getStationList, getFare, paymentApiCall } from "./api/agent";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";

interface StationListData {
  _id: string;
  name: string;
  sourceStation: string;
  stationCode: string;
}
interface QueryParamData {
  sessionId: null | string;
  typeOfTickets: null | string;
  transactionAmount: null | string;
  numberOfTickets: null | string;
  sourceStation: null | string;
  destinationStation: null | string;
  phoneNumber: null | string;
}

function App() {
  const [fromStation, setFromStation] = useState<StationListData | null>(null);
  const [toStation, setToStation] = useState<StationListData | null>(null);
  const [ticketsNo, setTicketsNo] = useState(1);
  const [ticketType, setTicketType] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkedType, setCheckedType] = React.useState([false, false]);
  const [isTicketNumberError, setIsTicketNumberError] = useState(false);
  const [stationList, setStationList] = useState<StationListData[]>([
    { sourceStation: "Khapri", stationCode: "KHP", name: "Khapri", _id: "1" },
  ]);
  const [isPayment, setIsPaymentPage] = useState(false);
  const [fare, setFare] = useState(0);
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  useEffect(() => {
    if (
      fromStation &&
      toStation &&
      fromStation.stationCode !== toStation.stationCode
    ) {
      getFareData();
    } else {
      setFare(0);
    }
  }, [fromStation, toStation]);

  async function getFareData() {
    try {
      if (
        fromStation &&
        fromStation?.stationCode &&
        toStation &&
        toStation?.stationCode
      ) {
        const { data } = await getFare(
          fromStation.stationCode,
          toStation.stationCode
        );
        let fare_ = data.fare;
        // fare_ = fare_.split("")[0];
        setFare(fare_);
      }
    } catch (error) {}
  }

  const getQueryParams = (query = null) => {
    return (
      (query || window.location.search.replace("?", ""))

        // get array of KeyValue pairs
        .split("&")

        // Decode values
        .map((pair) => {
          let [key, val] = pair.split("=");

          return [key, decodeURIComponent(val || "")];
        })

        // array to object
        .reduce((result, [key, val]) => {
          (result as any)[key] = val as any;
          return result;
        }, {}) as QueryParamData
    );
  };
  async function getStation() {
    try {
      const { data } = await getStationList();
      //  localStorage.setItem(REGISTER_DEVICE, true);
      const arr = JSON.parse(JSON.stringify(data));
      arr.forEach((obj: StationListData) =>
        renameKey(obj, "sourceStation", "name")
      );
      //const updatedJson = JSON.stringify( arr );
      setStationList(arr);
    } catch (error) {}
  }
  function renameKey(obj: any, oldKey: any, newKey: any) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

  useEffect(() => {
    getStation();
  }, []);

  useEffect(() => {
    let res = getQueryParams();
    if (stationList && stationList.length > 1 && res) {
      if (res.sourceStation) {
        let sourceObject = stationList.find(
          (i) => i.stationCode.toUpperCase() === res.sourceStation!.toUpperCase()
        );
        console.log("sourceObject", sourceObject);
        setFromStation(sourceObject as StationListData);
      }
      if (res.destinationStation) {
        let destiObject = stationList.find(
          (i) => i.stationCode.toUpperCase() === res.destinationStation!.toUpperCase()
        );
        console.log("sourceObject", destiObject);
        setToStation(destiObject as StationListData);
      }
      if (res.transactionAmount) {
        setFare(parseInt(res.transactionAmount, 0));
      }
      if (res.numberOfTickets) {
        setTicketsNo(parseInt(res.numberOfTickets, 0));
      }
      if (res.typeOfTickets) {
        setTicketType(res.typeOfTickets);
        if (res.typeOfTickets === "one_way") {
          setCheckedType([false, checkedType[0]]);
        } else {
          setCheckedType([true, checkedType[0]]);
        }
      }
      if (res.sessionId) {
        setSessionId(res.sessionId);
        setIsPaymentPage(true);
      }
      if (res.phoneNumber) {
        setPhoneNumber(res.phoneNumber);
      }
    }
    console.log("getQueryParams", res, typeof res);
  }, [stationList]);

  const handleCheckType = (event: any) => {
    setCheckedType([event.target.checked, checkedType[0]]);
  };
  const getFareAfterCalculation = () => {
    return checkedType[0] ? fare * ticketsNo * 2 * 0.9 : fare * ticketsNo;
  };
  const backToMainScreen = (isPaymentSuccess: boolean) => {
    setIsPaymentPage(false);
  };
  return (
    <>
      {isPayment === false ? (
        <div className="App">
          <div className="container py-3">
            <header>
              <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                <a
                  href="/"
                  className="d-flex align-items-center text-dark text-decoration-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="32"
                    className="me-2"
                    viewBox="0 0 118 94"
                    role="img"
                  >
                    <title>Nagpur Metro Booking</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="fs-4">Nagpur Metro Booking</span>
                </a>

                {/* <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
            <a className="me-3 py-2 text-dark text-decoration-none" href="#">Features</a>
            <a className="me-3 py-2 text-dark text-decoration-none" href="#">Enterprise</a>
            <a className="me-3 py-2 text-dark text-decoration-none" href="#">Support</a>
            <a className="py-2 text-dark text-decoration-none" href="#">Pricing</a>
          </nav> */}
              </div>
            </header>

            <main>
              <div className="row row-cols-1 row-cols-md-2 mb-3">
                <div className="col">
                  <div className="card mb-4 rounded-3 shadow-sm card-bg">
                    <div className="card-body">
                      <h5 className="card-title pricing-card-title plan-text">
                        Plan Your Journey
                      </h5>
                      {/* <p>
                        Click here to plan through
                        <a href="#" className="text-decoration-none">
                          <span>Interactive Map</span>
                        </a>
                      </p> */}
                      <div className="mb-3">
                        <label className="form-label custom-label">From:</label>
                        {/* <select
                    className="form-select select-box"
                    aria-label="Select station name"
                  >
                    <option selected>Select station name</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select> */}
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={stationList}
                          getOptionLabel={(option) => option.name}
                          sx={{ width: "80%" }}
                          renderInput={(params) => (
                            <TextField {...params} label="Select station" />
                          )}
                          value={fromStation}
                          onChange={(event, newValue: any) => {
                            setFromStation(newValue);
                            // setId(newValue.id);
                            // setTitle(newValue.title);
                          }}
                          // style={{backgroundColor: "#ffffff"}}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label custom-label">To:</label>
                        {/* <select
                    className="form-select select-box"
                    aria-label="Select station name"
                  >
                    <option selected>Select station name</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select> */}
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={stationList}
                          getOptionLabel={(option) => option.name}
                          sx={{ width: "80%" }}
                          renderInput={(params) => (
                            <TextField {...params} label="Select station" />
                          )}
                          // style={{backgroundColor: "#ffffff"}}
                          value={toStation}
                          onChange={(event, val: any) => {
                            console.log(val);
                            setToStation(val);
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label custom-label">
                          Please enter number of tickets:
                        </label>
                        <Box
                          component={"form"}
                          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                          noValidate
                          autoComplete="off"
                        >
                          <div>
                            <TextField
                              error={isTicketNumberError}
                              id="outlined-number"
                              variant="outlined"
                              label="Maximum 6"
                              type="number"
                              value={ticketsNo}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(event: any) => {
                                //console.log(val);
                                if (
                                  event.target.value < 1 ||
                                  event.target.value > 6
                                ) {
                                  //setIsTicketNumberError(true);
                                } else {
                                  setTicketsNo(event.target.value);
                                  //setIsTicketNumberError(false);
                                }
                              }}
                            />
                          </div>
                          <FormControlLabel
                            label={"Return"}
                            control={
                              <Checkbox
                                checked={checkedType[0]}
                                onChange={handleCheckType}
                              />
                            }
                          />
                        </Box>
                      </div>
                      {/* <div className="mb-0">
                    <label className="form-label custom-label">Leaving:</label>
                  </div>
                  <button
                    type="button"
                    className="w-20 btn btn-lg btn-outline-primary time-button"
                  >
                    Now
                  </button>
                  <a href="#" className="text-decoration-none">
                    <span className="change-time">Change Time</span>
                  </a>
                  <h5 className="card-title pricing-card-title advance-filter">
                    Advanced Filter
                  </h5> */}

                      {fromStation &&
                      toStation &&
                      fromStation.stationCode !== toStation.stationCode ? (
                        <div className="row">
                          <h5>
                            {`${fromStation?.stationCode},${toStation?.stationCode},${ticketsNo}`}
                            <IconButton
                              color="primary"
                              onClick={async (e) => {
                                //e.target.focus();

                                if (fromStation && toStation) {
                                  if (
                                    fromStation.stationCode ===
                                    toStation.stationCode
                                  ) {
                                    notifyError(
                                      "Source and destination can not be same"
                                    );
                                  } else {
                                    if ("clipboard" in navigator) {
                                      await navigator.clipboard.writeText(
                                        `${fromStation?.stationCode},${toStation?.stationCode},${ticketsNo}`
                                      );
                                    } else {
                                      document.execCommand(
                                        "copy",
                                        true,
                                        `${fromStation?.stationCode},${toStation?.stationCode},${ticketsNo}`
                                      );
                                    }
                                    notifySuccess("Data Copied");
                                  }
                                } else {
                                  notifyError(
                                    "Source or destination can not be empty"
                                  );
                                }
                              }}
                            >
                              <ShareIcon />
                            </IconButton>
                          </h5>
                        </div>
                      ) : null}
                      <h5 className="card-title pricing-card-title advance-filter">
                        {`Total Fare : ${getFareAfterCalculation()} ₹`}
                      </h5>

                      {/* <div>
                        <div>
                          <img
                            src="./assets/distance.png"
                            className="img short-route-img"
                            alt=""
                          />
                          <span className="short-route-text">
                            Shortest Route
                          </span>
                        </div>
                        <hr className="divider-border" />
                        <div>
                          <img
                            src="./assets/distance.png"
                            className="img minimum-route-img"
                            alt=""
                          />
                          <span className="minimum-route-text">
                            Minimum Interchange
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-45 btn btn-lg btn-primary submit-btn"
                        onClick={() => {
                          if (fromStation && toStation) {
                            if (
                              fromStation.stationCode === toStation.stationCode
                            ) {
                              notifyError(
                                "Source and destination can not be same"
                              );
                            } else {
                              setIsPaymentPage(true);
                            }
                          } else {
                            notifyError(
                              "Source or destination can not be empty"
                            );
                          }
                        }}
                      >
                        Pay
                      </button> */}
                    </div>
                  </div>
                </div>

                <div className="col mb-4 rounded-3 shadow-sm">
                  <GoogleMap></GoogleMap>
                </div>
              </div>
            </main>

            <footer className="pt-4 my-md-5 pt-md-5 border-top"></footer>
          </div>
        </div>
      ) : (
        <main>
          <div className="row">
            <div className="col">
              <div className="card-body">
                <PaymentForm
                  backToMainScreen={backToMainScreen}
                  screenData={{
                    sessionId: sessionId,
                    fare: fare,
                    ticketType: ticketType,
                    ticketsNo: ticketsNo,
                    fromStation: fromStation,
                    toStation: toStation,
                    checkedType: checkedType[0],
                    phoneNumber: phoneNumber,
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default App;
