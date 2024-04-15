import classes from "../Portal/Common.module.css";
import CheckBox from '../../components/CheckBox/CheckBox';
import { Link } from "react-router-dom";

export default function Login() {

	return (
		<div className={classes.Wrapper}>
            <label htmlFor="emailInput">Email</label>
            <input id="emailInput" name="username" type="email" />

            <label htmlFor="passwordInput">Password</label>
            <input id="passwordInput" name="password" type="password" />
            <CheckBox label='Remember me' name='rememberMe' />
            <button type="submit">Login</button>

            <h5>Don't have an account yet? <Link to="/register">Register now</Link></h5>
        </div>
	)
}
