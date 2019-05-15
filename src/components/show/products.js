import React, { Component } from "react";
import { FormLabel, FormGroup, FormControl, Container } from "react-bootstrap";
const BASE_URL = "http://192.168.2.112:8000/";

class TableRow3 extends Component {
  render() {
    // console.log("hello");
    return (
      <Container className="animate">
        <FormGroup>
          <FormLabel>Title</FormLabel>
          <FormControl
            readOnly
            value={this.props.obj.productTitle}
            className="c"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Details</FormLabel>
          <FormControl
            readOnly
            value={this.props.obj.productDetail}
            className="c"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Price</FormLabel>
          <FormControl
            readOnly
            value={this.props.obj.productPrice}
            className="c"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Selling Price</FormLabel>
          <FormControl
            readOnly
            value={this.props.obj.productSellingPrice}
            className="c"
          />
        </FormGroup>
        <FormLabel>product Image</FormLabel>
        <FormGroup align="center">
          <br />
          <img
            alt="No Image Found"
            src={BASE_URL + this.props.obj.file}
            width="150px"
            height="150px"
          />
        </FormGroup>
      </Container>
    );
  }
}
export default TableRow3;
