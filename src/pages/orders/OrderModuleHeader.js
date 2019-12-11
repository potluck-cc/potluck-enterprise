import React from "react";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";

export default function({ close = () => {} }) {
  return (
    <div className="order-module-header">
      <div className="actions-container">
        <ul className="actions">
          {/* <li className="action">
            <FontIcon iconName="Edit" />
          </li>
          <li className="action">
            <FontIcon iconName="Print" />
          </li>
          <li className="action">
            <FontIcon iconName="MailAttached" />
          </li> */}
          <li className="action" onClick={close}>
            <FontIcon iconName="ChromeClose" />
          </li>
        </ul>
      </div>
    </div>
  );
}
