import { useContext, useEffect, useId } from "react";
import commonClasses from "../common.module.css";
import classes from "./EditTaskModal.module.css";
import { ModalContext } from "../../components/ModalContainer/ModalContainer";

export default function EditTaskModal() {
	const titleInputID = useId();
	const assignedUserInputID = useId();
	const dueDateInputID = useId();

	const modalContext = useContext(ModalContext);

	useEffect(()=>{
		modalContext.setHostClassName(classes.EditTaskModal);
	},[]);

	return (
		<div className={commonClasses.ModalContent}>
			<h3>Edit task</h3>
			
			<form className={commonClasses.Form}>
				<div className={commonClasses.DetailsSection}>
					<h5>Created by Camila on 12/04/2024</h5>
					<h5>Uncompleted</h5>

					<div className={commonClasses.ButtonsWrapper}>
						<button type="button" className={commonClasses.SubmitButton}>Delete</button>
					</div>
				</div>

				<label htmlFor={titleInputID}>Title</label>
				<input id={titleInputID} name="title" type="text" required maxLength={50} />

				<label htmlFor={assignedUserInputID}>Assign</label>
				<select name="assignedUser" id={assignedUserInputID}>
					<option value="">None</option>
					<option value="0">Andrew</option>
					<option value="1">Camila</option>
				</select>

				<label htmlFor={dueDateInputID}>Due</label>
				<input type="date" name="dueDate" id={dueDateInputID} />

				<div className={commonClasses.ButtonsWrapper}>
					<button type="button" className={commonClasses.CancelButton} onClick={()=>modalContext.closeModal()}>Cancel</button>
					<button type="button" className={commonClasses.SubmitButton}>Create</button>
				</div>
			</form>
		</div>
	)
}
