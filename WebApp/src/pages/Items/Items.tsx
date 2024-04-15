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

export default function Items() {

	const {showModal, setModalContent} = useContext(AppContext);
	const [activeTab, setActiveTab] = useState<"Tasks" | "Notes">("Tasks");


	const showCreateTaskModal = ()=>{
		setModalContent(<CreateTaskModal />) && showModal();
	}

	const showCreateNoteModal = ()=>{
		setModalContent(<CreateNoteModal />) && showModal();
	}

	const showEditTaskModal = ()=>{
		setModalContent(<EditTaskModal />) && showModal();
	}

	const showEditNoteModal = ()=>{
		setModalContent(<EditNoteModal />) && showModal();
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
							<i className="fa-solid fa-plus"></i>
							Add new
						</button>
					</div>
					<EntityList>
						<TaskPanel onClick={showEditTaskModal} />
					</EntityList>
				</section>
				<section className={`${classes.ListWrapper} ${activeTab=="Notes"?classes.Shown:""}`}>
					<div className={classes.ListHeader}>
						<h3>Notes</h3>
						<button type="button" className={classes.InSectionAddEntityButton} onClick={showCreateNoteModal}>
							<i className="fa-solid fa-plus"></i>
							Add new
						</button>
					</div>
					<EntityList>
						<NotePanel onClick={showEditNoteModal}/>
					</EntityList>
				</section>
            </section>
            <button type="button" className={classes.AddEntityButton} title="Add new item">
                <i className="fa-solid fa-plus"></i>
            </button>
		</>
	)
}
