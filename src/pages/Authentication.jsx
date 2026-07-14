import { useState } from "react";
import { TextField, Checkbox, Button, Anchor } from "@legion-ui-kit/react-core";
import styles from "../Authentication.module.css";

export const Authentication = ({ onSignIn, onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn?.({ email, password, rememberMe });
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.blob} />

      <div className={styles.authTopNav}>
        <button
          className={`${styles.authNavItem} ${styles.authNavItemActive}`}
          onClick={() => onNavigate("signin")}
        >
          Sign in
        </button>
        <button
          className={`${styles.authNavItem} ${styles.authNavItemPill}`}
          onClick={() => onNavigate("register")}
        >
          Register
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.leftContent}>
          <h1 className={styles.headline}>
            Sign In to
            <br />
            CMMI Dashboard
          </h1>
          <p className={styles.registerPrompt}>
            if you don't an account
            <br />
            you can{" "}
            <Anchor as="a" href="#" onClick={() => onNavigate("register")} className={styles.registerLink}>
              Register here!
            </Anchor>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.rightContent}>
          <TextField
            type="email"
            placeholder="masukan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            block
            className={styles.field}
          />
          <TextField
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            block
            className={styles.field}
          />

          <div className={styles.optionsRow}>
            <Checkbox
              label="Remember Me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              labelClassName={styles.rememberLabel}
            />
            <Anchor as="a" href="#" className={styles.forgotLink}>
              Forgot Password
            </Anchor>
          </div>

          <Button type="submit" color="primary" variant="solid" block className={styles.signInBtn}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Authentication;