import React, { Component } from "react";
import "./home.scss";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";

export default class Home extends Component {
  state = {
    email: "",
    password: ""
  };

  updateField = (field, value) => this.setState({ [field]: value });

  onSubmit = () => {
    const { login } = this.props;
    const { email, password } = this.state;

    if (email && password === "admin") {
      login();
    }
  };

  render() {
    return (
      <div className="home">
        <div className="home__image" />
        <div className="home__form">
          <p className="title">
            Pot<span className="emphasize">luck</span> Enterprise
          </p>
          <p className="subtitle">Reach your customers with ease.</p>

          <div className="fields">
            <TextField
              className="fields__field"
              label="email"
              placeholder="email"
              onChange={e => this.updateField("email", e.target.value)}
            />
            <TextField
              className="fields__field"
              label="password"
              placeholder="password"
              type="password"
              onChange={e => this.updateField("password", e.target.value)}
            />
            <DefaultButton className="fields__btn" onClick={this.onSubmit}>
              LOG IN
            </DefaultButton>
          </div>

          <p className="subtitle">
            Want to join Potluck?{" "}
            <a href="#" className="link">
              Contact us.
            </a>
          </p>
        </div>
      </div>
    );
  }
}
