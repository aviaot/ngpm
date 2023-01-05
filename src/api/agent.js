import axios from 'axios';
import _ from 'lodash';

export const ROOT_URL = 'https://chatbotomkaraonline.southindia.cloudapp.azure.com/';
//"http://localhost:4000";

const agent = axios.create({
  baseURL: ROOT_URL,
});

const EXPIRED_TOKEN_MSG = 'The token is expired, please try again!';



agent.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (err) => Promise.reject(err)
);

agent.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    
      return agent(originalRequest);

      // axios.defaults.headers.common['Authorization'] = 'Basic ' + access_token;
    }
    return Promise.reject(err);
  }
);


export const getStationList = () => {
  return agent.get('/v1/stations');
};


export const getFare = (from,to) => {
  return agent.get(`/v1/stations/fare?sourceStationCode=${from}&destinationStationCode=${to}`);
};

export const paymentApiCall = (postData) => {
  return agent.post('/v1/payments',postData);
};


export default agent;

// {
//   "transactionId": "121",
//   "sessionId":"refegeg42e4e24e",
//   "transactionAmount": 10.9,
//   "ticketType": "one-way",
//   "numberOfTickets": 1,
//   "sourceStation": "ABC",
//   "destinationStation": "XYZ",
//   "tickets":[{
//       "ticketId": "1",
//       "ticketQR":"ABC",
//       "ticketStatus":"confirmed"
//   }]
// }