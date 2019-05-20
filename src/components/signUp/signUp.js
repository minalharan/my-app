import React, { Component } from "react";
import axios from "axios";
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from "react-toastify";
import {
  FormGroup,
  FormLabel,
  Button,
  Row,
  FormControl,
  Container
} from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
const BASE_URL = "http://192.168.2.112:8000/";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      mobile_no: "",
      password: "",
      confirmPassword: "",
      category: "",
      option: [],
      idProof: "",
      file: "",
      errors: {},
      categoryValue: [],
      imageUpdated: false,
      imagePreviewUrl: ""
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/product-list");
    }
    axios.get("http://192.168.2.112:8000/users").then(res => {
      const result = res.data;
      console.log(result);
      const option = [];
      if (result.result1 && result.result1.length) {
        console.log("in if");
      }
      console.log(option);
      this.setState({
        option,
        categoryValue: result.result1
      });
    });
  }

  onChangeCategory = e => {
    this.setState({
      category: e.target.value
    });
  };
  onChangeIdProof = e => {
    this.setState({
      IdProof: e.value
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    try {
      const {
        name,
        email,
        password,
        confirmPassword,
        mobile_no,
        category,
        idProof,
        file
      } = this.state;

      const obj = {
        name,
        email,
        password,
        mobile_no,
        confirmPassword,
        category,
        idProof
      };
      console.log(file);
      const validations = {
        name: {
          [ValidationTypes.REQUIRED]: true
        },
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
          [ValidationTypes.MINLENGTH]: 4,
          [ValidationTypes.EQUAL]: "password"
        },
        mobile_no: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.NUMERIC]: true,
          [ValidationTypes.MINLENGTH]: 7,
          [ValidationTypes.MAXLENGTH]: 14
        },
        category: {
          [ValidationTypes.REQUIRED]: true
        },
        idProof: {
          [ValidationTypes.REQUIRED]: true
        },
        file: {
          [ValidationTypes.REQUIRED]: true
        }
      };
      const messages = {
        name: {
          [ValidationTypes.REQUIRED]: "Please enter name."
        },
        email: {
          [ValidationTypes.REQUIRED]: "Please enter email.",
          [ValidationTypes.EMAIL]: "Please enter valid email."
        },
        password: {
          [ValidationTypes.REQUIRED]: "Please enter password.",
          [ValidationTypes.MINLENGTH]: "Minimum Length of password should be 4."
        },
        confirmPassword: {
          [ValidationTypes.REQUIRED]: "please re-enter the same password.",
          [ValidationTypes.EQUAL]: "password and confirm password does't match."
        },
        mobile_no: {
          [ValidationTypes.REQUIRED]: "Please Enter mobile no.",
          [ValidationTypes.NUMERIC]: "please Enter digits Only.",
          [ValidationTypes.MINLENGTH]: "Minimum length should be 7 atleast.",
          [ValidationTypes.MAXLENGTH]: "Maximum length should be 14."
        },
        category: {
          [ValidationTypes.REQUIRED]: "please select Category."
        },
        idProof: {
          [ValidationTypes.REQUIRED]: "please select Id proof."
        },
        file: {
          [ValidationTypes.REQUIRED]: "please Select a file."
        }
      };
      const { isValid, errors } = Validator(obj, validations, messages);
      console.log(errors);
      console.log(isValid);
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
      const data = {
        name,
        email,
        password,
        confirmPassword,
        mobile_no,
        category,
        idProof,
        file
      };
      const body = new FormData();
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const element = data[i];
          body.append(i, element);
        }
      }
      console.log(body);
      console.log("body");
      const response = await axios.post(
        "http://192.168.2.112:8000/addUser",
        body
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("cId", response.data.result._id);

      this.props.history.push("/product-list");
      Swal.fire({
        type: "success",
        title: "Success",
        text: "you are Successfully registered !"
      });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
      toast.error(
        `${(error.response &&
          error.response.data &&
          error.response.data.message[0].msg) ||
          "Unknown error"}`
      );
      this.props.history.push("/signup");
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
  onChangefile = e => {
    let reader = new FileReader();
    let file = e.target.files[0];
    this.setState({
      file: e.target.files[0] ? e.target.files[0] : null,
      imageUpdated: true
    });
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
  };
  render() {
    let { imagePreviewUrl, file } = this.state;
    let $imagePreview = (
      <img src={BASE_URL + this.state.file} width="150px" height="150px" />
    );
    if (imagePreviewUrl) {
      $imagePreview = (
        <img src={imagePreviewUrl} width="150px" height="150px" />
      );
    }
    const { categoryValue, errors } = this.state;
    console.log(errors);
    const {
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmpasswordError,
      mobile_no: mobile_noError,
      category: categoryError,
      idProof: idproofError,
      file: fileError
    } = errors;
    return (
      <>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />

        <h2 align="center">Sign Up </h2>
        <Row className="auth-box1 animate">
          <Container>
            <form onSubmit={this.onSubmit} noValidate>
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-user top" />
                  Name<span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder="Username"
                  name="name"
                  value={this.state.name}
                  onChange={this.onInputChange}
                  className="c"
                />
                {nameError ? <p className="text-danger">{nameError}</p> : null}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  <i class="fa fa-envelope top" />
                  Email
                  <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                {emailError ? (
                  <p className="text-danger">{emailError}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-mobile-alt top" />
                  Mobile_no
                  <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="number"
                  placeholder="+91 00000-00000"
                  name="mobile_no"
                  value={this.state.mobile_no}
                  onChange={this.onInputChange}
                />
                {mobile_noError ? (
                  <p className="text-danger">{mobile_noError}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-key top" />
                  Password
                  <span className="required">*</span>
                </FormLabel>
                <FormControl
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
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-lock top" />
                  Confirm Password<span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="password"
                  placeholder="Re-type Password"
                  name="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.onInputChange}
                />
                {confirmpasswordError ? (
                  <p className="text-danger">{confirmpasswordError}</p>
                ) : null}
              </FormGroup>
              <FormLabel>
                <i class="fas fa-list-alt top" />
                Category
                <span className="required">*</span>
              </FormLabel>
              <FormGroup margin="normal">
                <FormControl
                  as="select"
                  name="category"
                  value={this.state.category}
                  onChange={this.onChangeCategory}
                >
                  <option value="">Select Category</option>
                  {categoryValue && categoryValue.length
                    ? categoryValue.map(Category => {
                        return (
                          <option key={Category.cid}>
                            {Category.category}
                          </option>
                        );
                      })
                    : null}
                  )
                </FormControl>
                {categoryError ? (
                  <p className="text-danger">{categoryError}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-address-card top" />
                  Id Proof
                  <span className="required">*</span>
                </FormLabel>
                <FormControl
                  as="select"
                  value={this.state.idProof}
                  onChange={this.onInputChange}
                  name="idProof"
                >
                  <option value="null">-Select id proof-</option>
                  <option value="Adhaar Card">Adhaar card</option>
                  <option value="Pan Card">Pan Card</option>
                  <option value="votar Id">Votar Id</option>
                  <option value="Passport">Passport</option>
                </FormControl>
                {idproofError ? (
                  <p className="text-danger">{idproofError}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  <i class="far fa-file-image top" />
                  {`${this.state.idProof}`} image
                  <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="file"
                  placeholder="Attach file of Id Proof"
                  name="file"
                  onChange={this.onChangefile}
                />
                {fileError ? <p className="text-danger">{fileError}</p> : null}
              </FormGroup>
              <FormGroup align="center">
                <div className="imgPreview">{$imagePreview}</div>
              </FormGroup>

              <Button
                variant="primary"
                type="submit"
                style={{ width: "150px", padding: "5px" }}
              >
                {" "}
                <i class="fas fa-user-plus top" />
                Sign Up
              </Button>
              <br />
              <br />
              <Link
                variant="primary"
                onClick={() => {
                  this.props.history.push("/login");
                }}
                style={{ width: "150px", padding: "5px" }}
              >
                Already have an account ?
              </Link>
            </form>
          </Container>
        </Row>
      </>
    );
  }
}

export default SignUp;
