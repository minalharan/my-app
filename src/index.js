import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
//import { Route, BrowserRouter as Router } from 'react-router-dom';
import App from "./App";

import { ToastContainer } from "react-toastify";
// import LogIn from './LogIn';

import * as serviceWorker from "./serviceWorker";
import { library } from '@fortawesome/fontawesome-svg-core'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
library.add(faStroopwafel)

// const routing = (
//     <Router>
//       <div>
//         <Route exact path="/" component={SignUp} />
//         <Route path="/LogIn" component={LogIn} />

//       </div>
//     </Router>
//   )

ReactDOM.render(
  <>
    <App />
    <ToastContainer />
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
