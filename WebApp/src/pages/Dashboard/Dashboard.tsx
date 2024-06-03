import { useCallback, useContext, useLayoutEffect } from "react";
import EntityList from "../../components/EntityList/EntityList";
import EventBox from "../../components/EventBox/EventBox";
import NotePanel from "../../components/NotePanel/NotePanel";
import TaskPanel from "../../components/TaskPanel/TaskPanel";
import classes from "./Dashboard.module.css";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { RESTAPI } from "../../types/api";
import EditTaskModal from "../../modals/EditTaskModal/EditTaskModal";
import EditNoteModal from "../../modals/EditNoteModal/EditNoteModal";


export default function Dashboard() {
	const {userData, updatingUserData, setModalContent, showModal, activeGroup} = useContext(AppContext);

	const navigate = useNavigate();

	useLayoutEffect(()=>{
		if(!updatingUserData&&userData&&userData.groups.length==0) navigate("/new");
	},[]);

	const openEditTaskModal = useCallback((taskID: number)=>{
		setModalContent(<EditTaskModal taskID={taskID} />) && showModal();
	},[]);

	const openEditNoteModal = useCallback((noteID: number)=>{
		setModalContent(<EditNoteModal noteID={noteID} />) && showModal();
	},[]);

	const taskFactory = (tasks: RESTAPI.Entities.ITask[])=>{
		const result = [];

		for (const task of tasks) {
			result.push(
				<TaskPanel 
					key={task.taskID} 
					data={task}
					onClick={()=>openEditTaskModal(task.taskID)}
				/>
			);
		}

		return result;
	}

	const noteFactory = (notes: RESTAPI.Entities.INote[])=>{
		const result = [];

		for (const note of notes) {
			result.push(
				<NotePanel 
					key={note.noteID} 
					data={note} 
					onClick={()=>openEditNoteModal(note.noteID)}
				/>
			);
		}

		return result;
	}

	return (
		<div className={classes.DashboardPage}>
			<h2>Hello {userData?.name}</h2>
			{
				activeGroup!=null?
				<>
					 <EventBox />
					<section className={classes.ListsContainer}>
						<div className={classes.ListWrapper}>
							<EntityList<RESTAPI.GetTasks.IEndpoint>
								header="Tasks" 
								viewAllLink="/items" 
								endpointURL="/api/groups/:groupID/tasks" 
								noItemsImageUrl="/illustrations/add_task.svg"
								dataSetID="Tasks"
								itemFactory={taskFactory}
							/>
						</div>
						<div className={classes.ListWrapper}>
							<EntityList<RESTAPI.GetNotes.IEndpoint>  
								header="Notes" 
								viewAllLink="/items"
								endpointURL="/api/groups/:groupID/notes"
								noItemsImageUrl="/illustrations/add_note.svg"
								dataSetID="Notes"
								itemFactory={noteFactory}
							/>
						</div>
					</section>
				</>
				:
				<>
				</>
			}
           
		</div>
	)
}
