import React, { Component } from "react";
import { Link } from "react-router-dom";
class Logout extends Component {
  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    }
  };
  render() {
    return (
      <Link to={"/"} onClick={localStorage.clear()}>
        LOGOUT
      </Link>
    );
  }
}
export default Logout;
