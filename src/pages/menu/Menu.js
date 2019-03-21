import React, { Component } from "react";
import "./menu.scss";

import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle
} from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from "office-ui-fabric-react/lib/Image";

import EditProductPanel from "./EditProductPanel";

import MenuContext from "./menuContext";

import AdditionImage from "../../assets/images/addition.png";

let products = [
  {
    id: 1,
    name: "Pineapple Shock",
    strainType: "Indica",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 2,
    name: "Lemon G",
    strainType: "Hybrid",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 3,
    name: "Strawberry OG",
    strainType: "Hybrid",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 4,
    name: "Lemon Skunk",
    strainType: "Hybrid",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 5,
    name: "Platinum Girl Scout Cookies",
    strainType: "Hybrid",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 6,
    name: "Otto",
    strainType: "CBD",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 7,
    name: "Sour Diesel",
    strainType: "Sativa",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 8,
    name: "Cookie Wreck",
    strainType: "Hybrid",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 9,
    name: "Kush X",
    strainType: "Hybrid",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  },
  {
    id: 10,
    name: "Cannatonic",
    strainType: "CBD",
    image:
      "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/5970c74d15d5dbbb28bd83ca/59b043c2c027d86344940f76/1551390566256/BG+PNG.png?format=2500w"
  }
];

class Menu extends Component {
  state = {
    showPanel: false,
    activeProduct: {},
    newProduct: false
  };

  renderProducts() {
    return products.map((item, index) => (
      <DocumentCard
        onClick={() => this.setActiveProduct(index, this._showPanel)}
        className="item"
        key={index}
      >
        <DocumentCardPreview
          {...{
            previewImages: [
              {
                previewImageSrc: item.image,
                imageFit: ImageFit.contain,
                width: "100%",
                height: 196
              }
            ]
          }}
        />
        <DocumentCardTitle title={item.name} className="item__title" />
      </DocumentCard>
    ));
  }

  setActiveProduct = (indx, cb) => {
    this.setState({ activeProduct: products[indx] });
    cb();
  };

  _hidePanel = () => {
    this.setState({ showPanel: false, newProduct: false });
  };

  _showPanel = () => {
    this.setState({ showPanel: true, newProduct: false });
  };

  _createNewProduct = () => {
    this.setState({
      newProduct: true,
      showPanel: true,
      activeProduct: {}
    });
  };

  _saveNewProduct = newProduct => products.push(newProduct);

  _removeProduct = productToRemove => {
    products = products.filter(product => product.id !== productToRemove.id);
    this._hidePanel();
  };

  render() {
    const { activeProduct, newProduct, showPanel } = this.state;
    return (
      <MenuContext.Provider value={{ activeProduct }}>
        <div className="menu">
          <DocumentCard
            onClick={this._createNewProduct}
            className="item"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <DocumentCardPreview
              className="newProduct"
              {...{
                previewImages: [
                  {
                    previewImageSrc: AdditionImage,
                    width: "100%"
                  }
                ]
              }}
            />
            <DocumentCardTitle title="Add New Item" className="item__title" />
          </DocumentCard>
          {this.renderProducts()}
          <EditProductPanel
            _hidePanel={this._hidePanel}
            showPanel={showPanel}
            newProduct={newProduct}
            saveNewProduct={this._saveNewProduct}
            removeProduct={this._removeProduct}
          />
        </div>
      </MenuContext.Provider>
    );
  }
}

export default Menu;
