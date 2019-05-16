import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { MDBBtn } from "mdbreact";
import HeaderBar from "./HeaderBar.js";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  FormLabel,
  FormGroup,
  FormControl
} from "react-bootstrap";
const title = {
  pageTitle: "Forgot Password Screen"
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      showError: false,
      messageFromServer: "",
      showNullError: false
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/product-list");
    }
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  sendEmail = e => {
    e.preventDefault();
    const { email } = this.state;
    if (email === "") {
      this.setState({
        showError: false,
        messageFromServer: "",
        showNullError: true
      });
    } else {
      axios
        .post("http://192.168.2.112:8000/forgotPassword", {
          email
        })
        .then(response => {
          console.log(response.data);
          if (response.data === "recovery email sent") {
            this.setState({
              showError: false,
              messageFromServer: "recovery email sent",
              showNullError: false
            });
          }
        })
        .catch(error => {
          console.error(error.response.data);
          if (error.response.data === "email not in db") {
            this.setState({
              showError: true,
              messageFromServer: "",
              showNullError: false
            });
          }
        });
    }
  };

  render() {
    const { email, messageFromServer, showNullError, showError } = this.state;

    return (
      <div>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />
        <form className="animate auth-box1" onSubmit={this.sendEmail}>
          <FormGroup>
            {" "}
            <FormLabel>
              <i class="fa fa-envelope top" />
              Email <span className="required">*</span>
            </FormLabel>
            <FormControl
              type="email"
              name="email"
              placeholder="Enter email"
              value={email}
              onChange={this.handleChange("email")}
            />
          </FormGroup>
          <Button type="submit"> Submit</Button>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp;
          <Link to={"/"}>
            <Button varient="info">Home</Button>
          </Link>
        </form>
        {showNullError && toast("The email address cannot be null.")}
        {showError && toast.error("That email address is not recognized.")}
        {messageFromServer === "recovery email sent" && (
          <div>
            <h3>Password Reset Email Successfully Sent!</h3>
          </div>
        )}
      </div>
    );
  }
}

export default ForgotPassword;
