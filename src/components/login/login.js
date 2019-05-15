import React, { Component } from "react";
import Axios from "axios";
import { withRouter , Link } from "react-router-dom";
import { toast } from "react-toastify";
import Validator, { ValidationTypes } from "js-object-validation";
import {
  FormGroup,
  FormLabel,
  Button,
  Row,
  FormControl,
  Container
} from "react-bootstrap";
import Swal from "sweetalert2";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
      errors: {}
    };
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/add-product");
    }
  };
  onLogin = async e => {
    e.preventDefault();
    this.setState({
      isLoading: true,
      errors: {}
    });

    try {
      const { email, password } = this.state;
      const obj = { email, password };
      const validations = {
        email: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EMAIL]: true
        },
        password: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.MINLENGTH]: 4
        }
      };
      const messages = {
        email: {
          [ValidationTypes.REQUIRED]: "Please enter Email.",
          [ValidationTypes.EMAIL]: "Please enter valid Email address."
        },
        password: {
          [ValidationTypes.REQUIRED]: "Please Enter password.",
          [ValidationTypes.MINLENGTH]: "Minimum length of password should be 4."
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
      console.log("api calling");
      const response = await Axios.post("http://192.168.2.112:8000/login", obj);
      console.log(response);
      console.log("response.data");
      Swal.fire({
        type: "success",
        title: "Success",
        text: "Login Successfully !"
      });
      this.setState({ email: "", password: "", isLoading: false });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("cId", response.data.result._id);

      this.props.history.push("/product-list");
    } catch (error) {
      console.log(error.response.data);
      this.setState({ isLoading: false });
      toast.error(
        `${(error.response &&
          error.response.data &&
          error.response.data.message) ||
          "Unknown error"}`
      );
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
    const { isLoading, errors } = this.state;
    const { email: emailError, password: passwordError } = errors;
    return (
      <>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />

        <Row className="animate auth-box1">
          <Container>
            <h2 align="center">Log In </h2>
            <form onSubmit={this.onLogin} noValidate>
              <FormGroup>
                <FormLabel>
                  <i class="fa fa-envelope top" />
                  Email <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                {emailError ? (
                  <p className="text-danger">{emailError}</p>
                ) : null}
              </FormGroup>
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
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                {passwordError ? (
                  <p className="text-danger">{passwordError}</p>
                ) : null}
              </FormGroup>
              <Link to ="/forgot-password"><p>Forgot password ?</p></Link>
              <Button variant="primary" type="submit">
                <i class="fas fa-sign-in-alt top" />
                {isLoading ? "Please wait..." : "Sign In"}
              </Button>
              &nbsp; &nbsp;
              <Button
                variant="info"
                onClick={() => {
                  this.props.history.push("/signup");
                }}
              >
                <i class="fas fa-user-plus top" />
                Sign Up
              </Button>
            </form>
          </Container>
        </Row>
      </>
    );
  }
}

export default withRouter(Login);
