import React, { Component } from "react";
import axios from "axios";
import {
  FormGroup,
  FormLabel,
  Button,
  FormControl,
  Container,
  Row
} from "react-bootstrap";
import Validator, { ValidationTypes } from "js-object-validation";
import { toast } from "react-toastify";
import { MDBBtn } from "mdbreact";
import ToggleDisplay from "react-toggle-display";
const BASE_URL = "http://192.168.2.112:8000/";

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
      show: false,
      category: "",
      imageUpdated: false,
      imagePreviewUrl: ""
    };
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
    const { cId } = this.state;
    const obj = { cId };
    const response = await axios.post(
      "http://192.168.2.112:8000/profile",
      obj,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    this.setState({ category: response.data.result.category });
    console.log(response);
  };

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
      toast.info("product added successfully!");
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
  handleClick = e => {
    this.setState({
      show: !this.state.show
    });
  };
  render() {
    const { errors, category } = this.state;
    console.log(errors);
    const {
      productDetail: productDetailError,
      productTitle: productTitleError,
      productPrice: productPriceError,
      productSellingPrice: productSellingPriceError,
      file: fileError
    } = errors;
    let { imagePreviewUrl, file } = this.state;
    let $imagePreview = (
      <img
        src={BASE_URL + this.state.file}
        width="150px"
        height="150px"
        alt="no image selected"
      />
    );
    if (imagePreviewUrl) {
      $imagePreview = (
        <img src={imagePreviewUrl} width="150px" height="150px" />
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
        <Row className="animate auth-box1">
          <Container>
            <h3 align="center">Add Product</h3>
            <FormGroup>
              <FormLabel>Category</FormLabel>
              <FormControl
                readOnly
                value={category}
                className="bg auth-box c"
              />
            </FormGroup>
            <form onSubmit={this.onSubmit} noValidate>
              <FormGroup>
                <FormLabel>
                  <i class="fab fa-product-hunt top" />
                  Title <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder="product Title"
                  name="productTitle"
                  value={this.state.productTitle}
                  onChange={this.onInputChange}
                  className=" auth-box c"
                />
                {productTitleError ? (
                  <p className="text-danger">{productTitleError}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-info top" />
                  Details <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder="product Details"
                  name="productDetail"
                  value={this.state.productDetail}
                  onChange={this.onInputChange}
                  className="auth-box c"
                />
                {productDetailError ? (
                  <p className="text-danger">{productDetailError}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  <i class="fas fa-tag top" />
                  Price <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="number"
                  placeholder="product Price"
                  name="productPrice"
                  value={this.state.productPrice}
                  onChange={this.onInputChange}
                  className=" auth-box c"
                />

                {productPriceError ? (
                  <p className="text-danger">{productPriceError}</p>
                ) : null}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <i class="fas fa-tag top" />
                  Selling Price <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="number"
                  placeholder=" product Selling Price"
                  name="productSellingPrice"
                  value={this.state.productSellingPrice}
                  onChange={this.onInputChange}
                  className="auth-box c"
                />
                {productSellingPriceError ? (
                  <p className="text-danger">{productSellingPriceError}</p>
                ) : null}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <i class="far fa-file-image top" />
                  Image <span className="required">*</span>
                </FormLabel>
                <FormControl
                  type="file"
                  placeholder="product Image"
                  name="file"
                  onChange={this.onChangefile}
                  className="auth-box c"
                />
                {fileError ? <p className="text-danger">{fileError}</p> : null}
              </FormGroup>
              <FormGroup align="center">
                <div className="imgPreview">{$imagePreview}</div>
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
          </Container>
        </Row>
      </>
    );
  }
}
export default AddProduct;
