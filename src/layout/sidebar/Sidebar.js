import React from "react";
import "./sidebar.scss";

import { Icon } from "office-ui-fabric-react/lib/Icon";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import { Text } from "office-ui-fabric-react/lib/Text";

import { Link } from "react-router-dom";

initializeIcons();

export default ({ routes }) => {
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
        </li>
      </Link>
    ));

  return (
    <div className="sidebar">
      <ul className="sidebar__list">{renderLists()}</ul>
    </div>
  );
};
