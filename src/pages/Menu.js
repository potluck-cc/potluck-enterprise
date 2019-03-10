import React, { Component } from "react";
import "./menu.scss";

import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle
} from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from "office-ui-fabric-react/lib/Image";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";

class Menu extends Component {
  state = { data: [0, 1, 2, 3, 4, 5, 6, 7, 8], showPanel: false };

  renderProducts() {
    const { data } = this.state;

    const previewProps = {
      previewImages: [
        {
          name: "Revenue stream proposal fiscal year 2016 version02.pptx",
          linkProps: {
            href: "http://bing.com"
          },
          previewImageSrc:
            "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w",
          imageFit: ImageFit.cover,
          width: "100%",
          height: 196
        }
      ]
    };

    return data.map(item => (
      <DocumentCard onClick={this._showPanel} className="item">
        <DocumentCardPreview {...previewProps} />
        <DocumentCardTitle title="Bubble Gum" className="item__title" />
      </DocumentCard>
    ));
  }

  _hidePanel = () => {
    this.setState({ showPanel: false });
  };

  _showPanel = () => {
    this.setState({ showPanel: true });
  };

  _onRenderFooterContent = () => {
    return (
      <div>
        <PrimaryButton onClick={this._hidePanel} style={{ marginRight: "8px" }}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={this._hidePanel}>Cancel</DefaultButton>
      </div>
    );
  };

  render() {
    return (
      <div className="menu">
        {this.renderProducts()}
        <Panel
          isOpen={this.state.showPanel}
          type={PanelType.smallFixedFar}
          onDismiss={this._hidePanel}
          headerText="Bubble Gum"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={this._onRenderFooterContent}
        >
          <TextField label="Name" />
          <Dropdown
            placeholder="Select an Option"
            label="Strain Type"
            options={[
              {
                key: "Header",
                text: "Strain Type",
                itemType: DropdownMenuItemType.Header
              },
              { key: "A", text: "Sativa" },
              { key: "B", text: "Indica" },
              { key: "C", text: "Hybrid" },
              { key: "D", text: "High CBD" }
            ]}
            required={true}
          />
          <TextField label="THC%" />
          <TextField label="CBD%" />
          <TextField label="Image" iconProps={{ iconName: "CloudUpload" }} />
        </Panel>
      </div>
    );
  }
}

export default Menu;
