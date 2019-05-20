import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from "react-toastify";

import {
  Button,
  FormLabel,
  FormGroup,
  FormControl,
  Row,
  Col
} from "react-bootstrap";
class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      resetPasswordToken: "",
      updated: false,
      isLoading: true,
      error: false,
      errors: {}
    };
  }

  componentDidMount = async () => {
    try {
      const response = await axios.get(
        "http://192.168.2.112:8000/reset/" + this.props.match.params.token1
      );
      if (response) {
        this.setState({
          email: response.data.user.email,
          resetPasswordToken: response.data.user.resetPasswordToken,
          updated: true
        });
      }
    } catch (error) {
      console.log(error.response.data);
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: "Something went wrong! in link"
        // footer: '<a href>Why do I have this issue?</a>'
      });
      this.setState({
        updated: false,
        isLoading: false,
        error: true
      });
    }
  };
  updatePassword = async e => {
    e.preventDefault();
    try {
      const { email, password, confirmPassword } = this.state;
      const obj = { email, password, confirmPassword };
      const validations = {
        email: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EMAIL]: true
        },
        password: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.MINLENGTH]: 4
        },
        confirmPassword: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EQUAL]: "password"
        }
      };
      const messages = {
        email: {
          [ValidationTypes.REQUIRED]: "Please enter email.",
          [ValidationTypes.EMAIL]: "Please enter valid email."
        },
        password: {
          [ValidationTypes.REQUIRED]: "Please enter password.",
          [ValidationTypes.MINLENGTH]: "Please enter at least 4 characters."
        },
        confirmPassword: {
          [ValidationTypes.REQUIRED]: "Please enter confirm password.",
          [ValidationTypes.EQUAL]: "Password and confirm password didn't match."
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

      const result = await axios.put(
        "http://192.168.2.112:8000/updatePasswordViaEmail",
        {
          email: this.state.email,
          password: this.state.password,
          confirmPassword: this.state.password,
          resetPasswordToken: this.props.match.params.token1
        }
      );
      if (result) {
        this.setState({
          email: "",
          password: "",
          confirmPassword: "",
          isLoading: false
        });
        Swal.fire({
          position: "center",
          type: "success",
          title: "Your Password Reset Successfully",
          showConfirmButton: false,
          timer: 1500
        });
        this.props.history.push("/login");
        console.log(result.data);
        this.setState({
          error: false
        });
      }
    } catch (error) {
      console.log(error.response.data);
      this.setState({ isLoading: false });
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: "Something went wrong!"
        // footer: '<a href>Why do I have this issue?</a>'
      });
      toast.error(
        `${(error.response &&
          error.response.data &&
          error.response.data.message) ||
          "Unknown error"}`
      );
      console.log(error.response.data.message);
    }
  };

  onInputChange = e => {
    const { target } = e;
    const { value, name } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };

  render() {
    const { password, updated } = this.state;
    const { errors, confirmPassword } = this.state;
    const {
      password: passwordError,
      confirmPassword: confirmPasswordError
    } = errors;

    if (updated == false) {
      return (
        <>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
            integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
            crossorigin="anonymous"
          />
          <div className="auth-box1 animate">
            <div>
              <h4>
                Problem resetting password. Please send another reset link.
              </h4>
              <Link to={"/"}>
                <Button>Go Home</Button>
              </Link>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <Link to={"/forgot-password"}>
                <Button>Forgot Password</Button>
              </Link>
            </div>
          </div>
        </>
      );
    } else if (updated == true) {
      return (
        <>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
            integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
            crossorigin="anonymous"
          />
          <div className="animate">
            <h2 align="center">Forgot Password</h2>
            <Row>
              <Col sm={6} md={4} lg={4} xs={12} />
              <Col sm={6} md={4} lg={4} xs={12} className={"auth-box1"}>
                <form
                  className="password-form"
                  onSubmit={this.updatePassword}
                  noValidate
                >
                  <FormGroup>
                    <FormLabel>
                      <i class="fas fa-key top" /> &nbsp; Enter New Password{" "}
                      <span className="required">*</span>
                    </FormLabel>
                    <FormControl
                      required="true"
                      type="password"
                      placeholder="Enter Password"
                      name="password"
                      value={password}
                      onChange={this.onInputChange}
                    />
                    {passwordError ? (
                      <p className=" text-danger">{passwordError}</p>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>
                      <i class="fas fa-key top" /> &nbsp; Enter Confirm Password{" "}
                      <span className="required">*</span>
                    </FormLabel>
                    <FormControl
                      required="true"
                      type="password"
                      placeholder="Enter Confirm Password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={this.onInputChange}
                    />
                    {confirmPasswordError ? (
                      <p className=" text-danger">{confirmPasswordError}</p>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Button type="submit" variant="outline-success">
                      Update Password
                    </Button>
                    &nbsp;&nbsp;
                    <Link to={"/"}>
                      <Button variant="outline-primary">Go Home</Button>
                    </Link>
                  </FormGroup>
                </form>
              </Col>
            </Row>
          </div>
        </>
      );
    }
  }
}

export default ResetPassword;
