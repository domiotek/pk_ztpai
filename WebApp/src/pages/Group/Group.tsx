import { useCallback, useContext, useRef, useState } from "react";
import classes from "./Group.module.css";
import { AppContext } from "../../App";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RESTAPI } from "../../types/api";
import { callAPI } from "../../modules/utils";
import LoadingPageWrapper from "../../components/LoadingPageWrapper/LoadingPageWrapper";
import GroupMemberPanel from "../../components/GroupMemberPanel/GroupMemberPanel";
import UpdateGroupNameForm from "../../components/UpdateGroupNameForm/UpdateGroupNameForm";
import ErrorToastWidget from "../../components/ErrorToastWidget/ErrorToastWidget";
import { useNavigate } from "react-router-dom";
import GenericIlustratedMessage from "../../components/GenericIlustratedMessage/GenericIlustratedMessage";

export default function Group() {
	const {activeGroup, userData, setActiveGroup} = useContext(AppContext);
	const queryClient = useQueryClient();
	const [errCode, setErrCode] = useState<RESTAPI.RegenGroupInviteCode.IEndpoint["error"]["code"] | null>(null);
	const [errToastShowCounter, setErrToastShowCounter] = useState<number | false>(false);

	const navigate = useNavigate();

	const {error, data, isFetching} = useQuery<RESTAPI.GroupData.IResponseData, RESTAPI.GroupData.IEndpoint["error"]>({
        queryKey: ["GroupData"],
        queryFn: ()=>callAPI<RESTAPI.GroupData.IEndpoint>("GET","/api/groups/:groupID",null, {groupID: activeGroup?.toString() ?? ""}),
        retry: true
    });

	const inviteLinkHolder = useRef<HTMLHeadingElement>(null);

	const copyInviteCodeHandler = useCallback(()=>{
		if(inviteLinkHolder.current)
			navigator.clipboard.writeText(inviteLinkHolder.current.innerHTML);
	},[]);


	const regenInviteCodeMutation = useMutation<null,RESTAPI.RegenGroupInviteCode.IEndpoint["error"], null>({
        mutationFn: ()=>callAPI<RESTAPI.RegenGroupInviteCode.IEndpoint>("POST","/api/groups/:groupID/regenInvite",null,{groupID: activeGroup?.toString() as string}),
        onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey: ["GroupData"]});
			queryClient.invalidateQueries({queryKey: ["EventLog", activeGroup]});
		},
		onError: (err=>{
			setErrCode(err.code);
			setErrToastShowCounter((errToastShowCounter?errToastShowCounter:0) + 1);
		})
    });

	const leaveGroupMutation = useMutation<null,RESTAPI.LeaveGroup.IEndpoint["error"], null>({
        mutationFn: ()=>callAPI<RESTAPI.LeaveGroup.IEndpoint>("DELETE","/api/groups/:groupID/members/self",null,{groupID: activeGroup?.toString() as string}),
        onSuccess: async ()=>{
			await queryClient.invalidateQueries({queryKey: ["UserData"]});
			queryClient.invalidateQueries({queryKey: ["EventLog", activeGroup]});
			setActiveGroup(null);
			navigate("/");
		},
		onError: (err=>{
			setErrCode(err.code);
			setErrToastShowCounter((errToastShowCounter?errToastShowCounter:0) + 1);
		})
    });

	const kickFromGroupMutation = useMutation<null,RESTAPI.KickFromGroup.IEndpoint["error"], {userID: string}>({
        mutationFn: data=>callAPI<RESTAPI.KickFromGroup.IEndpoint>("DELETE","/api/groups/:groupID/members/:userID",null,{groupID: activeGroup?.toString() as string, userID: data.userID}),
        onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey: ["GroupData"]});
			queryClient.invalidateQueries({queryKey: ["EventLog", activeGroup]});
		},
		onError: (err=>{
			setErrCode(err.code);
			setErrToastShowCounter((errToastShowCounter?errToastShowCounter:0) + 1);
		})
    });


	return (
		<div className={classes.GroupPage}>
            <h2>Your group</h2>

			<LoadingPageWrapper isLoading={isFetching}>
				{
					error?
						<GenericIlustratedMessage imgSrc="/illustrations/generic_error.svg" imgAlt="Unknown error" title="Something bad and unexpected happened..." subtitle="Try reloading"/>
					:
						<>
							<h3 className={classes.SectionHeading}>Group name</h3>
							<UpdateGroupNameForm groupID={activeGroup as number} initialValue={data?.name} />

							<h3 className={classes.SectionHeading}>Members</h3>
							<section>
								{
									data?.members.map(item=>
										<GroupMemberPanel 
											key={item.id} 
											data={item}
											renderOwner={data.ownerID==userData?.id} 
											renderSelf={item.id==userData?.id} 
											onKick={(ID)=>kickFromGroupMutation.mutate({userID: ID.toString()})}
											onLeave={()=>leaveGroupMutation.mutate(null)}
										/>
									)
								}
							</section>
							<section className={classes.JoinSection}>
								<h4>Want to add more people?</h4>
								<h6>Just send them this link</h6>
								<div className={classes.InviteLinkHolder}>
									<h6 ref={inviteLinkHolder}>{location.protocol}//{location.host}/invite?code={data?.inviteCode}</h6>
									<button type="button" title="Copy invitation code" onClick={copyInviteCodeHandler}><i className="fa-regular fa-copy"></i></button>
								</div>
								<h6 className={classes.RegenerateCodePrompt}>Want new one? <a onClick={()=>regenInviteCodeMutation.mutate(null)}>Regenerate</a></h6>
							</section>
						</>
				}
				
			</LoadingPageWrapper>
			<ErrorToastWidget message={`Something went wrong. This code may be helpful: ${errCode}`} show={errToastShowCounter}/>
		</div>
	)
}
