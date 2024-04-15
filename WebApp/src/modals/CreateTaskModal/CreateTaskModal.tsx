import { useContext, useEffect, useId } from "react"
import { ModalContext } from "../../components/ModalContainer/ModalContainer";
import classes from "./CreateTaskModal.module.css";
import commonClasses from "../common.module.css";

export default function CreateTaskModal() {
	const titleInputID = useId();
	const assignedUserInputID = useId();
	const dueDateInputID = useId();

	const modalContext = useContext(ModalContext);

	useEffect(()=>{
		modalContext.setHostClassName(classes.CreateTaskModal);
	},[]);

	return (
		<div className={commonClasses.ModalContent}>
			<h3>Create new task</h3>
			<form className={commonClasses.Form}>
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
