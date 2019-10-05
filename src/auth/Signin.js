import React, { useEffect, memo, useState } from "react";
import { useAuth } from "@potluckmarket/ella";
import { Auth } from "aws-amplify";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Text } from "office-ui-fabric-react/lib/Text";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Link } from "office-ui-fabric-react/lib/Link";
import "./auth.scss";

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

function SignIn({ initializeApp = () => {} }) {
  const [authType, setAuthType] = useState({
    login: true,
    forgotPassword: false,
    confirm: false
  });

  const {
    handleLogin,
    loading,
    handleStateChange,
    username,
    error,
    code,
    password,
    handleForgotPasswordRequest,
    handleConfirmPasswordChange
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
          login: true
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
    } else {
      return "Sign In";
    }
  }

  return (
    <div className="auth-container">
      <div className="welcome">
        <p className="title">
          Pot<span className="emphasize">luck</span> Enterprise
        </p>

        <p className="subtitle">Reach your customers with ease.</p>
      </div>

      <div className="form">
        <TextField
          label="Email"
          onChange={event => handleStateChange("username", event.target.value)}
          value={username}
          iconProps={{ iconName: "Accounts" }}
          status={error ? "danger" : null}
          inputClassName="input"
          className="input-container"
          borderless
          styles={textFieldStyles}
        />

        {!authType.forgotPassword && (
          <TextField
            label="Password"
            onChange={event =>
              handleStateChange("password", event.target.value)
            }
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
            onChange={event => handleStateChange("confirm", event.target.value)}
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
      </div>
    </div>
  );
}

export default memo(SignIn);
