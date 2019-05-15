import React, { Component } from "react";
import axios from "axios";
import {
  FormGroup,
  FormLabel,
  Button,
  FormControl,
  Container
} from "react-bootstrap";
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from "react-toastify";
import { MDBBtn, MDBIcon } from "mdbreact";
import ToggleDisplay from "react-toggle-display";
import Swal from "sweetalert2";

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetail: "",
      productTitle: "",
      productPrice: "",
      productSellingPrice: "",
      cId: localStorage.getItem("cId"),
      file: "",
      errors: {},
      show: false
    };
  }
  // notify = () =>
  //   (this.toastId = toast("product added successFully !", {
  //     autoClose: 2000,
  //     closeButton: false
  //   }));
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
  }

  onSubmit = async e => {
    e.preventDefault();
    try {
      const {
        productDetail,
        productTitle,
        productPrice,
        productSellingPrice,
        cId,
        file
      } = this.state;

      const obj = {
        productDetail,
        productTitle,
        productPrice,
        productSellingPrice
      };
      const validations = {
        productDetail: {
          [ValidationTypes.REQUIRED]: true
        },
        productTitle: {
          [ValidationTypes.REQUIRED]: true
        },
        productPrice: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.NUMERIC]: true
        },
        productSellingPrice: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.NUMERIC]: true
        },
        file: {
          [ValidationTypes.REQUIRED]: true
        }
      };
      const messages = {
        productDetail: {
          [ValidationTypes.REQUIRED]:
            "Please Give the description of the product."
        },
        productTitle: {
          [ValidationTypes.REQUIRED]: "Please Give the Title of product."
        },
        productPrice: {
          [ValidationTypes.REQUIRED]: "Please Enter the price of product.",
          [ValidationTypes.NUMERIC]: "Must be a number."
        },
        productSellingPrice: {
          [ValidationTypes.REQUIRED]:
            "Please Enter the Selling price of product.",
          [ValidationTypes.NUMERIC]: "Must be a number."
        },
        file: {
          [ValidationTypes.REQUIRED]: "Please insert the image of product."
        }
      };
      const { isValid, errors } = Validator(obj, validations, messages);
      console.log(errors);
      console.log(isValid);
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      const data = {
        productDetail,
        productTitle,
        productPrice,
        productSellingPrice,
        cId,
        file
      };
      const body = new FormData();
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const element = data[i];
          body.append(i, element);
        }
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        " http://192.168.2.112:8000/addProduct",
        body,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      Swal.fire({
        type: "success",
        title: "Success",
        text: "Product added Successfully !"
      });
      toast.info("product added!");
      this.props.history.push("/product-list");
    } catch (error) {
      console.log(error);
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
  onChangefile = e => {
    this.setState({
      file: e.target.files[0] ? e.target.files[0] : null
    });
  };
  handleClick = e => {
    this.setState({
      show: !this.state.show
    });
  };
  render() {
    const { errors } = this.state;
    console.log(errors);
    const {
      productDetail: productDetailError,
      productTitle: productTitleError,
      productPrice: productPriceError,
      productSellingPrice: productSellingPriceError,
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
        <div className="auth-box1">
          <h3 align="center">Add Product</h3>
          <form onSubmit={this.onSubmit} noValidate>
            <FormGroup className="animate">
              <FormLabel>
                Title <span className="required">*</span>
              </FormLabel>
              <FormControl
                type="text"
                placeholder="product Title"
                name="productTitle"
                value={this.state.productTitle}
                onChange={this.onInputChange}
                className="bg auth-box c"
              />
              {productTitleError ? (
                <p className="text-danger">{productTitleError}</p>
              ) : null}
            </FormGroup>
            <FormGroup className="animate">
              <FormLabel>
                Details <span className="required">*</span>
              </FormLabel>
              <FormControl
                type="text"
                placeholder="product Details"
                name="productDetail"
                value={this.state.productDetail}
                onChange={this.onInputChange}
                className="bg auth-box c"
              />
              {productDetailError ? (
                <p className="text-danger">{productDetailError}</p>
              ) : null}
            </FormGroup>
            <FormGroup className="animate">
              <FormLabel><i class="fas fa-dollar-sign top"></i>
                Price <span className="required">*</span>
              </FormLabel>
              <FormControl
                type="number"
                placeholder="product Price"
                name="productPrice"
                value={this.state.productPrice}
                onChange={this.onInputChange}
                className="bg auth-box c"
              />

              {productPriceError ? (
                <p className="text-danger">{productPriceError}</p>
              ) : null}
            </FormGroup>

            <FormGroup className="animate">
              <FormLabel><i class="fas fa-dollar-sign top"></i>
                Selling Price <span className="required">*</span>
              </FormLabel>
              <FormControl
                type="number"
                placeholder=" product Selling Price"
                name="productSellingPrice"
                value={this.state.productSellingPrice}
                onChange={this.onInputChange}
                className="bg auth-box c"
              />
              {productSellingPriceError ? (
                <p className="text-danger">{productSellingPriceError}</p>
              ) : null}
            </FormGroup>

            <FormGroup className="animate">
              <FormLabel>
              <i class="far fa-file-image top" />
                Image <span className="required">*</span>
              </FormLabel>
              <FormControl
                type="file"
                placeholder="product Image"
                name="file"
                onChange={this.onChangefile}
                className="bg auth-box c"
              />
              {fileError ? <p className="text-danger">{fileError}</p> : null}
            </FormGroup>
            <br />
            <div>
              <Button
                variant="outline-success"
                type="submit"
                // onClick={this.notify()}
                className="animate"
              >
                <i class="fas fa-plus top" />
                Add Product
              </Button>
            </div>
            <br />
          </form>

          <MDBBtn
            rounded
            size="lg"
            color="info"
            style={{ float: "right", bottom: "50px" }}
            onClick={this.handleClick}
          >
            <i class="fas fa-info top" />
            Info
          </MDBBtn>
          <ToggleDisplay show={this.state.show} tag="section">
            <Container>
              Your Product Details-
              <br />
              Title:{this.state.productTitle}
              <br />
              Details:{this.state.productDetail}
              <br />
              Price:{this.state.productPrice}
              <br />
              selling Price:{this.state.productSellingPrice}
            </Container>
          </ToggleDisplay>
        </div>
      </>
    );
  }
}
export default AddProduct;
