import React, { Component } from "react";
import {
  FormLabel,
  FormGroup,
  FormControl,
  Container,
  Row,
  Button,
  Form
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const BASE_URL = "http://192.168.2.112:8000/";

class TableRow1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      mobile_no: "",
      category: "",
      idProof: "",
      file: "",
      isOpen: false,
      categoryValue: [],
      disabled: true,
      enable: false,
      cId: localStorage.getItem("cId"),
      imageUpdated: false
    };
  }
  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
    try {
      const { cId } = this.state;
      const obj = { cId };
      const response = await axios.post(
        "http://192.168.2.112:8000/profile",
        obj,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(response);

      this.setState({
        name: response.data.result.name,
        email: response.data.result.email,
        mobile_no: response.data.result.mobile_no,
        category: response.data.result.category,
        idProof: response.data.result.idProof,
        file: response.data.result.file
      });
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

    const {
      name,
      email,
      mobile_no,
      category,
      idProof,
      file,
      cId,
      imageUpdated
    } = this.state;

    const data = {
      name,
      email,
      mobile_no,
      category,
      idProof,
      file,
      cId,
      imageUpdated
    };
    const body = new FormData();
    for (const i in data) {
      if (data.hasOwnProperty(i)) {
        const element = data[i];
        body.append(i, element);
      }
    }
    const token = localStorage.getItem("token");

    const result = await axios.put(
      "http://192.168.2.112:8000/editProfile",

      body,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // if (result) {
    //   this.setState({
    //     file: result.data.files.path
    //   });
    // }
    Swal.fire({
      type: "success",
      title: "Success",
      text: "Changes save!"
    });
    // this.props.history.push("/product-list");
    console.log(result);
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
  handleClose = e => {
    this.setState({ show: false });
  };
  handleOpen = e => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleShow = e => {
    this.setState({ show: true });
  };
  isEnable = e => {
    this.setState({ disabled: !this.state.disabled, enable: true });
  };
  render() {
    const { categoryValue } = this.state;
    return (
      <Row>
        <Container className="animate ">
          <Form onSubmit={this.onSubmit}>
            <Link onClick={this.isEnable} align="right">
              <i class="fas fa-user-edit top" />
              Edit
            </Link>
            <FormGroup align="center">
              <img
                src={BASE_URL + this.state.file}
                width="150px"
                height="150px"
                alt={"Hello " + this.state.name}
                onChange={this.onChangefile}
                onClick={this.handleOpen}
                roundedCircle
              />{" "}
              {this.state.isOpen && (
                <dialog
                  className="dialog animate"
                  style={{ position: "absolute" }}
                  open
                  onClick={this.handleOpen}
                >
                  <img
                    className="image1"
                    src={BASE_URL + this.state.file}
                    onClick={this.handleOpen}
                    alt="no image"
                  />
                </dialog>
              )}
            </FormGroup>
            <dialog />
            <FormGroup>
              <FormLabel>Name</FormLabel>
              <FormControl
                className="c"
                disabled={this.state.disabled}
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.onInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormControl
                disabled={this.state.disabled}
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.onInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Category</FormLabel>
              <FormControl
                className="c"
                disabled={this.state.disabled}
                as="select"
                name="category"
                value={this.state.category}
                onChange={this.onInputChange}
              >
                {categoryValue && categoryValue.length
                  ? categoryValue.map(Category => {
                      return (
                        <option key={Category.cid}>{Category.category}</option>
                      );
                    })
                  : null}
                )
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Id Proof</FormLabel>
              <FormControl
                className="c"
                as="select"
                name="idProof"
                disabled={this.state.disabled}
                value={this.state.idProof}
                onChange={this.onInputChange}
              >
                {" "}
                <option value="Adhaar Card">Adhaar card</option>
                <option value="Pan Card">Pan Card</option>
                <option value="votar Id">Votar Id</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Mobile No</FormLabel>
              <FormControl
                type="text"
                name="mobile_no"
                disabled={this.state.disabled}
                value={this.state.mobile_no}
                onChange={this.onInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>{`${this.state.idProof}`} Image</FormLabel>
              <FormControl
                //value={BASE_URL + this.props.obj.file}
                type="file"
                name="file"
                disabled={this.state.disabled}
                onChange={this.onChangefile}
              />
            </FormGroup>
            {/* <img
              src={BASE_URL + this.state.file}
              width="150px"
              height="150px"
            /> */}

            <Button
              variant="primary"
              type="submit"
              align="center"
              style={{ width: "100px", padding: "5px" }}
            >
              <i class="fas fa-save top" />
              Save
            </Button>
          </Form>
        </Container>
      </Row>
    );
  }
}
export default TableRow1;
