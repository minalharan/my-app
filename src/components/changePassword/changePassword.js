import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Validator, { ValidationTypes } from "js-object-validation";
import { toast, ToastContainer } from "react-toastify";
import {
  Table,
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
      oldPassword: "",
      password: "",
      confirmPassword: "",
      updated: false,
      isLoading: true,
      error: false,
      errors: {}
    };
  }
}
