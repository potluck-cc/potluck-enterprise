import React from "react";
import "./home.scss";

import { Text } from "office-ui-fabric-react/lib/Text";
import { Icon } from "office-ui-fabric-react/lib/Icon";

import BusinessImage from "../assets/images/business.jpg";

export default () => (
  <div className="home">
    <Text variant="mega">Welcome to Potluck.Dispensary</Text>
    <img src={BusinessImage} className="home__image" alt="bussiness" />
    <ul className="home__cards">
      <li className="home__card">
        <Icon iconName="Mail" className="home__icon" />
        <Text className="home__title" variant="large">
          Contact Us
        </Text>
      </li>
    </ul>
  </div>
);
