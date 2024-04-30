import { useContext, useLayoutEffect } from "react";
import EntityList from "../../components/EntityList/EntityList";
import EventBox from "../../components/EventBox/EventBox";
import NotePanel from "../../components/NotePanel/NotePanel";
import TaskPanel from "../../components/TaskPanel/TaskPanel";
import classes from "./Dashboard.module.css";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {

	const {userData, updatingUserData} = useContext(AppContext);

	const navigate = useNavigate();

	useLayoutEffect(()=>{
		if(!updatingUserData&&userData&&userData.groups.length==0) navigate("/new");
	},[]);

	return (
		<div className={classes.DashboardPage}>
			<h2>Hello {userData?.name}</h2>
            <EventBox />
            <section className={classes.ListsContainer}>
				<div className={classes.ListWrapper}>
					<EntityList header="Tasks" viewAllLink="/items">
						<TaskPanel />
					</EntityList>
				</div>
				<div className={classes.ListWrapper}>
					<EntityList header="Notes" viewAllLink="/items">
						<NotePanel />
					</EntityList>
				</div>
            </section>
		</div>
	)
}
