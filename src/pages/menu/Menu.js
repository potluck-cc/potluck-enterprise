import React, { useEffect, useState } from "react";

import {
  useLazyAppSyncQuery,
  appsyncFetch,
  useCart,
  dateFormat,
  timeFormat
} from "@potluckmarket/ella";

import "./menu.scss";

import Cart from "./Cart";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle
} from "office-ui-fabric-react/lib/DocumentCard";

import { ImageFit } from "office-ui-fabric-react/lib/Image";

import EditProductPanel from "./EditProductPanel";
import AddToCartModal from "./AddToCartModal";
import CheckoutModal from "./CheckoutModal";

import DefaultImage from "../../assets/images/potluck_default.png";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

import InfiniteScroll from "react-infinite-scroll-component";
import MenuFAB from "./MenuFAB";

import moment from "moment";

import client from "client";
import ListInventoryItems from "api/queries/ListInventoryItems";
import ListInventoryItemsWithFilter from "api/queries/ListInventoryItemsWithFilter";
import InventoryItemSubscription from "api/subscriptions/InventoryItemSubscription";
import CreateOrder from "api/mutations/CreateOrder";
import UpdateInventoryItemStock from "api/mutations/UpdateInventoryItemStock";

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
  const [state, updateState] = useState(defaultState);

  const {
    category,
    POS,
    productCards,
    newProduct,
    activeProduct,
    handleClickProductModal,
    checkoutModalOpen,
    initiateSetDiscount,
    orderComplete
  } = state;

  const [products, fetchingProducts, fetchProducts] = useLazyAppSyncQuery({
    client,
    operationType: "query",
    fetchPolicy: "network-only",
    document: category ? ListInventoryItemsWithFilter : ListInventoryItems
  });

  const [
    cart,
    {
      totalItemsInCart,
      totalDisplayValue,
      discountDisplayValue,
      subtotalDisplayValue,
      discountTypeIsPercentage,
      taxDisplayValue,
      total,
      subtotal,
      tax,
      discount,
      set,
      clear,
      remove
    }
  ] = useCart([], state.discount, false, 6.625);

  useEffect(() => {
    initializeMenu();
  }, [category]);

  useEffect(() => {
    if (
      products &&
      products.listInventories &&
      products.listInventories.items
    ) {
      updateProductsInState();
    }
  }, [products]);

  useEffect(() => {
    console.log("products changed");
    renderProductCards();
  }, [state.products]);

  function setState(property, value) {
    updateState(currentState => ({
      ...currentState,
      [property]: value
    }));
  }

  async function initializeMenu() {
    fetchProducts({
      productType: category
    });
  }

  function updateProductsInState() {
    if (category) {
      return setState("products", [...products.listInventories.items]);
    }

    setState("products", [
      ...state.products,
      ...products.listInventories.items
    ]);
  }

  function fetchMoreProducts() {
    if (products.listInventories && products.listInventories.nextToken) {
      const variables = {
        nextToken: products.listInventories.nextToken,
        productType: category
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
                        : DefaultImage,
                    imageFit: ImageFit.contain,
                    width: "100%",
                    height: 196
                  }
                ]
              }}
            />
            <DocumentCardTitle
              title={product.product.name}
              className="item__title"
            />
            <DocumentCardTitle
              title={
                product.isCannabisProduct
                  ? `${product.quantity} in stock`
                  : `${product.quantity} grams`
              }
            />
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

  function addToCart(product) {
    const itemAlreadyInCart = cart.findIndex(item => item.id === product.id);

    if (itemAlreadyInCart >= 0) {
      const updatedCart = [...cart];

      updatedCart[itemAlreadyInCart] = product;

      set(updatedCart);
    } else {
      set([...cart, product]);
    }
  }

  async function updateStockValueOfItemsInCart() {
    let cartItemsWithAvailableQuantity = [];

    return cart.map(async item => {
      if (item.stock >= 3.5) {
        const update = await appsyncFetch({
          client,
          operationType: "mutation",
          document: UpdateInventoryItemStock,
          variables: {
            id: item.id,
            quantity: weightValues[item.option.weight] * item.quantity
          }
        });

        if (update.data.updateStock) {
          cartItemsWithAvailableQuantity.push(item);
        }
      }

      return cartItemsWithAvailableQuantity;
    });
  }

  async function checkout() {
    const date = moment().format(dateFormat);
    const time = moment().format(timeFormat);

    const cart = await Promise.all(updateStockValueOfItemsInCart()).then(arr =>
      [].concat(...arr)
    );

    await appsyncFetch({
      client,
      operationType: "mutation",
      document: CreateOrder,
      variables: {
        store: "851e40a3-b63b-4f7d-be37-3cf4065c08b5",
        storeID: "851e40a3-b63b-4f7d-be37-3cf4065c08b5",
        total,
        date,
        products: JSON.stringify(cart),
        time,
        subtotal,
        tax,
        discount
      }
    });
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
            products && products.listInventories
              ? products.listInventories.nextToken
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

      {POS ? (
        <Cart
          cart={cart}
          subtotal={subtotalDisplayValue}
          cartTotal={totalDisplayValue}
          discount={discountDisplayValue}
          discountTypeIsPercentage={discountTypeIsPercentage}
          totalItems={totalItemsInCart}
          cancel={clear}
          remove={remove}
          editItemInCart={item => {
            updateState(currentState => ({
              ...currentState,
              handleClickProductModal: true,
              activeProduct: item
            }));
          }}
          initiateCheckout={() => setState("checkoutModalOpen", true)}
          initiateSetDiscount={() => setState("initiateSetDiscount", true)}
          tax={taxDisplayValue}
        />
      ) : (
        <EditProductPanel
          _hidePanel={() => setState("handleClickProductModal", false)}
          showPanel={handleClickProductModal}
          newProduct={newProduct}
          activeProduct={activeProduct}
          updateProductState={updateProductStateWithAGivenProduct}
        />
      )}

      {POS && activeProduct.product ? (
        <AddToCartModal
          open={handleClickProductModal}
          activeProduct={activeProduct}
          closeModal={() => setState("handleClickProductModal", false)}
          addToCart={addToCart}
          weightValues={weightValues}
        />
      ) : null}

      {POS && (
        <CheckoutModal
          open={checkoutModalOpen}
          closeModal={() => setState("checkoutModalOpen", false)}
          total={totalDisplayValue}
          orderComplete={orderComplete}
          confirmOrder={async () => {
            await checkout();
            setState("orderComplete", true);
            set([]);
          }}
          nextOrder={() => setState("orderComplete", false)}
          printReceipt={() => alert("printing!")}
          setDiscount={value => setState("discount", value)}
          discount={discount}
          discountType={discountTypeIsPercentage}
          isDiscount={initiateSetDiscount}
          cancelInitiateSetDiscount={() =>
            setState("initiateSetDiscount", false)
          }
        />
      )}

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
          setState("category", value);
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

export default Menu;

const weightValues = {
  eighth: 3.5,
  quarter: 7,
  half: 14,
  ounce: 28
};
