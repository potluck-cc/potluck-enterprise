import React, { useState, useEffect, Fragment, useContext } from "react";
import "./home.scss";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Link as StyledLink } from "office-ui-fabric-react/lib/Link";
import { Link } from "react-router-dom";
import StoreImage from "assets/images/store.png";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption
} from "office-ui-fabric-react/lib/Dropdown";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import {
  useForm,
  appsyncFetch,
  OperationType,
  useLazyAppSyncQuery
} from "@potluckmarket/ella";
import CreateStore from "api/mutations/CreateStore";
import GetCompanyStores from "api/queries/GetCompanyStores";
import client from "client";
import AppContext from "AppContext";
import { Fab, Action } from "react-tiny-fab";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { Auth } from "aws-amplify";
import { Auth as AuthComponent } from "auth";

const options = [
  {
    key: "usa",
    text: "USA",
    itemType: DropdownMenuItemType.Header
  },
  { key: "AK", text: "AK" },
  { key: "AZ", text: "AZ" },
  { key: "AR", text: "AR" },
  { key: "CA", text: "CA" },
  { key: "CO", text: "CO" },
  { key: "CT", text: "CT" },
  { key: "DE", text: "DE" },
  { key: "DC", text: "DC" },
  { key: "FL", text: "FL" },
  { key: "HI", text: "HI" },
  { key: "IL", text: "IL" },
  { key: "LA", text: "LA" },
  { key: "ME", text: "ME" },
  { key: "MD", text: "MD" },
  { key: "MA", text: "MA" },
  { key: "MI", text: "MI" },
  { key: "MO", text: "MO" },
  { key: "MT", text: "MT" },
  { key: "NV", text: "NV" },
  { key: "NH", text: "NH" },
  { key: "NJ", text: "NJ" },
  { key: "NM", text: "NM" },
  { key: "NY", text: "NY" },
  { key: "ND", text: "ND" },
  { key: "OH", text: "OH" },
  { key: "OK", text: "OK" },
  { key: "OR", text: "OR" },
  { key: "PA", text: "PA" },
  { key: "RI", text: "RI" },
  { key: "UT", text: "UT" },
  { key: "VT", text: "VT" },
  { key: "WA", text: "WA" },
  { key: "WV", text: "WV" }
];

const fields = [
  {
    type: "text",
    fieldName: "name",
    value: "",
    required: true,
    error: false
  },
  {
    type: "text",
    fieldName: "street",
    value: "",
    required: true,
    error: false
  },
  {
    type: "text",
    fieldName: "city",
    value: "",
    required: true,
    error: false
  },
  {
    type: "text",
    fieldName: "state",
    value: "",
    required: true,
    error: false
  },
  {
    type: "text",
    fieldName: "zip",
    value: "",
    required: true,
    error: false
  }
];

const errorMessage = "This field is required!";

function textFieldStyles() {
  return {
    icon: {
      bottom: 0
    }
  };
}

const dropdownStyles = {
  dropdown: { width: 300 }
};

export default function Home() {
  const [panelOpen, isPanelOpen] = useState(false);
  const [changePasswordPanelOpen, isChangePasswordPanelOpen] = useState(false);
  const [changeEmailPanelOpen, isChangeEmailPanelOpen] = useState(false);

  const { setActiveStore, user, setAuthenticatedUser, demo } = useContext(
    AppContext
  );

  const {
    attributes: { sub }
  } = user;

  const {
    generateFieldValues,
    updateFieldByName,
    areRequiredFieldsDirty,
    error
  } = useForm(fields);

  const { name, street, city, state, zip } = generateFieldValues();

  const [requiredFieldsDirty, setRequiredFieldsDirty] = useState(true);

  const [creatingStore, setCreatingStore] = useState(false);

  const [res, storesLoading, fetchStores] = useLazyAppSyncQuery({
    client,
    document: GetCompanyStores,
    fetchPolicy: "network-only",
    operationType: OperationType.query
  });

  const [stores, setStores] = useState([]);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (
      res &&
      res.getCompanyStores &&
      res.getCompanyStores.items &&
      res.getCompanyStores.items.length
    ) {
      setStores(res.getCompanyStores.items);
    }
  }, [res]);

  async function initialize() {
    await fetchStores({ companyId: sub });
  }

  async function onSave() {
    setCreatingStore(true);

    if (!areRequiredFieldsDirty()) {
      try {
        const { lat, lng } = (await geoLocate()) || null;

        const slug = removeSpecialChars(name).toLowerCase().replace(/ /g, "_");

        const { createStore } =
          (await appsyncFetch({
            client,
            document: CreateStore,
            operationType: OperationType.mutation,
            variables: {
              name,
              street,
              city,
              state,
              zip,
              latitude: lat,
              longitude: lng,
              companyId: sub,
              metadata: `usa-${state.toLowerCase()}-${city.toLowerCase()}-${slug}`,
              slug
            }
          })) || null;

        setCreatingStore(false);

        setStores(currStores => [...currStores, createStore]);

        isPanelOpen(false);

        return createStore;
      } catch {
        setCreatingStore(false);
        return null;
      }
    } else {
      setCreatingStore(false);
      setRequiredFieldsDirty(false);
      return null;
    }
  }

  function plusify(str) {
    return str.replace(/ /g, "+");
  }

  function removeSpecialChars(str) {
    return str.replace(/[`~!@#$%^&*()|+\-=?;:'",<>]/, '').split('.').join("")
  }

  async function geoLocate() {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${plusify(
      street
    )},${plusify(city)},${plusify(
      state
    )}&key=AIzaSyB30Evgnn_D16ZtL5qCRFzUJrj5sGY2dUo`;

    const res = await fetch(url);
    const { results } = (await res.json()) || null;

    if (results) {
      const {
        geometry: { location }
      } = results[0];

      return location || null;
    } else {
      return null;
    }
  }

  function onRenderFooterContent() {
    return creatingStore ? (
      <Spinner size={SpinnerSize.large} />
    ) : (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PrimaryButton
          onClick={() => onSave()}
          style={{
            marginRight: "8px",
            color: "#fff"
          }}
        >
          Save
        </PrimaryButton>
      </div>
    );
  }

  function renderStoreCards(store) {
    const { name, city, state, id } = store;

    return (
      <div
        className="card"
        key={id}
        onClick={() => {
          setActiveStore(store);
        }}
      >
        <Text variant="xxLarge">{name}</Text>
        <Text variant="large">{`${city}, ${state}`}</Text>
        <Link
          className="link"
          to={{
            pathname: `/${id}/menu`,
            state: {
              storeId: id
            }
          }}
        >
          <StyledLink className="button">Enter</StyledLink>
        </Link>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="cards">
        {!stores || storesLoading ? (
          <Spinner size={SpinnerSize.large} style={{ marginTop: 100 }} />
        ) : (
          <Fragment>
            {stores.map(store => renderStoreCards(store))}

            <div className="button-card" onClick={() => isPanelOpen(true)}>
              <img
                className="image"
                src={StoreImage}
                width="100"
                height="100"
                alt="add store"
              />
              <Text variant="xLarge">Add Store</Text>
            </div>
          </Fragment>
        )}
      </div>

      <Panel
        closeButtonAriaLabel="Close"
        isOpen={panelOpen}
        onDismiss={() => isPanelOpen(false)}
        type={PanelType.medium}
        onRenderFooterContent={onRenderFooterContent}
        headerText="New Location"
      >
        <div className="form">
          <TextField
            label="Store Name"
            onChange={event => updateFieldByName("name", event.target.value)}
            value={name}
            iconProps={{ iconName: "InsertTextBox" }}
            status={error ? "danger" : null}
            inputClassName="input"
            className="input-container"
            borderless
            styles={textFieldStyles}
            required
            errorMessage={
              error || (!requiredFieldsDirty && !name.length)
                ? errorMessage
                : null
            }
          />

          <TextField
            label="Street"
            onChange={event => updateFieldByName("street", event.target.value)}
            value={street}
            iconProps={{ iconName: "Street" }}
            required
            errorMessage={
              error || (!requiredFieldsDirty && !street.length)
                ? errorMessage
                : null
            }
            inputClassName="input"
            className="input-container"
            borderless
            styles={textFieldStyles}
          />

          <TextField
            label="City"
            onChange={event => updateFieldByName("city", event.target.value)}
            value={city}
            iconProps={{ iconName: "CityNext" }}
            status={error ? "danger" : null}
            inputClassName="input"
            className="input-container"
            borderless
            styles={textFieldStyles}
            required
            errorMessage={
              error || (!requiredFieldsDirty && !city.length)
                ? errorMessage
                : null
            }
          />

          <Dropdown
            placeholder="Select an option"
            label="State"
            options={options}
            required
            onChange={(event, option) =>
              updateFieldByName("state", option.text)
            }
            // styles={textFieldStyles}
          />

          {/* <TextField
            label="State"
            onChange={event => updateFieldByName("state", event.target.value)}
            value={state}
            iconProps={{ iconName: "MapPin" }}
            status={error ? "danger" : null}
            inputClassName="input"
            className="input-container"
            borderless
            styles={textFieldStyles}
            required
            errorMessage={
              error || (!requiredFieldsDirty && !state.length)
                ? errorMessage
                : null
            }
          /> */}

          <TextField
            label="Zip"
            onChange={event => updateFieldByName("zip", event.target.value)}
            value={zip}
            iconProps={{ iconName: "NumberField" }}
            status={error ? "danger" : null}
            inputClassName="input"
            className="input-container"
            borderless
            styles={textFieldStyles}
            required
            errorMessage={
              error || (!requiredFieldsDirty && !zip.length)
                ? errorMessage
                : null
            }
          />
        </div>
      </Panel>

      <Panel
        closeButtonAriaLabel="Close"
        isOpen={changePasswordPanelOpen}
        onDismiss={() => isChangePasswordPanelOpen(false)}
        type={PanelType.medium}
        headerText="Change Password"
      >
        <AuthComponent
          defaultAuthState={{
            login: false,
            forgotPassword: true,
            confirm: false
          }}
          loggedIn={true}
          onConfirm={() => isChangePasswordPanelOpen(false)}
        />
      </Panel>

      <Panel
        closeButtonAriaLabel="Close"
        isOpen={changeEmailPanelOpen}
        onDismiss={() => isChangeEmailPanelOpen(false)}
        type={PanelType.medium}
        headerText="Change Email"
      >
        <AuthComponent
          defaultAuthState={{
            login: false,
            forgotPassword: false,
            confirm: false,
            changeUsername: true
          }}
          loggedIn={true}
          onConfirm={() => isChangeEmailPanelOpen(false)}
        />
      </Panel>

      <Fab
        mainButtonStyles={{ backgroundColor: "#209647" }}
        actionButtonStyles={{ backgroundColor: "#209647" }}
        position={{ bottom: 0, right: 0 }}
        icon={<Icon iconName="GlobalNavButton" />}
        event={"click"}
      >
        <Action
          text="Sign out"
          onClick={async () => {
            await Auth.signOut();
            setAuthenticatedUser(null);
          }}
        >
          <Icon iconName="SignOut" />
        </Action>

        <Action
          text="Change Email"
          onClick={
            demo
              ? () => alert("This is just a demo!")
              : () => isChangeEmailPanelOpen(true)
          }
        >
          <Icon iconName="EditMail" />
        </Action>

        <Action
          text="Change Password"
          onClick={
            demo
              ? () => alert("this is just a demo!")
              : () => isChangePasswordPanelOpen(true)
          }
        >
          <Icon iconName="Hide" />
        </Action>
      </Fab>
    </div>
  );
}
