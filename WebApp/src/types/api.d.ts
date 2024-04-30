import { AxiosError } from "axios";

// declare module '@tanstack/react-query' {
// 	interface Register {
// 	  defaultError: AxiosError
// 	}
//   }
  

export namespace RESTAPI {

    namespace Common {
        type TCommonServerErrorCodes = "InternalError" | "BadRequest" | "ServerUnavailable" | "MalformedResponse" | "Unauthorized";

        interface ISuccessGetResponse<T> {
            state: true,
            data: T
        }

        interface IFailureGetResponse<T> {
            state: false,
            message?: string
            code: T
        }

        interface IBaseAPIEndpoint {
            method: "GET" | "POST" | "PUT" | "DELETE"
            url: string
            returnData: any
            errCodes: TCommonServerErrorCodes | string
            returnPacket: ISuccessGetResponse<this["returnData"]> | IFailureGetResponse<this["errCodes"]>
			requestData: Record<string, string  | number> | null
            urlParams: Record<string, string | number> | null
			error: IError<TCommonServerErrorCodes | string>
        }

        type IBuildAPIEndpoint<
				M extends "GET" | "POST" | "PUT" | "DELETE", 
				U extends string, 
				R, 
				E extends string = TCommonServerErrorCodes, 
				D extends Record<string, string | number> | null = null,
				P extends Record<string, string | number> | null = null> = {
            method: M
            url: U
            returnData: R
            errCodes: TCommonServerErrorCodes | E
            returnPacket: ISuccessGetResponse<R> | IFailureGetResponse<TCommonServerErrorCodes | E>
            urlParams: P
			requestData: D
			error: IError<TCommonServerErrorCodes | E>
        }

		interface IError<T> extends AxiosError {
			status?: number
			code: T
			message?: string
		}
    }

	namespace UserData {

		interface IBasicGroupData {
			id: number
			name: string
		}
		
		interface IResponseData {
			name: string
			groups: IBasicGroupData[]
			id: number
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"GET","/api/me",IResponseData>
	}

	namespace SignIn {
		interface IRequest extends Record<string,string> {
			username: string
			password: string
		}

		interface IResponseData {
			token: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"POST", "/api/auth/signin", IResponseData, "BadCredentials", IRequest>
	}

	namespace SignUp {
		interface IRequest extends Record<string, string> {
			username: string
			password: string
			name: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"POST", "/api/auth/signup", null, Common.TCommonServerErrorCodes, IRequest>
	}

	namespace JoinGroup {
		interface IRequest extends Record<string, string> {
			code: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"POST", "/api/groups/join", null, "NoEntity", IRequest>
	}

	namespace CreateGroup {
		interface IRequest extends Record<string, string> {
			groupName: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"POST", "/api/groups", null, "MaxOwnedGroupsReached", IRequest>
	}
}
