import React, { Component } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import TableRow from "./TableRow";
import { Link } from "react-router-dom";
import { MDBBtn, MDBIcon } from "mdbreact";
import "./productlist.css";
import Favicon from "react-favicon";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      cId: localStorage.getItem("cId"),
      productTitle: "",
      productPrice: "",
      productSellingPrice: "",
      productDetail: "",
      file: ""
    };
  }
  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
    this.getData();
  };
  getData = async () => {
    try {
      const { cId } = this.state;
      const data = { cId };
      const res = await axios.post(
        "http://192.168.2.112:8000/showproduct",
        data
      );
      console.log(res.data.result);
      console.log("result");
      const result = res.data.result;
      this.setState({ product: result });
      console.log(result);
      if (!result) {
        console.log("error");
      }
    } catch (error) {
      toast.error(
        `${(error.res && error.res.data && error.res.data.message[0].msg) ||
          "Unknown error"}`
      );
    }
  };
  onDelete = async productId => {
    const result = await axios.delete(
      "http://192.168.2.112:8000/deleteitem/" + productId
    );
    if (result) {
      toast("product Deleted");
    }
    this.getData();
  };
  render() {
    const { product } = this.state;
    return (
      <>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />
        {product.length ? (
          <>
            <h2 align="center" className="M">
              {" "}
              Product List
            </h2>

            <div>
              {" "}
              <Link to={"/add-product"}>
                <MDBBtn
                  rounded
                  size="lg"
                  color="info"
                  style={{ float: "right", bottom: "30px" }}
                >
                  <i class="fas fa-plus top" />
                  Add Product
                </MDBBtn>
              </Link>
            </div>
            <Table
              striped
              bordered
              hover
              variant="dark"
              className="table animate css-serial"
            >
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th className="mg">Title</th>
                  <th className="mg1">Details</th>
                  <th className="mg1">Price</th>
                  <th className="mg1">Product Selling Price</th>
                  <th className="mg1">Product Image</th>
                  <th className="mg2" text-align="center" colSpan="3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {product && product.length
                  ? product.map(product => {
                      return (
                        <TableRow
                          obj={product}
                          key={product._id}
                          onDelete={this.onDelete}
                        />
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </>
        ) : (
          <>
            <h2 align="center" className="M">
              {" "}
              Product List
            </h2>

            {/* <Link to={"/add-product"}>
              <MDBBtn
                // rounded
                // size="lg"
                color="info"
                // style={{ float: "right", bottom: "30px" }}
              >
                <i class="far fa-plus-square top" />
                Add Product
              </MDBBtn>
            </Link> */}

            <Table
              striped
              bordered
              hover
              variant="dark"
              className="animate css-serial"
            >
              <thead>
                <tr>
                  <th width="30px" text-align="center">
                    S.No.
                  </th>
                  <th width="130px" text-align="center">
                    Title
                  </th>
                  <th width="130px" text-align="center">
                    Details
                  </th>
                  <th width="130px" text-align="center">
                    Price
                  </th>
                  <th width="130px" text-align="center">
                    Product Selling Price
                  </th>
                  <th width="130px" text-align="center">
                    Product Image
                  </th>
                  <th width="230px" text-align="center" colSpan="3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {product && product.length
                  ? product.map(product => {
                      return (
                        <TableRow
                          obj={product}
                          key={product._id}
                          onDelete={this.onDelete}
                        />
                      );
                    })
                  : null}
              </tbody>
            </Table>
            {/* <Favicon url="http://oflisback.github.io/react-favicon/public/img/github.ico" /> */}
            <MDBIcon icon="ban" className="icons bans" />
            <div>{/* <i class="fas fa-ban"></i> */}</div>
            <h5 text align="center" padding-left="40px">
              Currently there are no Product details added.
            </h5>
            <p text align="center" padding-left="40px">
              {" "}
              Please click below button to add new.!
            </p>
            <Link to={"/add-product"}>
              {" "}
              <div>
                <Button className="flax-center">
                  {" "}
                  <i class="fas fa-plus top" />
                  Add New
                </Button>
              </div>
            </Link>
          </>
        )}
      </>
    );
  }
}
export default ProductList;
