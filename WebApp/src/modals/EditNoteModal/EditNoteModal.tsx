import { useContext, useEffect, useId } from "react";
import commonClasses from "../common.module.css";
import classes from "./EditNoteModal.module.css";
import { ModalContext } from "../../components/ModalContainer/ModalContainer";

export default function EditNoteModal() {
	const titleInputID = useId();
	const contentInputID = useId();

	const modalContext = useContext(ModalContext);

	useEffect(()=>{
		modalContext.setHostClassName(classes.EditNoteModal);
	},[]);

	return (
		<div className={commonClasses.ModalContent}>
			<h3>Edit note</h3>
			
			<form className={commonClasses.Form}>
				<div className={commonClasses.DetailsSection}>
					<h5>Created by Andrew on 5/03/2024</h5>

					<div className={commonClasses.ButtonsWrapper}>
						<button type="button" className={commonClasses.SubmitButton}>Delete</button>
					</div>
				</div>

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
