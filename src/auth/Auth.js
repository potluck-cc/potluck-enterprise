import React, { useState, useEffect } from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Text } from "office-ui-fabric-react/lib/Text";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Link } from "office-ui-fabric-react/lib/Link";
import { useAuth } from "@potluckmarket/ella";
import { Auth } from "aws-amplify";

function textFieldStyles() {
  return {
    icon: {
      bottom: 0
    }
  };
}

function button() {
  return {
    rootHovered: {
      backgroundColor: "green"
    }
  };
}

const defaultState = {
  login: true,
  forgotPassword: false,
  confirm: false,
  changeUsername: false,
  verifyAttribute: false
};

export default function({
  defaultAuthState = null,
  initializeApp = () => {},
  loggedIn = false,
  onConfirm = () => {}
}) {
  const [authType, setAuthType] = useState(
    defaultAuthState ? defaultAuthState : defaultState
  );

  const {
    handleLogin,
    loading,
    handleStateChange,
    username,
    error,
    code,
    password,
    handleForgotPasswordRequest,
    handleConfirmPasswordChange,
    handleChangeAttribute,
    handleVerifyChangeAttribute
  } = useAuth(Auth);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    if (username) {
      handleStateChange("username", username);
    }
  }

  function login() {
    handleLogin(
      {
        username: username.toLowerCase(),
        password
      },
      async res => {
        try {
          if (
            res.challengeName &&
            res.challengeName === "NEW_PASSWORD_REQUIRED"
          ) {
            await Auth.completeNewPassword(res, password);
          }

          await initializeApp();
        } catch {}
      },
      error => {
        if (typeof error === "string") {
          handleStateChange("error", error);
        } else {
          handleStateChange("error", error.message);
        }
      }
    );
  }

  function forgotPassword() {
    handleForgotPasswordRequest(
      {
        username: username.toLowerCase()
      },
      async () => {
        setAuthType(currentState => ({
          ...currentState,
          forgotPassword: false,
          login: false,
          confirm: true
        }));
      },
      error =>
        handleStateChange(
          "error",
          typeof error === "string" ? error : error.message
        )
    );
  }

  function confirmNewPassword() {
    handleConfirmPasswordChange(
      {
        username: username.toLowerCase(),
        password,
        code
      },
      async () => {
        setAuthType(currentState => ({
          ...currentState,
          confirm: false,
          login: loggedIn ? false : true
        }));

        if (onConfirm) {
          onConfirm();
        }
      },
      error =>
        handleStateChange(
          "error",
          typeof error === "string" ? error : error.message
        )
    );
  }

  async function verifyAttribute() {
    handleVerifyChangeAttribute(
      {
        attribute: "email",
        code
      },
      async res => {
        if (onConfirm) {
          onConfirm();
        }
      },
      error => {
        handleStateChange(
          "error",
          typeof error === "string" ? error : error.message
        );
      }
    );
  }

  async function changeUsername() {
    const user = await Auth.currentAuthenticatedUser();
    handleChangeAttribute(
      {
        attributes: {
          email: username
        },
        user
      },
      async () => {
        setAuthType(currentState => ({
          ...currentState,
          confirm: true,
          changeUsername: true,
          verifyAttribute: true
        }));
      },
      error =>
        handleStateChange(
          "error",
          typeof error === "string" ? error : error.message
        )
    );
  }

  function renderButtonText() {
    if (authType.forgotPassword) {
      return "Reset Password";
    } else if (authType.confirm) {
      return "Confirm";
    } else if (authType.changeUsername) {
      return "Change Email";
    } else {
      return "Sign In";
    }
  }

  return (
    <div className="form">
      <TextField
        label={authType.changeUsername ? "New Email" : "Email"}
        onChange={event => handleStateChange("username", event.target.value)}
        value={username}
        iconProps={{ iconName: "Accounts" }}
        status={error ? "danger" : null}
        inputClassName="input"
        className="input-container"
        borderless
        styles={textFieldStyles}
        disabled={authType.confirm && authType.verifyAttribute ? true : false}
      />

      {!authType.forgotPassword && !authType.changeUsername && (
        <TextField
          label="Password"
          onChange={event => handleStateChange("password", event.target.value)}
          type="password"
          value={password}
          iconProps={{ iconName: "Lock" }}
          status={error ? "danger" : null}
          inputClassName="input"
          className="input-container"
          borderless
          styles={textFieldStyles}
        />
      )}

      {authType.confirm && (
        <TextField
          label="Confirm"
          onChange={event => handleStateChange("code", event.target.value)}
          value={code}
          iconProps={{ iconName: "Lock" }}
          status={error ? "danger" : null}
          inputClassName="input"
          className="input-container"
          borderless
          styles={textFieldStyles}
        />
      )}

      {loading ? (
        <Spinner size={SpinnerSize.large} />
      ) : (
        <PrimaryButton
          styles={button}
          className="button"
          buttonType="hero"
          onClick={() => {
            if (authType.login) {
              login();
            } else if (authType.forgotPassword) {
              forgotPassword();
            } else if (authType.changeUsername && !authType.verifyAttribute) {
              changeUsername();
            } else if (authType.changeUsername && authType.verifyAttribute) {
              verifyAttribute();
            } else {
              confirmNewPassword();
            }
          }}
          activeOpacity={0.5}
        >
          {renderButtonText()}
        </PrimaryButton>
      )}

      <Text variant="large" className="error">
        {error}
      </Text>

      {authType.confirm && !authType.verifyAttribute && (
        <Text variant="large" style={{ textAlign: "center", marginTop: 15 }}>
          An email has been sent to your email address containing a code needed
          to confirm your password change. If you do not see the email, please
          check your spam folder.
        </Text>
      )}

      {authType.confirm && authType.verifyAttribute && (
        <Text variant="large" style={{ textAlign: "center", marginTop: 15 }}>
          An email has been sent to your new email address containing a code
          needed to confirm your email change. If you do not see the email,
          please check your spam folder. If you log out without confirming your
          new email address, you may be unable to log back in.
        </Text>
      )}

      {!loggedIn && (
        <Link
          className="link"
          onClick={() =>
            setAuthType(currentState => {
              if (authType.login) {
                return {
                  ...currentState,
                  forgotPassword: true,
                  login: false
                };
              } else {
                return {
                  ...currentState,
                  forgotPassword: false,
                  login: true
                };
              }
            })
          }
        >
          {authType.login ? "Forgot Password" : "Sign In"}
        </Link>
      )}
    </div>
  );
}
