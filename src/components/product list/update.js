import React, { Component } from "react";
import axios from "axios";
import { FormGroup, FormLabel, Button, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const BASE_URL = "http://192.168.2.112:8000/";

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetail: "",
      productTitle: "",
      productPrice: "",
      productSellingPrice: "",
      file: "",
      imageUpdated: false,
      imagePreviewUrl: ""
    };
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
    try {
      const response = await axios.get(
        "http://192.168.2.112:8000/getitem/" + this.props.match.params._id
      );
      console.log(response);

      this.setState({
        productDetail: response.data.result.productDetail,
        productTitle: response.data.result.productTitle,
        productPrice: response.data.result.productPrice,
        productSellingPrice: response.data.result.productSellingPrice,
        file: response.data.result.file
      });
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

  onSubmit = async e => {
    e.preventDefault();

    try {
      const {
        productDetail,
        productTitle,
        productPrice,
        productSellingPrice,
        file,
        imageUpdated
      } = this.state;

      const data = {
        productDetail,
        productTitle,
        productPrice,
        productSellingPrice,
        file,
        imageUpdated
      };
      console.log(file);
      console.log("file***********");
      console.log(data);
      const body = new FormData();
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const element = data[i];
          body.append(i, element);
        }
      }
      console.log(this.props.match.params._id);
      const result = await axios.put(
        "http://192.168.2.112:8000/edititem/" + this.props.match.params._id,
        body
      );
      console.log(result.obj);
      Swal.fire({
        type: "success",
        title: "Success",
        text: "Product updated Successfully !"
      });
      // toast.success("product updated !");
      this.props.history.push("/product-list");
    } catch (error) {
      console.log(error);
      console.log(error.result.data.message);
      toast.error(
        `${(error.result && error.result.data && error.result.data.message) ||
          "Unknown error"}`
      );
    }
  };

  onInputChange = e => {
    const { target } = e;
    const { value, name } = target;
    this.setState({
      [name]: value
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
    return (
      <div style={{ marginTop: 10 }} align="left" className="animate">
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />
        <h3 align="center">Update Product</h3>
        <form onSubmit={this.onSubmit} noValidate className="auth-box1">
          <FormGroup align="center">
            <div className="imgPreview">{$imagePreview}</div>
          </FormGroup>
          <FormGroup>
            <FormLabel>
              <i class="fab fa-product-hunt top" />
              Title
            </FormLabel>
            <FormControl
              type="text"
              placeholder="product Title"
              name="productTitle"
              value={this.state.productTitle}
              onChange={this.onInputChange}
              className="bg auth-box c"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>
              <i class="fas fa-info top" />
              Details
            </FormLabel>
            <FormControl
              type="text"
              placeholder="product Details"
              name="productDetail"
              value={this.state.productDetail}
              onChange={this.onInputChange}
              className="bg auth-box c"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>
              <i class="fas fa-tag top" />
              Price
            </FormLabel>
            <FormControl
              type="text"
              placeholder="product Price"
              name="productPrice"
              value={this.state.productPrice}
              onChange={this.onInputChange}
              className="bg auth-box c"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>
              <i class="fas fa-tag top" />
              Selling Price
            </FormLabel>
            <FormControl
              type="text"
              placeholder=" product Selling Price"
              name="productSellingPrice"
              value={this.state.productSellingPrice}
              onChange={this.onInputChange}
              className="bg auth-box c"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>
              <i class="far fa-file-image top" />
              Image
            </FormLabel>
            <FormControl
              type="file"
              placeholder="product Image"
              name="file"
              onChange={this.onChangefile}
              className="bg auth-box c"
            />
          </FormGroup>
          <br />
          <Button variant="dark" type="submit">
            Update Product
          </Button>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <Button
            variant="dark"
            onClick={() => {
              this.props.history.push("/product-list");
            }}
          >
            Cancel
          </Button>
          <br />
        </form>
      </div>
    );
  }
}
export default Update;
