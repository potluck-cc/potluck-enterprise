import React, { Component } from "react";

import { GroupedList } from "office-ui-fabric-react/lib/GroupedList";
import { createListItems } from "office-ui-fabric-react/lib/utilities/exampleData";

import OrderHeader from "./OrderHeader";
import OrderCell from "./OrderCell";
import OrderModule from "./OrderModule";
import OrderDetails from "./OrderDetails";

import "./orders.scss";

export default class Orders extends Component {
  _items = createListItems(20);

  _groups = [
    { count: 5, name: "New", startIndex: 0, key: "New" },
    { count: 5, name: "Accepted", startIndex: 1, key: "Accepted" },
    { count: 5, name: "Upcoming", startIndex: 2, key: "Upcoming" }
  ];

  _onRenderCell = (nestingDepth, item, itemIndex) => (
    <OrderCell
      itemIndex={itemIndex}
      orderNumber={50}
      itemCount={5}
      orderTotal={800}
      orderTime={"10:00 AM"}
    />
  );

  _onRenderHeader = props => (
    <OrderHeader
      _onClick={() => props.onToggleCollapse(props.group)}
      groupName={props.group.name}
      groupCount={5}
    />
  );

  render() {
    console.log(this._items);
    return (
      <div className="orders">
        <div className="orders__list">
          <GroupedList
            className="list"
            items={this._items}
            onRenderCell={this._onRenderCell}
            groupProps={{
              onRenderHeader: this._onRenderHeader
            }}
            groups={this._groups}
          />
        </div>
        <div className="orders__data">
          <OrderModule
            orderNumber={50}
            customerName={"Ashton Morris"}
            customerPhone={"(973) 220 - 1995"}
            total={800}
            itemCount={7}
            time={"10:00 AM"}
          />

          <OrderDetails
            productName={"Lemon G"}
            productType={"Flower"}
            productWeight={"Eighth"}
            total={200}
            quantity={2}
          />
        </div>
      </div>
    );
  }
}
