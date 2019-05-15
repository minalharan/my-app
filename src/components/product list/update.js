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
      imageUpdated: false
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
    console.log(e.target.files[0]);
    console.log("e.target.files[0]");
    this.setState({
      file: e.target.files[0] ? e.target.files[0] : null,
      imageUpdated: true
    });
  };
  render() {
    return (
      <div style={{ marginTop: 10 }} align="center" className="animate">
        <h3 align="center">Update Product</h3>
        <form onSubmit={this.onSubmit} noValidate className="auth-box1">
          <FormGroup align="center">
            <br />
            <img
              src={BASE_URL + this.state.file}
              width="150px"
              height="150px"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Product Title</FormLabel>
            <FormControl
              type="text"
              placeholder="product Title"
              name="productTitle"
              value={this.state.productTitle}
              onChange={this.onInputChange}
              className="c"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel> Product Details</FormLabel>
            <FormControl
              type="text"
              placeholder="product Details"
              name="productDetail"
              value={this.state.productDetail}
              onChange={this.onInputChange}
              className="c"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Product Price</FormLabel>
            <FormControl
              type="text"
              placeholder="product Price"
              name="productPrice"
              value={this.state.productPrice}
              onChange={this.onInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel> Product Selling Price</FormLabel>
            <FormControl
              type="text"
              placeholder=" product Selling Price"
              name="productSellingPrice"
              value={this.state.productSellingPrice}
              onChange={this.onInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel> product Image</FormLabel>
            <FormControl
              type="file"
              placeholder="product Image"
              name="file"
              onChange={this.onChangefile}
            />
          </FormGroup>
          <br />
          <Button variant="dark" type="submit">
            Update Product
          </Button>
          <br />
        </form>
      </div>
    );
  }
}
export default Update;
