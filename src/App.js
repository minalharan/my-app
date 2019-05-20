import React, { Component } from "react";
import SignUp from "./components/signUp/signUp";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./components/Home/home";
import "./App.css";
import Login from "./components/login/login";
import AddProduct from "./components/addProduct/addProduct";
import { Container } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "./components/product list/productList";
import Update from "./components/product list/update";
import Logout from "./components/logout/logout";
import Show from "./components/show/showProduct";
import TableRow1 from "./components/signUp/TableRow1";
import NoMatch from "./components/show/NoMatch";
import ForgotPassword from "./components/signUp/ForgotPassword";
import ResetPassword from "./components/signUp/ResetPassword";
import Navbar1 from "./Navbar.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      cId: localStorage.getItem("cId")
      // isLoggedIn: false
    };
  }
  render() {
    const DefaultLayout = ({ component: Component, ...rest }) => {
      console.log("djfgfgudfyds");
      return (
        <Route
          {...rest}
          render={props => (
            <>
              <Navbar1 {...props} />
              <Component {...props} />
            </>
          )}
        />
      );
    };
    return (
      <Router>
        <>
          <Container fluid>
            <Switch>
              <DefaultLayout exact path="/" component={Home} />
              <DefaultLayout path="/signup" component={SignUp} />
              <DefaultLayout path="/login" component={Login} />
              <DefaultLayout path="/add-product" component={AddProduct} />
              <DefaultLayout path="/product-list" component={ProductList} />
              <DefaultLayout path="/gtitem/:_id" component={Update} />
              <DefaultLayout path="/logout" component={Logout} />
              <DefaultLayout path="/getitem/:_id" component={Show} />
              <DefaultLayout path="/profile" component={TableRow1} />
              <DefaultLayout
                path="/forgot-password"
                component={ForgotPassword}
              />
              <DefaultLayout path="/reset/:token1" component={ResetPassword} />
              <DefaultLayout path="/navbar" component={Navbar1} />
              <DefaultLayout component={NoMatch} />
            </Switch>
          </Container>
        </>
      </Router>
    );
  }
}

export default App;
