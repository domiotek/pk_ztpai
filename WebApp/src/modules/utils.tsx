import { RESTAPI } from "../types/api";

const API_SERVER_HOST = "127.0.0.1:5050";

type TSuccessCallback<T> = (data: T)=>void;
type TFailureCallback<T> = (errCode: T, statusCode: number, errorType: "Server" | "Client")=>void

export function callAPI<T extends RESTAPI.Common.IBaseAPIEndpoint>(
	method: T["method"],
	endpointURL: T["url"],
	urlParams: T["urlParams"],
	onSuccess: TSuccessCallback<T["returnData"]>,
	onError?: TFailureCallback<T["errCodes"]>,
	body?: URLSearchParams) {

		const aborter = new AbortController();
		const printAPIFailure = (endpoint: string, reason: string)=>console.error(`[API] Call to '${endpoint}' failed. Reason: ${reason}`);

		new Promise<void>(async res=>{
			if(urlParams) {
				for (const paramName in urlParams) {
					const value = urlParams[paramName];
					endpointURL = endpointURL.replace(":"+paramName,value);
				}
			}

			let response;
			let result;

			try {
				response = await fetch(`http://${API_SERVER_HOST}${endpointURL}`,{signal: aborter.signal, method, body});
				result = await response.json() as T["returnPacket"];
			}catch(err: any) {
				let errCode: RESTAPI.Common.TCommonServerErrorCodes = "ServerUnavailable";
				let statusCode: number;

				switch(err?.name) {
					case "AbortError": return;
					case "SyntaxError":
						errCode = "MalformedResponse";
						statusCode = 500;
					break;
					default:
						errCode = "ServerUnavailable";
						statusCode = 503;

				}

				if(onError) onError(errCode, statusCode,"Server");
				printAPIFailure(endpointURL,errCode);

				return;
			}


			if(response.ok&&result.status=="Success") {
				onSuccess(result.data);
			}else {
				if(onError) onError((result as any).errCode,response.status, response.status >=400&&response.status <500?"Client":"Server");

				printAPIFailure(endpointURL,(result as any).errCode);
			}

			res();
		});

		return ()=>aborter.abort();
}

export function OutsideContextNotifier(){
	console.error("Tried to access context member outside of the context provider.");
};
