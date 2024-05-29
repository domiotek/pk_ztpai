
import { FormEvent, useCallback, useContext, useEffect, useId, useState } from "react";
import commonClasses from "../common.module.css";
import classes from "./CreateNoteModal.module.css";
import { ModalContext } from "../../components/ModalContainer/ModalContainer";
import { AppContext } from "../../App";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callAPI } from "../../modules/utils";
import { RESTAPI } from "../../types/api";

export default function CreateNoteModal() {
	const titleInputID = useId();
	const contentInputID = useId();

	const modalContext = useContext(ModalContext);
	const {activeGroup} = useContext(AppContext);

	const queryClient = useQueryClient();

	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [submitError, setSubmitError] = useState<boolean>(false);

	useEffect(()=>{
		modalContext.setHostClassName(commonClasses.Modal);
	},[]);

	const submitMutation = useMutation<null, RESTAPI.CreateNote.IEndpoint["error"], RESTAPI.CreateNote.IRequestData>({
		mutationFn: data=>callAPI<RESTAPI.CreateNote.IEndpoint>("POST","/api/groups/:groupID/notes",data, {groupID: activeGroup?.toString() as string}),
		onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey: ["Notes", activeGroup]});
			modalContext.closeModal();
		},
		onError: ()=>setSubmitError(true)
	})


	const submitCallback = useCallback((e: FormEvent)=>{
		e.preventDefault();

		submitMutation.mutate({
			title,
			content
		});

	},[title, content]);

	return (
		<div className={commonClasses.ModalContent}>
			<h3>Create new note</h3>
			<form className={commonClasses.Form} onSubmit={submitCallback}>
				<label htmlFor={titleInputID}>Title</label>
				<input id={titleInputID} name="title" type="text" required maxLength={50} value={title} onChange={e=>setTitle(e.target.value)} />

				<label htmlFor={contentInputID}>Note</label>
				<textarea className={classes.Textarea} name="content" id={contentInputID} maxLength={255} required value={content} onChange={e=>setContent(e.target.value)} />

				<div className={commonClasses.ButtonsWrapper}>
					<h3 className={`${commonClasses.CallStatus} ${submitError?commonClasses.Active:""}`}><i className='fas fa-info-circle'/>Operation failed</h3>
					<button type="button" className={commonClasses.CancelButton} onClick={()=>modalContext.closeModal()}>Cancel</button>
					<button type="submit" className={commonClasses.SubmitButton}>Create</button>
				</div>
			</form>
		</div>
	)
}
