import { useContext, useState } from "react";
import EntityList from "../../components/EntityList/EntityList";
import NotePanel from "../../components/NotePanel/NotePanel";
import TabSelector from "../../components/TabSelector/TabSelector";
import TaskPanel from "../../components/TaskPanel/TaskPanel";
import classes from "./Items.module.css";
import { AppContext } from "../../App";
import CreateTaskModal from "../../modals/CreateTaskModal/CreateTaskModal";
import CreateNoteModal from "../../modals/CreateNoteModal/CreateNoteModal";
import EditTaskModal from "../../modals/EditTaskModal/EditTaskModal";
import EditNoteModal from "../../modals/EditNoteModal/EditNoteModal";
import { RESTAPI } from "../../types/api";

export default function Items() {

	const {showModal, setModalContent} = useContext(AppContext);
	const [activeTab, setActiveTab] = useState<"Tasks" | "Notes">("Tasks");


	const showCreateTaskModal = ()=>{
		setModalContent(<CreateTaskModal />) && showModal();
	}

	const showCreateNoteModal = ()=>{
		setModalContent(<CreateNoteModal />) && showModal();
	}

	const showEditTaskModal = (taskID: number)=>{
		setModalContent(<EditTaskModal taskID={taskID} />) && showModal();
	}

	const showEditNoteModal = (noteID: number)=>{
		setModalContent(<EditNoteModal noteID={noteID} />) && showModal();
	}

	const taskFactory = (tasks: RESTAPI.Entities.ITask[])=>{
		const result = [];

		for (const task of tasks) {
			result.push(
				<TaskPanel 
					key={task.taskID} 
					data={task}
					onClick={()=>showEditTaskModal(task.taskID)}
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
					onClick={()=>showEditNoteModal(note.noteID)}
				/>
			);
		}

		return result;
	}

	return (
		<>
			<h2>Tasks & notes</h2>
			<section className={classes.TargetListSwitcher}>
				<TabSelector<"Tasks" | "Notes"> tabHeaders={["Tasks", "Notes"]} selectedTab={activeTab} tabSelector={setActiveTab}/>
			</section>
            <section className={classes.ListsContainer}>
				<section className={`${classes.ListWrapper} ${activeTab=="Tasks"?classes.Shown:""}`}>
					<div className={classes.ListHeader}>
						<h3>Tasks</h3>
						<button type="button" className={classes.InSectionAddEntityButton} onClick={showCreateTaskModal}>
							<i className="fa-solid fa-plus" />
							Add new
						</button>
					</div>
					<EntityList<RESTAPI.GetTasks.IEndpoint> 
						endpointURL="/api/groups/:groupID/tasks" 
						dataSetID="Tasks"
						noItemsImageUrl="/illustrations/add_task.svg"
						itemFactory={taskFactory}
					/>
				</section>
				<section className={`${classes.ListWrapper} ${activeTab=="Notes"?classes.Shown:""}`}>
					<div className={classes.ListHeader}>
						<h3>Notes</h3>
						<button type="button" className={classes.InSectionAddEntityButton} onClick={showCreateNoteModal}>
							<i className="fa-solid fa-plus"></i>
							Add new
						</button>
					</div>
					<EntityList<RESTAPI.GetNotes.IEndpoint>
						endpointURL="/api/groups/:groupID/notes"
						dataSetID="Notes"
						noItemsImageUrl="/illustrations/add_note.svg"
						itemFactory={noteFactory}
					/>
				</section>
            </section>
            <button type="button" className={classes.AddEntityButton} title="Add new item">
                <i className="fa-solid fa-plus"></i>
            </button>
		</>
	)
}
