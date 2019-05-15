import React, { Component } from "react";
import SignUp from "./components/signUp/signUp";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./components/Home/home";
import "./App.css";
import Login from "./components/login/login";
import AddProduct from "./components/addProduct/addProduct";
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "./components/product list/productList";
import Update from "./components/product list/update";
import Logout from "./components/logout/logout";
import Show from "./components/show/showProduct";
import TableRow1 from "./components/signUp/TableRow1";
import NoMatch from "./components/show/NoMatch";
import ForgotPassword from "./components/signUp/ForgotPassword";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      cId: localStorage.getItem("cId")
      // isLoggedIn: false
    };
  }
  componentDidMount = async () => {
    if (!token) {
      this.props.history.push("/login");
    }
    console.log(this.props);
    console.log("this.props");
    const token = localStorage.getItem("token");
    const { cId } = this.state;
    const obj = { cId };
    const res = await axios.post("http://192.168.2.112:8000/profile", obj, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (token.expiresIn === true) {
      console.log("in iF");
      this.props.history.push("/login");
    }
    console.log(res.data.result);
    console.log("result");
    const result1 = res.data.result;
    console.log("result1");
    console.log(result1);
    this.setState({ profile: result1 });
    console.log("profile");

    if (!result1) {
      console.log("error");
    }
  };

  handleClose = e => {
    this.setState({ show: false });
  };

  handleShow = e => {
    this.setState({ show: true });
  };
  handleClick = e => {
    this.setState({
      show: !this.state.show
    });
  };
  render() {
    const { profile } = this.state;
    return (
      <Router>
        <>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Vendor</Navbar.Brand>
            <Nav className="m-auto">
              <NavLink
                exact
                to={"/"}
                className="nav-item Box-model"
                activeClassName="active"
              >
                <Button>
                  <i class="fas fa-home top" />
                  Home
                </Button>
              </NavLink>
              {localStorage.getItem("token") ? (
                <>
                  <NavLink
                    to={"/product-list"}
                    className="nav-item Box-model"
                    activeClassName="active"
                  >
                    <Button>
                      {" "}
                      <i class="fas fa-list top" />
                      Product List
                    </Button>
                  </NavLink>

                  <NavLink
                    to={"/logout"}
                    className="nav-item Box-model"
                    activeClassName="active"
                  >
                    <Button>
                      <i class="fas fa-sign-out-alt top" />Logout
                    </Button>
                  </NavLink>

                  <Button onClick={this.handleShow}>
                    <i class="fas fa-user top" />
                    Profile
                  </Button>
                  <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {" "}
                      <div>{<TableRow1 obj={profile} key={profile._id} />}</div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              ) : (
                <>
                  <NavLink
                    to={"/signup"}
                    className="nav-item Box-model"
                    activeClassName="active"
                  >
                    <Button>
                      {" "}
                      <i class="fas fa-user-plus top" />
                      Sign Up
                    </Button>
                  </NavLink>
                  <NavLink
                    to={"/login"}
                    className="nav-item Box-model"
                    activeClassName="active"
                  >
                    <Button>
                      {" "}
                      <i class="fas fa-sign-in-alt top" />
                      Log In
                    </Button>
                  </NavLink>
                </>
              )}
            </Nav>
          </Navbar>

          <Container>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route path="/add-product" component={AddProduct} />
              <Route path="/product-list" component={ProductList} />
              <Route path="/gtitem/:_id" component={Update} />
              <Route path="/logout" component={Logout} />
              <Route path="/getitem/:_id" component={Show} />
              <Route path="/profile" component={TableRow1} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route component={NoMatch} />
            </Switch>
          </Container>
        </>
      </Router>
    );
  }
}

export default App;
