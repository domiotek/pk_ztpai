import { useEffect, useState } from "react"
import GenericIlustratedMessage from "../../components/GenericIlustratedMessage/GenericIlustratedMessage";


export default function Invite() {
	const [state, setState] = useState<"pending" | "invalidCode">("pending");

	useEffect(()=>{
		const searchParams = new URLSearchParams(location.search);
		if(!searchParams.has("code")) {
			setState("invalidCode");
			return;
		}

		 
	},[]);

	return (
		<>
			<GenericIlustratedMessage imgSrc="/ilustrations/generic_error.svg" imgAlt="Error" title="Invalid code" subtitle="Given code doesn't correspond with any of the group."/>
		</>
	)
}
