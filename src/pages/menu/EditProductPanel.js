import React, { Component } from "react";

import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";

import MenuContext from "./menuContext";

import InputFields from "./InputFields";

class EditProductPanel extends Component {
  state = {
    name: "",
    strainType: "",
    thc: "",
    cbd: "",
    image: ""
  };

  static defaultState = {
    name: "",
    strainType: "",
    thc: "",
    cbd: "",
    image: ""
  };

  _updateField = (field, val) => this.setState({ [field]: val });

  _onRenderFooterContent = () => {
    const { _hidePanel } = this.props;
    return (
      <MenuContext.Consumer>
        {({ activeProduct }) => (
          <div>
            <PrimaryButton
              onClick={() => this._onSave(activeProduct, this._clearState)}
              style={{ marginRight: "8px" }}
            >
              Save
            </PrimaryButton>
            <DefaultButton onClick={_hidePanel}>Cancel</DefaultButton>
          </div>
        )}
      </MenuContext.Consumer>
    );
  };

  _onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      image: pictureDataURLs[0]
    });
  };

  _onSave = (activeProduct, cb) => {
    const stateCopy = { ...this.state };
    const changedValues = {};

    for (let key in stateCopy) {
      if (stateCopy[key].length) {
        changedValues[key] = stateCopy[key];
      }
    }

    const changedValueKeys = Object.keys(changedValues);

    changedValueKeys.map(key => (activeProduct[key] = changedValues[key]));

    cb();
  };

  _clearState = () => {
    const { _hidePanel } = this.props;
    this.setState({ ...EditProductPanel.defaultState });
    _hidePanel();
  };

  render() {
    const { showPanel, _hidePanel } = this.props;
    const { image, strainType } = this.state;

    return (
      <Panel
        isOpen={showPanel}
        type={PanelType.smallFixedFar}
        onDismiss={_hidePanel}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this._onRenderFooterContent}
      >
        <InputFields
          updateField={this._updateField}
          onDrop={this._onDrop}
          strainType={strainType}
          image={image}
        />
      </Panel>
    );
  }
}

export default EditProductPanel;
