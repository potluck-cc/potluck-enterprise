import React from "react";
import "./sidebar.scss";

import { Icon } from "office-ui-fabric-react/lib/Icon";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import { Text } from "office-ui-fabric-react/lib/Text";

import { Link } from "react-router-dom";

import Badge from "./Badge";

initializeIcons();

export default ({ routes, orderCount }) => {
  const renderLists = () =>
    routes.map((route, index) => (
      <Link to={route.path} key={index} className="sidebar__link">
        <li
          className={
            route.path === window.location.pathname
              ? "sidebar__item sidebar__item--active"
              : "sidebar__item"
          }
        >
          <Icon iconName={route.icon} className="sidebar__icon" />
          <Text className="sidebar__title" variant="medium">
            {route.title}
          </Text>
          {route.badge && <Badge orderCount={orderCount} />}
        </li>
      </Link>
    ));

  return (
    <div className="sidebar">
      <ul className="sidebar__list">
        {renderLists()}
        <Link to={"/"} className="sidebar__link">
          <li
            className={ "sidebar__item"
            }
          >
            <Icon iconName={'Home'} className="sidebar__icon" />
            <Text className="sidebar__title" variant="medium">
              Home
            </Text>
          </li>
        </Link>
      </ul>
    </div>
  );
};
