import React, { useEffect, useState, useContext, memo } from "react";
import AppContext from "AppContext";

import { useLazyAppSyncQuery, appsyncFetch } from "@potluckmarket/ella";

import "./menu.scss";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle
} from "office-ui-fabric-react/lib/DocumentCard";

import { ImageFit } from "office-ui-fabric-react/lib/Image";

import EditProductPanel from "./EditProductPanel";

import DefaultImage from "../../assets/images/potluck_default.png";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

import InfiniteScroll from "react-infinite-scroll-component";
import MenuFAB from "./MenuFAB";

import client from "client";
import ListInventoryItems from "api/queries/ListInventoryItems";
import ListInventoryItemsWithFilter from "api/queries/ListInventoryItemsWithFilter";
import InventoryItemSubscription from "api/subscriptions/InventoryItemSubscription";

const defaultState = {
  activeProduct: {},
  newProduct: false,
  products: [],
  productCards: [],
  loading: true,
  category: null,
  POS: false,
  checkoutModalOpen: false,
  orderComplete: false,
  handleClickProductModal: false,
  initiateSetDiscount: false,
  discount: "0"
};

function Menu() {
  const {
    activeStore: { id, logo }
  } = useContext(AppContext);

  const [state, updateState] = useState(defaultState);

  const {
    category,
    POS,
    productCards,
    newProduct,
    activeProduct,
    handleClickProductModal
  } = state;

  const [products, fetchingProducts, fetchProducts] = useLazyAppSyncQuery({
    client,
    operationType: "query",
    fetchPolicy: "network-only",
    document: category ? ListInventoryItemsWithFilter : ListInventoryItems
  });

  useEffect(() => {
    initializeMenu();
  }, [category]);

  useEffect(() => {
    if (
      products &&
      products.getStoreInventory &&
      products.getStoreInventory.items.length
    ) {
      updateProductsInState();
    } else if (
      products &&
      products.getStoreInventoryWithFilters &&
      products.getStoreInventoryWithFilters.items.length
    ) {
      updateProductsInState();
    }
  }, [products]);

  useEffect(() => {
    renderProductCards();
  }, [state.products]);

  useEffect(() => {
    setState("products", defaultState.products);
  }, [category]);

  function setState(property, value) {
    updateState(currentState => ({
      ...currentState,
      [property]: value
    }));
  }

  async function initializeMenu() {
    fetchProducts({
      storeId: id,
      metadata: category ? category.toLowerCase() : null
    });
  }

  function updateProductsInState() {
    if (category) {
      return setState("products", [
        ...products.getStoreInventoryWithFilters.items
      ]);
    }

    setState("products", [
      ...state.products,
      ...products.getStoreInventory.items
    ]);
  }

  function fetchMoreProducts() {
    if (products.getStoreInventory && products.getStoreInventory.nextToken) {
      const variables = {
        nextToken: products.getStoreInventory.nextToken,
        metadata: category ? category.toLowerCase() : null,
        storeId: id
      };

      fetchProducts(variables);
    } else if (
      products.getStoreInventoryWithFilters &&
      products.getStoreInventoryWithFilters.nextToken
    ) {
      const variables = {
        nextToken: products.getStoreInventoryWithFilters.nextToken,
        metadata: category ? category.toLowerCase() : null,
        storeId: id
      };

      fetchProducts(variables);
    }
  }

  function updateProductInStateByID(updatedItem) {
    const index = state.products.findIndex(
      product => product.id === updatedItem.id
    );

    let updatedProductList = state.products;

    for (let key in updatedItem) {
      if (updatedProductList[index][key]) {
        updatedProductList[index][key] = updatedItem[key];
      }
    }

    setState("products", updatedProductList);
  }

  async function subscribeToInventoryItem(id) {
    appsyncFetch({
      client,
      document: InventoryItemSubscription,
      operationType: "subscribe",
      variables: { id },
      next: ({ data: { onUpdateInventoryItemStock } }) => {
        updateProductInStateByID(onUpdateInventoryItemStock);
        renderProductCards();
      }
    });
  }

  function renderProductCards() {
    let newProductCards = [];

    if (state.products) {
      state.products.map(product => {
        subscribeToInventoryItem(product.id);

        return newProductCards.push(
          <DocumentCard
            onClick={() => onClickProduct(product)}
            className="item"
            key={product.id}
            productType={product.productType}
          >
            <DocumentCardPreview
              {...{
                previewImages: [
                  {
                    previewImageSrc:
                      product.image && product.image.length
                        ? product.image
                        : logo
                        ? logo
                        : DefaultImage,
                    imageFit: ImageFit.contain,
                    width: "100%",
                    height: 196
                  }
                ]
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                height: 150
              }}
            >
              <DocumentCardTitle
                title={product.product.name}
                className="item__title"
              />

              {category !== product.productType && (
                <DocumentCardTitle
                  title={product.productType}
                  className="item__title"
                />
              )}

              {product.quantity && (
                <DocumentCardTitle
                  title={
                    product.isCannabisProduct
                      ? `${product.quantity} in stock`
                      : `${product.quantity} grams`
                  }
                />
              )}
            </div>
          </DocumentCard>
        );
      });

      setState("productCards", newProductCards);
    }
  }

  function onClickProduct(product) {
    updateState(currentState => ({
      ...currentState,
      activeProduct: product,
      handleClickProductModal: true,
      newProduct: false
    }));
  }

  function updateProductStateWithAGivenProduct(product, operationType) {
    updateState(currentState => {
      let updatedProductState = [...currentState.products];

      if (operationType === "edit") {
        const index = currentState.products.findIndex(
          item => item.id === product.id
        );

        updatedProductState[index] = product;
      } else if (operationType === "delete") {
        updatedProductState = updatedProductState.filter(
          item => item.id !== product.id
        );
      } else {
        updatedProductState = [...updatedProductState, product];
      }

      return {
        ...currentState,
        products: updatedProductState
      };
    });
  }

  return (
    <div className={POS ? "menu pos" : "menu"}>
      {fetchingProducts ? (
        <Spinner size={SpinnerSize.large} style={{ marginTop: 100 }} />
      ) : (
        <InfiniteScroll
          hasMore={
            products && products.getStoreInventory
              ? products.getStoreInventory.nextToken
              : false
          }
          dataLength={productCards.length}
          next={() => fetchMoreProducts()}
          loader={
            <Spinner
              size={SpinnerSize.large}
              style={{
                marginTop: 30,
                width: "100%",
                height: 196
              }}
            />
          }
          scrollableTarget=".menu"
          className="menu__list"
        >
          {productCards}
        </InfiniteScroll>
      )}

      <EditProductPanel
        _hidePanel={() => setState("handleClickProductModal", false)}
        showPanel={handleClickProductModal}
        newProduct={newProduct}
        activeProduct={activeProduct}
        updateProductState={updateProductStateWithAGivenProduct}
      />

      <MenuFAB
        handleAddProduct={() => {
          updateState(currentState => ({
            ...currentState,
            newProduct: true,
            handleClickProductModal: true,
            activeProduct: {}
          }));
        }}
        setCategory={value => {
          if (value === category) {
            setState("category", null);
          } else {
            setState("category", value);
          }
        }}
        activeCategory={category}
        togglePOSMode={() => {
          setState("POS", !POS);
        }}
        POSMode={POS}
      />

      <Alert stack={{ limit: 1 }} />
    </div>
  );
}

export default memo(Menu);
