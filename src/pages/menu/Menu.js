import React, { Component } from "react";
import "./menu.scss";

import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle
} from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from "office-ui-fabric-react/lib/Image";

import EditProductPanel from "./EditProductPanel";

import AdditionImage from "../../assets/images/addition.png";

class Menu extends Component {
  state = { data: [0, 1, 2, 3, 4, 5, 6, 7, 8], showPanel: false };

  renderProducts() {
    const { data } = this.state;

    const previewProps = {
      previewImages: [
        {
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

  render() {
    return (
      <div className="menu">
        <DocumentCard
          onClick={this._showPanel}
          className="item"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <DocumentCardPreview
            {...{
              previewImages: [
                {
                  previewImageSrc: AdditionImage,
                  width: "100%",
                  height: 196
                }
              ]
            }}
          />
          <DocumentCardTitle title="Add New Item" className="item__title" />
        </DocumentCard>
        {this.renderProducts()}
        <EditProductPanel
          _hidePanel={this._hidePanel}
          showPanel={this.state.showPanel}
        />
      </div>
    );
  }
}

export default Menu;
