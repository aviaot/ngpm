import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import statiaonList from "./static/station.json";
import GoogleMap from './component/GoogleMap';
import { useToaster } from 'react-hot-toast/headless';

import { Wrapper } from "@googlemaps/react-wrapper";
import PayCard from './component/PayCard'
import PaymentForm from './component/Form'
import {getStationList} from './api/agent';
import toast, { Toaster } from 'react-hot-toast';

interface StationListData {
  _id: string;
  name: string;
  stationCode: string,
  fareList: []
}

function App() {
  const [fromStation, setFromStation] = useState<StationListData | null>(null);
  const [toStation, setToStation] = useState<StationListData | null>(null);
  const [stationList,setStationList] = useState([{name:'av'}])
  const [isPayment,setIsPaymentPage] = useState(true);
  const [fare,setFare] = useState("");
  const notifySuccess = (message : string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

useEffect(()=>{

  if(fromStation && toStation && fromStation.stationCode !==toStation.stationCode)
  {
    setFare("5");
  } else{
    setFare("");
  }

},[fromStation,toStation])

  async function getStation() {
    try {
      const  {data}  = await getStationList();
    //  localStorage.setItem(REGISTER_DEVICE, true);
    const arr = JSON.parse(JSON.stringify(data));
    arr.forEach( (obj: StationListData) => renameKey( obj, 'sourceStation', 'name' ) );
    //const updatedJson = JSON.stringify( arr );

      setStationList(arr);
    } catch (error) {}
  }
  function renameKey ( obj: any, oldKey: any, newKey: any ) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
  
  
  useEffect(()=>{

    getStation();
  },[])
  return (
    <>
    {isPayment === false? (
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
                  <p>
                    Click here to plan through
                    <a href="#" className="text-decoration-none">
                      <span>Interactive Map</span>
                    </a>
                  </p>
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
                      // value={value}
                      onChange={(event, newValue : any) => {
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
                      onChange={(event,val : any) => {
                        console.log(val);
                        setToStation(val);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                  <label className="form-label custom-label">Select Number Of Ticets:</label>
                    <Box component={"form"}
                    sx={{'& > :not(style)':{m:1,width:'25ch'}}}
                    noValidate
                    autoComplete="off"
                    >
                        <TextField
                        id="filled-number"
                        label="Tickets"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="filled"
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
                  {fromStation && toStation && fromStation.stationCode !==toStation.stationCode ?
                   
                    (<h5 className="card-title pricing-card-title advance-filter">
                    {`${fromStation?.stationCode} - ${toStation?.stationCode}`}
                  </h5>) : null
                  }
                  <h5 className="card-title pricing-card-title advance-filter">
                    {`Total Fare : ${fare} ₹`}
                  </h5>
                  <div>
                    <div>
                      <img
                        src="./assets/distance.png"
                        className="img short-route-img"
                        alt=""
                      />
                      <span className="short-route-text">Shortest Route</span>
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
                    onClick={()=>{

                      if(fromStation && toStation)
                      {
                        
                        if (fromStation.stationCode === toStation.stationCode)
                        {
                          notifyError("Source and destination can not be same");
                        } else{
                        setIsPaymentPage(true);
                        } 



                      } else{
                        notifyError("Source or destination can not be empty");
                      }
                    }}
                  >
                    Pay
                  </button>
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
    </div> ) : 
    <main>
    <div className="row">
      <div className="col">
   
          <div className="card-body">
    <PaymentForm/>
   
    </div>
    </div>
    </div>
    </main>
    }
    </>
  );
}

export default App;