import { RESTAPI } from "./api"

export namespace WebApp {
    interface IApplicationContext {
        setModalContent: (content: JSX.Element)=>boolean
        showModal: ()=>void
        userData: RESTAPI.UserData.IResponseData | null
        updatingUserData: boolean
        activeGroup: number | null
        setActiveGroup: (ID: number | null)=>void
    }

    type TModalClosingListener = (()=>boolean) | null
    interface IModalContext {
        closeModal: ()=>void
        setAllowCoverClosing: (state: boolean)=>void
        setOnCoverCloseAttemptListener: (listener: TModalClosingListener)=>void
        setHostClassName: (className: string|null)=>void
        setRenderHost: (state: boolean)=>void
    }

    interface IFooterCompanyData {
        companyName: string
        nipNumber: string
        firstAddressLine: string
        secondAddressLine: string
        phoneNumber: string
        email: string
    }
}
