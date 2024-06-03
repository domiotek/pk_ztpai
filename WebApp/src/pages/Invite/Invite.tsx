import { useContext, useLayoutEffect, useState } from "react"
import classes from "./Invite.module.css";
import GenericIlustratedMessage from "../../components/GenericIlustratedMessage/GenericIlustratedMessage";
import { PortalContext } from "../Portal/Portal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callAPI } from "../../modules/utils";
import { RESTAPI } from "../../types/api";
import { useNavigate } from "react-router-dom";


export default function Invite() {
	const [state, setState] = useState<"pending" | "error" | "success">("pending");
	const [errorCode, setErrorCode] = useState<RESTAPI.JoinGroup.IEndpoint["errCodes"] | null>(null);

	const {showLogo} = useContext(PortalContext);

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {error: userError, isFetching: userFetching} = useQuery<RESTAPI.UserData.IResponseData, RESTAPI.UserData.IEndpoint["error"]>({
        queryKey: ["UserData"],
        queryFn: ()=>callAPI<RESTAPI.UserData.IEndpoint>("GET","/api/me"),
        retry: false,
		staleTime: 60000
    });

	const joinMutation = useMutation<null, RESTAPI.JoinGroup.IEndpoint["error"], RESTAPI.JoinGroup.IRequest>({
		mutationFn: data=>callAPI<RESTAPI.JoinGroup.IEndpoint>("POST","/api/groups/join",data),
		onSuccess: ()=>{
			setState("success");
			queryClient.invalidateQueries({queryKey: ["UserData"]});
		},
		onError: err=>{
			setState("error");
			setErrorCode(err.code);
		}
	})

	useLayoutEffect(()=>{
		setTimeout(()=>showLogo(false),0);

		const searchParams = new URLSearchParams(location.search);

		if(!searchParams.has("code")) {
			setState("error");
			return;
		}

		joinMutation.mutate({code: searchParams.get("code") ?? ""});
	},[]);

	return (
		<>
			{
				userError?.code=="Unauthorized"?
					<>
						<GenericIlustratedMessage className={classes.MessageWrapper} imgSrc="/illustrations/unauthorized.svg" imgAlt="Error" title="Access denied" subtitle="You need to sign in to continue."/>
						<button type="button" className={classes.ActionButton} onClick={()=>navigate("/login")}>Sign in</button>
					</>
				:
					userFetching || state=="pending"?
						<GenericIlustratedMessage className={classes.MessageWrapper} imgSrc="/illustrations/connecting.svg" imgAlt="Connecting people together" title="Just a sec..." subtitle="Trying to connect you with the group."/>
					:
						state=="success"?
							<>
								<GenericIlustratedMessage className={classes.MessageWrapper} imgSrc="/illustrations/new_member.svg" imgAlt="Greating new member" title="You're in" subtitle="You successfully joined the group."/>
								<button type="button" className={classes.ActionButton} onClick={()=>navigate("/")}>Continue</button>
							</>
						:
							<>
								<GenericIlustratedMessage className={classes.MessageWrapper} imgSrc="/illustrations/generic_error.svg" imgAlt="Error" title="Couldn't join group" subtitle="Something went wrong while joining the group. Make sure that the link is correct" />
								<h6>This code might be helpful: {errorCode}</h6>
							</>
			}
			
		</>
	)
}
