import { useState } from "react";
import { TextField, Button, Anchor } from "@legion-ui-kit/react-core";
import styles from "../Authentication.module.css";

export const Register = ({ onRegister, onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister?.({ email, password });
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.blob} />

      <div className={styles.authTopNav}>
        <button
          className={`${styles.authNavItem} ${styles.authNavItemPill}`}
          onClick={() => onNavigate("signin")}
        >
          Sign in
        </button>
        <button
          className={`${styles.authNavItem} ${styles.authNavItemActive}`}
          onClick={() => onNavigate("register")}
        >
          Register
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.leftContent}>
          <h1 className={styles.headline}>
            Register to
            <br />
            CMMI Dashboard
          </h1>
          <p className={styles.registerPrompt}>
            already have an account?
            <br />
            you can{" "}
            <Anchor as="a" href="#" onClick={() => onNavigate("signin")} className={styles.registerLink}>
              Sign in here!
            </Anchor>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.rightContent}>
          <TextField
            type="email"
            placeholder="internkeren@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            block
            className={styles.field}
          />
          <TextField
            type="password"
            placeholder="interndpe2026"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            block
            className={styles.field}
          />

          <Button type="submit" color="primary" variant="solid" block className={styles.signUpBtn}>
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;