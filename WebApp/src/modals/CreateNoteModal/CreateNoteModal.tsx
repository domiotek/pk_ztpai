
import { useContext, useEffect, useId } from "react";
import commonClasses from "../common.module.css";
import classes from "./CreateNoteModal.module.css";
import { ModalContext } from "../../components/ModalContainer/ModalContainer";

export default function CreateNoteModal() {
	const titleInputID = useId();
	const contentInputID = useId();

	const modalContext = useContext(ModalContext);

	useEffect(()=>{
		modalContext.setHostClassName(classes.CreateNoteModal);
		modalContext.
	},[]);

	return (
		<div className={commonClasses.ModalContent}>
			<h3>Create new note</h3>
			<form className={commonClasses.Form}>
				<label htmlFor={titleInputID}>Title</label>
				<input id={titleInputID} name="title" type="text" required maxLength={50} />

				<label htmlFor={contentInputID}>Note</label>
				<textarea name="content" id={contentInputID} maxLength={255} required />

				<div className={commonClasses.ButtonsWrapper}>
					<button type="button" className={commonClasses.CancelButton} onClick={()=>modalContext.closeModal()}>Cancel</button>
					<button type="button" className={commonClasses.SubmitButton}>Create</button>
				</div>
			</form>
		</div>
	)
}
