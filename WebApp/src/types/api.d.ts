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
			requestData: Record<string, string  | number | undefined> | null
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

	namespace GroupData {
		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		interface IUserBasic {
			id: number
			email: string
			name: string
		}

		interface IResponseData {
			id: number
			name: string
			members: IUserBasic[]
			ownerID: number
			inviteCode: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"GET", "/api/groups/:groupID", IResponseData, "NoEntity" | "AccessDenied",null, IURLParams>
	}

	namespace RenameGroup {
		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		interface IRequestData extends Record<string, string> {
			groupName: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"PUT", "/api/groups/:groupID", null, "NoEntity" | "AccessDenied", IRequestData, IURLParams>
	}

	namespace RegenGroupInviteCode {
		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"POST", "/api/groups/:groupID/regenInvite", null, "NoEntity" | "AccessDenied", null, IURLParams>
	}

	namespace LeaveGroup {
		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"DELETE", "/api/groups/:groupID/members/self", null, "NoEntity" | "AccessDenied", null, IURLParams>
	}

	namespace KickFromGroup {
		interface IURLParams extends Record<string, string> {
			groupID: string
			userID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"DELETE", "/api/groups/:groupID/members/:userID", null, "NoEntity" | "AccessDenied", null, IURLParams>
	}

	namespace Entities {
		interface IUserBasic {
			email: string
			name: string
			id: number
		}

		interface IGroupBasic {
			name: string
			id: number
		}

		interface ITask {
			taskID: number,
            isCompleted: boolean,
			creationDate: string,
            dueDate: string,
            title: string,
            assignedUser: Entities.IUserBasic | null,
			creator: Entities.IUserBasic,
			group: Entities.IGroupBasic
		}

		interface INote {
			noteID: number,
			creationDate: string,
			title: string,
			content: string,
			creator: Entities.IUserBasic,
			group: Entities.IGroupBasic
		}
	}

	namespace GetNotes {

		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"GET", "/api/groups/:groupID/notes", Entities.INote[], "NoEntity" | "AccessDenied", null, IURLParams>
	}

	namespace GetTasks {

		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"GET", "/api/groups/:groupID/tasks", Entities.ITask[], "NoEntity" | "AccessDenied", null, IURLParams>
	}

	namespace GetTask {
		interface IURLParams extends Record<string, string> {
			groupID: string
			taskID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"GET", "/api/groups/:groupID/tasks/:taskID", Entities.ITask, "NoEntity" | "AccessDenied", null, IURLParams>
	}

	namespace GetNote {
		interface IURLParams extends Record<string, string> {
			groupID: string
			noteID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"GET", "/api/groups/:groupID/notes/:noteID", Entities.INote, "NoEntity" | "AccessDenied", null, IURLParams>
	}


	namespace ToggleTaskState {

		interface IRequestData extends Record<string, string> {
			state: boolean
		}

		interface IURLParams extends Record<string, string> {
			groupID: string
			taskID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"PUT", "/api/groups/:groupID/tasks/:taskID/state", null, "NoEntity" | "AccessDenied" | "UnrecognizedEntity", IRequestData, IURLParams>
	}

	namespace DeleteTask {
		interface IURLParams extends Record<string, string> {
			groupID: string
			taskID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"DELETE", "/api/groups/:groupID/tasks/:taskID", null, "NoEntity" | "AccessDenied" | "UnrecognizedEntity", null, IURLParams>
	}

	namespace DeleteNote {
		interface IURLParams extends Record<string, string> {
			groupID: string
			noteID: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"DELETE", "/api/groups/:groupID/notes/:noteID", null, "NoEntity" | "AccessDenied" | "UnrecognizedEntity", null, IURLParams>
	}

	namespace GetGroupMembers {
		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		interface IResponseData {
			ownerID: number
			members: Entities.IUserBasic[]
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"GET", "/api/groups/:groupID/members", IResponseData, "NoEntity" | "AccessDenied", null, IURLParams>
	}

	namespace CreateTask {
		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		interface IRequestData extends Record<string, string | number | undefined> {
			title: string
			assignedUserID?: string
			dueDate?: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"POST", "/api/groups/:groupID/tasks", null,"AccessDenied", IRequestData, IURLParams>
	}

	namespace CreateNote {
		interface IURLParams extends Record<string, string> {
			groupID: string
		}

		interface IRequestData extends Record<string, string | number | undefined> {
			title: string
			content: str
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"POST", "/api/groups/:groupID/notes", null,"AccessDenied", IRequestData, IURLParams>
	}

	namespace UpdateTask {
		interface IURLParams extends Record<string, string> {
			groupID: string
			taskID: string
		}

		interface IRequestData extends Record<string, string | number | undefined> {
			title: string
			assignedUserID?: string
			dueDate?: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"PUT", "/api/groups/:groupID/tasks/:taskID", null, "NoEntity" | "AccessDenied" | "UnrecognizedEntity", IRequestData, IURLParams>
	}

	namespace UpdateNote {
		interface IURLParams extends Record<string, string> {
			groupID: string
			noteID: string
		}

		interface IRequestData extends Record<string, string | number | undefined> {
			title: string
			content: string
		}

		type IEndpoint = Common.IBuildAPIEndpoint<"PUT", "/api/groups/:groupID/notes/:noteID", null, "NoEntity" | "AccessDenied" | "UnrecognizedEntity", IRequestData, IURLParams>
	}
}
