import { FormEvent, useCallback, useEffect, useState } from "react"
import classes from "./UpdateGroupNameForm.module.css"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callAPI } from "../../modules/utils";
import { RESTAPI } from "../../types/api";
import ErrorBox from "../ErrorBox/ErrorBox";

interface IProps {
	groupID: number
	initialValue?: string
}

export default function UpdateGroupNameForm({groupID, initialValue}: IProps) {
	const [name, setName] = useState<string>(initialValue ?? "");
	const [error, setError] = useState<RESTAPI.RenameGroup.IEndpoint["errCodes"] | null>(null);

	const queryClient = useQueryClient();

	const renameGroupMutation = useMutation<null,RESTAPI.RenameGroup.IEndpoint["error"], RESTAPI.RenameGroup.IRequestData>({
        mutationFn: formData=>callAPI<RESTAPI.RenameGroup.IEndpoint>("PUT","/api/groups/:groupID",formData,{groupID: groupID.toString()}),
        onSuccess: ()=>queryClient.invalidateQueries({queryKey: ["GroupData"]}),
		onError: (err=>setError(err.code))
    });


	const submitCallback = useCallback((e: FormEvent)=>{
		e.preventDefault();

		renameGroupMutation.mutate({groupName: name});
	},[name]);

	const translateErrCode = (code: RESTAPI.RenameGroup.IEndpoint["errCodes"]) => {
		switch(code) {
			case "AccessDenied": return "You must be the owner of the group in order to do that.";
			default: "Something unexpected happened. Try reloading the page.";
		}
	}

	useEffect(()=>{ 
		setName(initialValue ?? "");
	},[initialValue]);

	return (
		<form className={classes.UpdateNameForm} onSubmit={submitCallback}>
			{
				error&&
				<ErrorBox className={classes.ErrBox}>{translateErrCode(error)}</ErrorBox>
			}
			<div className={classes.InputWrapper}>
				<input name="name" type="text" title="New group name" required minLength={2} maxLength={30} value={name} onChange={(e)=>setName(e.target.value)}/>
				<button type="submit">Update</button>
			</div>
			
		</form>
	)
}
