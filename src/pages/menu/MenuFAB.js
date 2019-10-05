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
        text="Flower"
        onClick={() => setCategory("Flower")}
        style={{
          backgroundColor: activeCategory === "Flower" ? "#209647" : null
        }}
      >
        <Icon iconName="cannabis" />
      </Action>
      <Action
        text="Edibles"
        onClick={() => setCategory("Edible")}
        style={{
          backgroundColor: activeCategory === "Edible" ? "#209647" : null
        }}
      >
        <Icon iconName="cookie" />
      </Action>
      <Action
        text="Concentrates"
        onClick={() => setCategory("Concentrate")}
        style={{
          backgroundColor: activeCategory === "Concentrate" ? "#209647" : null
        }}
      >
        <Icon iconName="vape" />
      </Action>
      <Action
        text="Topicals"
        onClick={() => setCategory("Topical")}
        style={{
          backgroundColor: activeCategory === "Topical" ? "#209647" : null
        }}
      >
        <Icon iconName="lotion" />
      </Action>
      <Action
        text="Pre-rolls"
        onClick={() => setCategory("PreRolls")}
        style={{
          backgroundColor: activeCategory === "PreRolls" ? "#209647" : null
        }}
      >
        <Icon iconName="joints" />
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
