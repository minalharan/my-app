import React, { Component } from "react";
import "./App.css";
import { Navbar, Nav, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import TableRow1 from "./components/signUp/TableRow1";
import "./App.js";

class Navbar1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      cId: localStorage.getItem("cId"),
      isLoggedIn: false,
      Value: "",
      disabled: true,
      hide: "",
      enable: false
    };
  }
  componentDidMount = async () => {
    console.log(this.props);
    console.log("this.props");

    const token = localStorage.getItem("token");
    const { cId } = this.state;
    const obj = { cId };
    const res = await axios.post("http://192.168.2.112:8000/profile", obj, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res.data.result);
    console.log("result");
    const result1 = res.data.result;
    console.log("result1");
    console.log(result1);
    this.setState({ profile: result1, Value: res.data.success });
    console.log("res.data.success");
    console.log(res.data.success);

    if (!result1) {
      console.log("error");
    }
  };
  handleClose = e => {
    this.setState({ show: false, disabled: !this.state.disabled });
  };

  handleShow = e => {
    this.setState({ show: true, disabled: true });
  };
  handleClick = e => {
    this.setState({
      show: !this.state.show
    });
  };
  isEnable = e => {
    this.setState({
      disabled: !this.state.disabled,
      enable: true
    });
  };
  render() {
    const { profile } = this.state;
    console.log(this.state.Value);
    return (
      <>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />

        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Vendor</Navbar.Brand>
          <Nav className="ml-auto">
            <NavLink
              exact
              to={"/"}
              className="nav-item Box-model"
              activeClassName={"active"}
            >
              <i class="fa fa-home top" aria-hidden="true" />
              Home
            </NavLink>
            {localStorage.getItem("token") ? (
              <>
                <NavLink
                  to={"/product-list"}
                  className="nav-item Box-model"
                  activeClassName={"active"}
                >
                  <i class="fa fa-list top" aria-hidden="true" />
                  Product List
                </NavLink>

                <NavLink
                  to={"/logout"}
                  className="nav-item Box-model"
                  activeClassName={"active"}
                >
                  <i class="fas fa-sign-out-alt" /> Logout
                </NavLink>

                <Link onClick={this.handleShow} className="nav-item Box-model">
                  <i class="fa fa-user" aria-hidden="true" />
                  Profile
                </Link>
                <>
                  <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    // className="animate"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div>
                        <TableRow1
                          obj={profile}
                          key={profile._id}
                          hide={this.state.disabled}
                          isEnable={this.isEnable}
                          disabled={this.state.disabled}
                          enable={this.state.enable}
                          Value={this.state.Value}
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              </>
            ) : (
              <>
                <NavLink
                  to={"/signup"}
                  className="nav-item Box-model"
                  activeClassName={"active"}
                >
                  <i class="fa fa-user-plus top" aria-hidden="true" />
                  Sign Up
                </NavLink>
                <NavLink
                  to={"/login"}
                  className="nav-item Box-model"
                  activeClassName={"active"}
                >
                  <i class="fas fa-sign-in-alt top" />
                  Log In
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar>
      </>
    );
  }
}
export default Navbar1;
