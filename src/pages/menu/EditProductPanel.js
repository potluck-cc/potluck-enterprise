import React, { Component } from "react";

import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";
import { Image } from "office-ui-fabric-react/lib/Image";

import InputFields from "./InputFields";

class EditProductPanel extends Component {
  _onRenderFooterContent = () => {
    const { _hidePanel } = this.props;
    return (
      <div>
        <PrimaryButton onClick={_hidePanel} style={{ marginRight: "8px" }}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={_hidePanel}>Cancel</DefaultButton>
      </div>
    );
  };

  render() {
    const { showPanel, _hidePanel } = this.props;
    return (
      <Panel
        isOpen={showPanel}
        type={PanelType.smallFixedFar}
        onDismiss={_hidePanel}
        headerText="Bubble Gum"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this._onRenderFooterContent}
      >
        <Image
          src="https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
          alt="Selected Product"
          height={200}
          styles={{
            root: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        />
        <InputFields />
      </Panel>
    );
  }
}

export default EditProductPanel;
