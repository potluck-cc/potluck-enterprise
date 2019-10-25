import React, { useState, Fragment, useContext } from "react";
import { Dialog, DialogType } from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import DeleteStore from "api/mutations/DeleteStore";
import AppContext from "AppContext";
import { appsyncFetch } from "@potluckmarket/ella";
import client from "client";

function AccountSettings({
  closeDialog,
  hidden,
  renderAlert = () => {},
  dispensary
}) {
  const { user } = useContext(AppContext);
  const [dispensaryNameInput, updateDispenaryNameInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function deleteStore() {
    setLoading(true);
    try {
      await appsyncFetch({
        client,
        document: DeleteStore,
        operationType: "mutation",
        variables: {
          companyId: user.username,
          id: dispensary.id
        }
      });

      window.location.replace("/");

      setLoading(false);
    } catch {
      setLoading(false);
      renderAlert();
    }
  }

  return (
    <Dialog
      hidden={hidden}
      onDismiss={() => closeDialog()}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Delete Store"
      }}
      modalProps={{
        isBlocking: false,
        containerClassName: "ms-dialogMainOverride-info"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <TextField
          label={"Enter the name of your store in order to delete it."}
          defaultValue={dispensaryNameInput}
          onChange={e => updateDispenaryNameInput(e.target.value)}
          placeholder={dispensary.name}
        />

        {loading ? (
          <Spinner size={SpinnerSize.large} style={{ marginTop: 30 }} />
        ) : (
          <Fragment>
            <PrimaryButton
              style={{
                backgroundColor: "red",
                marginTop: 10,
                marginBottom: 10
              }}
              disabled={dispensary.name === dispensaryNameInput ? false : true}
              onClick={deleteStore}
            >
              Delete Store
            </PrimaryButton>

            <DefaultButton onClick={() => closeDialog()}>Cancel</DefaultButton>
          </Fragment>
        )}
      </div>
    </Dialog>
  );
}

export default AccountSettings;
