import { Link } from "react-router-dom";
import classes from "../Portal/Common.module.css";

export default function Register() {

	return (
		<div className={classes.Wrapper}>
            <label htmlFor="register_emailInput">Email</label>
            <input id="register_emailInput" name="username" type="email" autoComplete="username" required/>

            <label htmlFor="register_nameInput">Name</label>
            <input id="register_nameInput" name="name" type="text" required />

            <label htmlFor="register_passwordInput">Password</label>
            <input id="register_passwordInput" name="password" type="password" autoComplete="new-password" required />
            
            <label htmlFor="register_cpasswordInput">Confirm Password</label>
            <input id="register_cpasswordInput" type="password" name = "cpassword" autoComplete="new-password" required />

            <button type="submit">Register</button>

            <h5>Already have an account? <Link to="/login">Login now</Link></h5>
        </div>
	)
}
