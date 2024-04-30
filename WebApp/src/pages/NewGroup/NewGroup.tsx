import { FormEvent, useCallback, useContext, useId } from "react";
import classes from "./NewGroup.module.css";
import { AppContext } from "../../App";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callAPI, processFormData } from "../../modules/utils";
import { RESTAPI } from "../../types/api";
import { useNavigate } from "react-router-dom";

export default function NewGroup() {

	const qClient = useQueryClient();

	const {userData} = useContext(AppContext);
	
	const codeInputID = useId();
	const nameInputID = useId();

	const navigate = useNavigate();

	const joinGroupMutation = useMutation<null,RESTAPI.JoinGroup.IEndpoint["error"], RESTAPI.JoinGroup.IRequest>({
        mutationFn: formData=>callAPI<RESTAPI.JoinGroup.IEndpoint>("POST","/api/groups/join",formData),
        onSuccess: ()=>{
			qClient.invalidateQueries({queryKey: ["UserData"]})
			navigate("/")
		}
    });

    const onJoinGroupSubmit = useCallback((e: FormEvent)=>{
        e.preventDefault();
        const formData = processFormData(e.target as HTMLFormElement) as RESTAPI.JoinGroup.IRequest;

        joinGroupMutation.mutate(formData);
    },[]);

	const createGroupMutation = useMutation<null,RESTAPI.CreateGroup.IEndpoint["error"], RESTAPI.CreateGroup.IRequest>({
        mutationFn: formData=>callAPI<RESTAPI.CreateGroup.IEndpoint>("POST","/api/groups",formData),
        onSuccess: ()=>{
			qClient.invalidateQueries({queryKey: ["UserData"]})
			navigate("/")
		}
    });

    const onCreateGroupSubmit = useCallback((e: FormEvent)=>{
        e.preventDefault();
        const formData = processFormData(e.target as HTMLFormElement) as RESTAPI.CreateGroup.IRequest;

        createGroupMutation.mutate(formData);
    },[]);

	return (
		<div className={classes.ContentWrapper}>
			<h2>Hello {userData?.name}</h2>
			<h5 className={classes.Subtitle}>
				{
					userData&&userData.groups.length>0?
						"Want to explore something new?"
					:
						"Let's get you into your first group!"
				}
				
			</h5>

			<div className={classes.PanelsWrapper}>
				<section className={classes.Panel}>
					<h3>Join existing group</h3>
					<form onSubmit={onJoinGroupSubmit}>
						{
							joinGroupMutation.isError &&
							<p className={classes.ErrorBox}>
								{
									joinGroupMutation.error.code=="NoEntity"?
										"Invalid code."
									:
										"Couldn't join at this time."
								}
							</p>
						}
						<label htmlFor={codeInputID}>Code</label>
						<input id={codeInputID} name="code" type="text" required />
						<button type="submit" disabled={joinGroupMutation.isPending}>Join</button>
					</form>
				</section>
				<h3 className={classes.PanelDivider}>Or</h3>
				<section className={classes.Panel}>
					<h3>Create new group</h3>
					<form onSubmit={onCreateGroupSubmit}>
						{
							createGroupMutation.isError &&
							<p className={classes.ErrorBox}>
								{
									createGroupMutation.error.code=="MaxOwnedGroupsReached"?
										"You can only own 3 groups."
									:
										"Couldn't create new group at this time."
								}
							</p>
						}
						<label htmlFor={nameInputID}>Group name</label>
						<input id={nameInputID} name="groupName" type="text" minLength={2} maxLength={15} required />
						<button type="submit" disabled={createGroupMutation.isPending}>Create</button>
					</form>
				</section>
			</div>
		</div>
	)
}
