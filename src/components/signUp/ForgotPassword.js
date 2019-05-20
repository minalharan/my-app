import React, { Component } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import Validator, { ValidationTypes } from "js-object-validation";
import Swal from "sweetalert2";

import {
  Button,
  FormLabel,
  FormGroup,
  FormControl,
  Row,
  Col
} from "react-bootstrap";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      showError: false,
      messageFromServer: "",
      showNullError: false,
      isLoading: false,
      errors: {}
    };
  }
  // componentDidMount() {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     this.props.history.push("/product-list");
  //   }
  // }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };

  sendEmail = async e => {
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    try {
      const { email } = this.state;
      const obj = { email };
      const validations = {
        email: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EMAIL]: true
        }
      };
      const messages = {
        email: {
          [ValidationTypes.REQUIRED]: "Please enter email.",
          [ValidationTypes.EMAIL]: "Please enter valid email."
        }
      };
      const { isValid, errors } = Validator(obj, validations, messages);
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }

      const response = await axios.post(
        "http://192.168.2.112:8000/forgotPassword",
        obj
      );
      if (response) {
        toast.info("Forget link sent on your email");
        this.setState({ email: "", isLoading: false });

        this.props.history.push("/login");
      }
    } catch (error) {
      console.log(error.response.data);
      this.setState({ isLoading: false });
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
      toast.error(
        `${(error.response &&
          error.response.data &&
          error.response.data.message) ||
          "Unknown error"}`
      );
    }
  };

  render() {
    const { email, isLoading, errors } = this.state;
    const { email: emailError } = errors;
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />
        <Row className="animate">
          <Col sm={6} md={4} lg={4} xs={12} />
          <Col sm={6} md={4} lg={4} xs={12} className="auth-box1">
            <h2 align="center">Forgot Password</h2>
            <br />
            <form onSubmit={this.sendEmail} noValidate>
              <ToastContainer />
              <FormGroup>
                <i class="fa fa-envelope top" />
                &nbsp;
                <FormLabel>Enter Email </FormLabel>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={this.handleChange("email")}
                />
                {emailError ? (
                  <p className=" text-danger">{emailError}</p>
                ) : null}
              </FormGroup>
              <Button type="submit" variant="outline-success">
                {" "}
                {isLoading ? "please wait.." : "Submit"}
              </Button>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              &nbsp; &nbsp; &nbsp;
              <Link to={"/"}>
                <Button variant="outline-primary">Home</Button>
              </Link>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ForgotPassword;
