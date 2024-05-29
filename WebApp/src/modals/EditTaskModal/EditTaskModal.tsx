import { FormEvent, useCallback, useContext, useEffect, useId, useState } from "react";
import commonClasses from "../common.module.css";
import { ModalContext } from "../../components/ModalContainer/ModalContainer";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RESTAPI } from "../../types/api";
import { callAPI } from "../../modules/utils";
import { AppContext } from "../../App";
import { SyncLoader } from "react-spinners";

interface IProps {
	taskID: number
}


export default function EditTaskModal({taskID}: IProps) {
	const {activeGroup} = useContext(AppContext);
	const titleInputID = useId();
	const assignedUserInputID = useId();
	const dueDateInputID = useId();

	const queryClient = useQueryClient();

	const modalContext = useContext(ModalContext);

	const [title, setTitle] = useState<string>("");
	const [dueDate, setDueDate] = useState<string>("");
	const [assignedUserID, setAssignedUserID] = useState<string>("");
	const [submitError, setSubmitError] = useState<boolean>(false);

	useEffect(()=>{
		modalContext.setHostClassName(commonClasses.Modal);
	},[]);

	const {data} = useQuery<RESTAPI.Entities.ITask, RESTAPI.GetTask.IEndpoint["error"]>({
        queryKey: ["Task", taskID],
        queryFn: ()=>callAPI<RESTAPI.GetTask.IEndpoint>("GET","/api/groups/:groupID/tasks/:taskID",null, {groupID: activeGroup?.toString() ?? "", taskID: taskID.toString()}),
        retry: true,
		staleTime: 60000
    });

	const {data: membersData} = useQuery<RESTAPI.GetGroupMembers.IResponseData, RESTAPI.GetGroupMembers.IEndpoint["error"]>({
        queryKey: ["GroupMembers", activeGroup],
        queryFn: ()=>callAPI<RESTAPI.GetGroupMembers.IEndpoint>("GET","/api/groups/:groupID/members",null, {groupID: activeGroup?.toString() ?? ""}),
        retry: true,
		staleTime: 300000
    });

	useEffect(()=>{
		setTitle(data?.title ?? "");
		setAssignedUserID((data?.assignedUser?.id.toString()) ?? " ");
		setDueDate(DateTime.fromISO(data?.dueDate ?? "").toISODate() ?? "");
	},[data]);

	const deleteTaskMutation = useMutation<null,RESTAPI.DeleteTask.IEndpoint["error"], null>({
        mutationFn: state=>callAPI<RESTAPI.DeleteTask.IEndpoint>("DELETE","/api/groups/:groupID/tasks/:taskID",{state} as any,{groupID: activeGroup?.toString() as string, taskID: taskID.toString()}),
        onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey: ["Tasks", activeGroup]});
			modalContext.closeModal();
		}
    });

	const submitMutation = useMutation<null, RESTAPI.UpdateTask.IEndpoint["error"], RESTAPI.UpdateTask.IRequestData>({
		mutationFn: data=>callAPI<RESTAPI.UpdateTask.IEndpoint>("PUT","/api/groups/:groupID/tasks/:taskID",data, {groupID: activeGroup?.toString() as string, taskID: taskID.toString()}),
		onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey: ["Tasks", activeGroup]});
			modalContext.closeModal();
		},
		onError: ()=>setSubmitError(true)
	})

	const deleteCallback = useCallback(()=>{
		deleteTaskMutation.mutate(null);
	}, []);

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
			<h3>Edit task</h3>

			{
				data&&membersData?
					<form className={commonClasses.Form} onSubmit={submitCallback}>
						<div className={commonClasses.DetailsSection}>
							<h5>Created by {data.creator.name} on {DateTime.fromISO(data.creationDate).toFormat("dd/LL/yyyy HH:mm")}</h5>
							<h5>{data.isCompleted?"Completed":"Uncompleted"}</h5>

							<div className={commonClasses.ButtonsWrapper}>
								<button type="button" className={commonClasses.SubmitButton} onClick={deleteCallback}>Delete</button>
							</div>
						</div>

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
							<button type="submit" className={commonClasses.SubmitButton}>Save</button>
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
