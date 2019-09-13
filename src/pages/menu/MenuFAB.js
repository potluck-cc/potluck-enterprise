import React from "react";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.min.css";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import registerCustomIcons from "./registerCustomIcons";

export default ({
  handleAddProduct,
  setCategory,
  activeCategory,
  POSMode,
  togglePOSMode
}) => {
  registerCustomIcons();

  return (
    <Fab
      mainButtonStyles={{ backgroundColor: "#209647" }}
      actionButtonStyles={{ backgroundColor: "#209647" }}
      position={{ bottom: 0, right: 0 }}
      icon={<Icon iconName="GlobalNavButton" />}
      event={"click"}
    >
      <Action text="Add Product" onClick={handleAddProduct}>
        <Icon iconName="Add" />
      </Action>
      <Action
        text="Flower Only"
        onClick={() => setCategory("Flower")}
        style={{
          backgroundColor: activeCategory === "Flower" ? "#209647" : null
        }}
      >
        <Icon iconName="cannabis" />
      </Action>
      <Action
        text="Edibles Only"
        onClick={() => setCategory("Edible")}
        style={{
          backgroundColor: activeCategory === "Edible" ? "#209647" : null
        }}
      >
        <Icon iconName="cookie" />
      </Action>
      <Action
        text="Concentrates Only"
        onClick={() => setCategory("Concentrate")}
        style={{
          backgroundColor: activeCategory === "Concentrate" ? "#209647" : null
        }}
      >
        <Icon iconName="vape" />
      </Action>
      <Action
        text="Topicals Only"
        onClick={() => setCategory("Topical")}
        style={{
          backgroundColor: activeCategory === "Topical" ? "#209647" : null
        }}
      >
        <Icon iconName="lotion" />
      </Action>
      <Action text="Reset Filter" onClick={() => setCategory(null)}>
        <Icon iconName="Refresh" />
      </Action>
      {/* <Action
        text="POS Mode"
        onClick={togglePOSMode}
        style={{
          backgroundColor: POSMode ? "#209647" : null
        }}
      >
        <Icon iconName="register" />
      </Action> */}
    </Fab>
  );
};
