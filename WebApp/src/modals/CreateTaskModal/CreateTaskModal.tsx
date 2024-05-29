import { FormEvent, useCallback, useContext, useEffect, useId, useState } from "react"
import { ModalContext } from "../../components/ModalContainer/ModalContainer";
import commonClasses from "../common.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RESTAPI } from "../../types/api";
import { callAPI } from "../../modules/utils";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../App";

export default function CreateTaskModal() {
	const {activeGroup} = useContext(AppContext);
	const modalContext = useContext(ModalContext);

	const queryClient = useQueryClient();

	const titleInputID = useId();
	const assignedUserInputID = useId();
	const dueDateInputID = useId();


	const [title, setTitle] = useState<string>("");
	const [dueDate, setDueDate] = useState<string>("");
	const [assignedUserID, setAssignedUserID] = useState<string>("");
	const [submitError, setSubmitError] = useState<boolean>(false);

	const {data: membersData} = useQuery<RESTAPI.GetGroupMembers.IResponseData, RESTAPI.GetGroupMembers.IEndpoint["error"]>({
        queryKey: ["GroupMembers", activeGroup],
        queryFn: ()=>callAPI<RESTAPI.GetGroupMembers.IEndpoint>("GET","/api/groups/:groupID/members",null, {groupID: activeGroup?.toString() ?? ""}),
        retry: true,
		staleTime: 300000
    });

	useEffect(()=>{
		modalContext.setHostClassName(commonClasses.Modal);
	},[]);

	const submitMutation = useMutation<null, RESTAPI.CreateTask.IEndpoint["error"], RESTAPI.UpdateTask.IRequestData>({
		mutationFn: data=>callAPI<RESTAPI.CreateTask.IEndpoint>("POST","/api/groups/:groupID/tasks",data, {groupID: activeGroup?.toString() as string}),
		onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey: ["Tasks", activeGroup]});
			modalContext.closeModal();
		},
		onError: ()=>setSubmitError(true)
	})

	const submitCallback = useCallback((e: FormEvent)=>{
		e.preventDefault();

		submitMutation.mutate({
			title,
			assignedUserID: assignedUserID==" "?undefined:assignedUserID,
			dueDate
		})

	},[title, assignedUserID, dueDate]);

	return (
		<div className={commonClasses.ModalContent}>
			<h3>Create new task</h3>

			{
				membersData?
					<form className={commonClasses.Form} onSubmit={submitCallback}>
						<label htmlFor={titleInputID}>Title</label>
						<input id={titleInputID} name="title" type="text" required maxLength={50} value={title} onChange={e=>setTitle(e.target.value)} />

						<label htmlFor={assignedUserInputID}>Assign</label>
						<select name="assignedUser" id={assignedUserInputID} value={assignedUserID} onChange={e=>setAssignedUserID(e.target.value)}>
							<option value={" "}>No one</option>
							{
								membersData.members.map(member=>
									<option key={member.id} value={member.id}>{member.name}</option>
								)
							}
						</select>

						<label htmlFor={dueDateInputID}>Due</label>
						<input type="date" name="dueDate" id={dueDateInputID} value={dueDate} onChange={e=>setDueDate(e.target.value)} />

						<div className={commonClasses.ButtonsWrapper}>
							<h3 className={`${commonClasses.CallStatus} ${submitError?commonClasses.Active:""}`}><i className='fas fa-info-circle'/>Operation failed</h3>
							<button type="button" className={commonClasses.CancelButton} onClick={()=>modalContext.closeModal()}>Cancel</button>
							<button type="submit" className={commonClasses.SubmitButton}>Create</button>
						</div>
					</form>
			:
				<div className={commonClasses.LoadingPanel}>
					<SyncLoader color="var(--primary-color"/>
				</div>
			}
		</div>
	)
}
