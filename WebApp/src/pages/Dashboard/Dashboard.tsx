import EntityList from "../../components/EntityList/EntityList";
import EventBox from "../../components/EventBox/EventBox";
import NotePanel from "../../components/NotePanel/NotePanel";
import TaskPanel from "../../components/TaskPanel/TaskPanel";
import classes from "./Dashboard.module.css";


export default function Dashboard() {
	return (
		<div className={classes.DashboardPage}>
			<h2>Hello Andrew</h2>
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
