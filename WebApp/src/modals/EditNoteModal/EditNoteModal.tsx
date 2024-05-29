import { FormEvent, useCallback, useContext, useEffect, useId, useState } from "react";
import commonClasses from "../common.module.css";
import classes from "../CreateNoteModal/CreateNoteModal.module.css";
import { ModalContext } from "../../components/ModalContainer/ModalContainer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RESTAPI } from "../../types/api";
import { callAPI } from "../../modules/utils";
import { AppContext } from "../../App";
import { SyncLoader } from "react-spinners";
import { DateTime } from "luxon";

interface IProps {
	noteID: number
}

export default function EditNoteModal({noteID}: IProps) {
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

	const {data} = useQuery<RESTAPI.Entities.INote, RESTAPI.GetTask.IEndpoint["error"]>({
        queryKey: ["Note", noteID],
        queryFn: ()=>callAPI<RESTAPI.GetNote.IEndpoint>("GET","/api/groups/:groupID/notes/:noteID",null, {groupID: activeGroup?.toString() ?? "", noteID: noteID.toString()}),
        retry: true,
		staleTime: 60000
    });


	const deleteNoteMutation = useMutation<null,RESTAPI.DeleteNote.IEndpoint["error"], null>({
        mutationFn: state=>callAPI<RESTAPI.DeleteNote.IEndpoint>("DELETE","/api/groups/:groupID/notes/:noteID",{state} as any,{groupID: activeGroup?.toString() as string, noteID: noteID.toString()}),
        onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey: ["Notes", activeGroup]});
			modalContext.closeModal();
		}
    });

	const deleteCallback = useCallback(()=>{
		deleteNoteMutation.mutate(null);
	}, []);

	const submitMutation = useMutation<null, RESTAPI.UpdateNote.IEndpoint["error"], RESTAPI.UpdateNote.IRequestData>({
		mutationFn: data=>callAPI<RESTAPI.UpdateNote.IEndpoint>("PUT","/api/groups/:groupID/notes/:noteID",data, {groupID: activeGroup?.toString() as string, noteID: noteID.toString()}),
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
			<h3>Edit note</h3>
			
			{
				data?
					<form className={commonClasses.Form} onSubmit={submitCallback}>
						<div className={commonClasses.DetailsSection}>
							<h5>Created by {data.creator.name} on {DateTime.fromISO(data.creationDate).toFormat("dd/LL/yyyy HH:mm")}</h5>

							<div className={commonClasses.ButtonsWrapper}>
								<button type="button" className={commonClasses.SubmitButton} onClick={deleteCallback}>Delete</button>
							</div>
						</div>

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
				:
					<div className={commonClasses.LoadingPanel}>
						<SyncLoader color="var(--primary-color" />
					</div>
			}
		</div>
	)
}
