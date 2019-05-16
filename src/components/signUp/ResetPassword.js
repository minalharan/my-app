import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  FormLabel,
  FormGroup,
  FormControl
} from "react-bootstrap";
const loading = {
  margin: "1em",
  fontSize: "24px"
};

const title = {
  pageTitle: "Password Reset Screen"
};

export default class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      password: "",
      updated: false,
      isLoading: true,
      error: false
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/product-list");
    }
    const response = await axios
      .get("http://192.168.2.112:8000/reset", {
        params: {
          resetPasswordToken: this.props.match.params.token
        }
      })
      .then(response => {
        console.log(response);
        if (response.data.message === "password reset link a-ok") {
          this.setState({
            name: response.data.name,
            updated: false,
            isLoading: false,
            error: false
          });
        }
      })
      .catch(error => {
        console.log(error.response.data);
        this.setState({
          updated: false,
          isLoading: false,
          error: true
        });
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  updatePassword = e => {
    e.preventDefault();
    const response = axios
      .put("http://192.168.2.112:8000/updatePasswordViaEmail", {
        name: this.state.name,
        password: this.state.password,
        resetPasswordToken: this.props.match.params.token
      })
      .then(response => {
        console.log(response.data);
        if (response.data.message === "password updated") {
          this.setState({
            updated: true,
            error: false
          });
        } else {
          this.setState({
            updated: false,
            error: true
          });
        }
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  render() {
    const { password, error, isLoading, updated } = this.state;

    if (error) {
      return (
        <>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
            integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
            crossorigin="anonymous"
          />
          <div className="auth-box1">
            <div style={loading}>
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
    }
    if (isLoading) {
      return (
        <>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
            integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
            crossorigin="anonymous"
          />
          <div>
            <div style={loading}>Loading User Data...</div>
          </div>
        </>
      );
    }
    return (
      <>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />
        <div>
          <form className="password-form" onSubmit={this.updatePassword}>
            <FormGroup>
              <FormLabel>
                <i class="fas fa-key top" />
                Password <span className="required">*</span>
              </FormLabel>
              <FormControl
                required="true"
                type="password"
                placeholder="Enter Password"
                name="password"
                value={password}
                onChange={this.handleChange("password")}
              />
            </FormGroup>
            <Button>Update Password</Button>
          </form>

          {updated && (
            <div>
              <p>
                Your password has been successfully reset, please try logging in
                again.
              </p>
              <Link to={"/login"}>
                <Button>Login</Button>
              </Link>
            </div>
          )}
          <Link to={"/"}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </>
    );
  }
}

ResetPassword.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired
    })
  })
};
