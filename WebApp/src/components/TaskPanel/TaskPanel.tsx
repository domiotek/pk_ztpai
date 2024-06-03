import { MouseEvent, MouseEventHandler, useCallback, useContext, useRef, useState } from "react";
import classes from "./TaskPanel.module.css";
import { RESTAPI } from "../../types/api";
import {DateTime} from "luxon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callAPI } from "../../modules/utils";
import { AppContext } from "../../App";

interface IProps {
	onClick?: MouseEventHandler
	data: RESTAPI.Entities.ITask
}

export default function TaskPanel({data, onClick}: IProps) {
	const {activeGroup} = useContext(AppContext);
	const [taskState, setTaskState] = useState<boolean>(data.isCompleted);
	const [apiCallInProgress, setAPICallInProgress] = useState<boolean>(false);

	const toSetStateRef = useRef<boolean>(taskState);
	const queryClient = useQueryClient();

	const toggleStateMutation = useMutation<null,RESTAPI.ToggleTaskState.IEndpoint["error"], boolean>({
        mutationFn: state=>callAPI<RESTAPI.ToggleTaskState.IEndpoint>("PUT","/api/groups/:groupID/tasks/:taskID/state",{state} as any,{groupID: activeGroup?.toString() as string, taskID: data.taskID.toString()}),
        onSuccess: ()=>{
			setTaskState(!taskState);
			setAPICallInProgress(false);
			queryClient.invalidateQueries({queryKey: ["EventLog"]});
		}
    });

	const toggleStateAction = useCallback((e: MouseEvent<HTMLElement>)=>{
		e.stopPropagation();
		setAPICallInProgress(true);
		toggleStateMutation.mutate(!taskState);
		toSetStateRef.current = !taskState;
	},[taskState]);

	return (
		<li className={classes.EntityPanel} onClick={onClick}>
			<label className={classes.CheckBox} onClick={toggleStateAction}>
				<input type='checkbox' checked={taskState} title="Task state" disabled={apiCallInProgress} onChange={()=>{}}/>
				<span className={classes.Checkmark}></span>
			</label>
			<div className={classes.TaskBody}>
				<h3>{data.title}</h3>
				<i className={`fas fa-edit ${classes.EditIcon}`} />
				<h6>
					{data.assignedUser && <span>Assigned to {data.assignedUser.name}</span>}
					<span>{DateTime.fromISO(data.creationDate).toRelative()}</span>
					{data.dueDate && <span>Due {DateTime.fromISO(data.dueDate).toFormat("dd/LL/yyyy")}</span> }
				</h6>
			</div>
		</li>
	)
}
