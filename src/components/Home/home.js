import React, { Component } from "react";
// import image from "./image.jpg";
class Home extends Component {
  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
          integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
          crossorigin="anonymous"
        />
        <div>
          <h1>Welcome</h1>
          {/* <img src={image} width="100" height="50" /> */}
        </div>
      </>
    );
  }
}
export default Home;
