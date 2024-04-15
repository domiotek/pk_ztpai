import { Link, Outlet, useLocation } from "react-router-dom";
import classes from "./MainLayout.module.css";

export default function MainLayout() {

	const {pathname} = useLocation();

	let activePage;
	switch(pathname) {
		case "/items": activePage = "items";break;
		case "/group": activePage="group";break;
		default: activePage = "dashboard";break;
	}

	return (
		<div className={classes.LayoutContainer}>
			<nav className={classes.NavigationPanel}>
				<Link to="/items" className={activePage=="items"?classes.Active:""}>
					<i className="fa-solid fa-list"></i>
					<span>Tasks & notes</span>
				</Link>
				<Link to="/" className={activePage=="dashboard"?classes.Active:""}>
					<i className="fa-solid fa-house"></i>
					<span>Dashboard</span>
				</Link>
				<Link to="/group" className={activePage=="group"?classes.Active:""}>
					<i className="fa-solid fa-user-group"></i>
					<span>My group</span>
				</Link>
			</nav>
			<section className={classes.ContentWrapper}>
				<Outlet />
			</section>
		</div>
	)
}
