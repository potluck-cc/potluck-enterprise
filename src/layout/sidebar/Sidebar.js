import React, { Component } from "react";
import "./sidebar.scss";

import { Icon } from "office-ui-fabric-react/lib/Icon";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import { Text } from "office-ui-fabric-react/lib/Text";

import { Link } from "react-router-dom";

initializeIcons();

class Sidebar extends Component {
  state = {
    activeLinkIndex: 0
  };

  setSidebarItemToActive = index => this.setState({ activeLinkIndex: index });

  renderLists = () =>
    this.props.routes.map((route, index) => (
      <Link
        to={route.path}
        key={index}
        className="sidebar__link"
        onClick={() => this.setSidebarItemToActive(index)}
      >
        <li
          className={
            this.state.activeLinkIndex === index
              ? "sidebar__item sidebar__item--active"
              : "sidebar__item"
          }
        >
          <Icon iconName={route.icon} className="sidebar__icon" />
          <Text className="sidebar__title" variant="medium">
            {route.title}
          </Text>
        </li>
      </Link>
    ));

  render() {
    return (
      <div className="sidebar">
        <ul className="sidebar__list">{this.renderLists()}</ul>
      </div>
    );
  }
}

export default Sidebar;
