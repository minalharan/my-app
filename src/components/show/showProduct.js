import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TableRow3 from "./products";

class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("token");
      if (!token) {
        this.props.history.push("/login");
      }
    try {
      
      const response = await axios.get(
        "http://192.168.2.112:8000/getItem/" + this.props.match.params._id
      );
      console.log(response);
      console.log("response");
      console.log(response.data.result);
      const result1 = response.data.result;
      console.log(this.props.obj.file)

      this.setState({
        value: result1
      });
    } catch (error) {
      console.log(error);
      toast.error(`${error.message || "Unknown error"}`);
    }
  };

  render() {
    console.log("helllo");
    const { value } = this.state;
    console.log({ value });
    return (
      <>
        <div>
          <h2 align="center" className="M">
            View
          </h2>
          {<TableRow3 obj={value} key={value._id} />}
        </div>
      </>
    );
  }
}
export default Show;
