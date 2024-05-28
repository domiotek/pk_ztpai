import { Suspense, createContext, useCallback, useEffect, useState } from "react";
import classes from "./App.module.css";
import { Link, Outlet, useNavigate} from "react-router-dom";
import AccountPopup from "./components/AccountPopup/AccountPopup";
import ModalContainer from "./components/ModalContainer/ModalContainer";
import { WebApp } from "./types/app";
import { callAPI } from "./modules/utils";
import { RESTAPI } from "./types/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AppContext = createContext<WebApp.IApplicationContext>({showModal: ()=>false, setModalContent: ()=>false, userData: null, updatingUserData: false, activeGroup: null, setActiveGroup: ()=>{}});

export default function App() {
    const [showAccountPopup, setShowAccountPopup] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

    const [delayedReadyState, setDelayedReadyState] = useState<boolean>(false);
    const [activeGroup, setActiveGroup] = useState<number | null>(null);

    const {error, data, isSuccess, isFetching} = useQuery<RESTAPI.UserData.IResponseData, RESTAPI.UserData.IEndpoint["error"]>({
        queryKey: ["UserData"],
        queryFn: ()=>callAPI<RESTAPI.UserData.IEndpoint>("GET","/api/me"),
        retry: false
    });

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const profileClickHandler = useCallback(()=>{
        setShowAccountPopup(!showAccountPopup);
    },[showAccountPopup]);


    const modalContentSetter = useCallback((content: JSX.Element)=>{
        if(!showModal) {
            setModalContent(content);
            return true;
        }
        return false;
    },[showModal]);

    const resolveActiveGroup = useCallback(()=>{
        if(!data) return;

        if(data.groups.length==0) navigate("/new");
        else {
            let candidate: number | null = null;
            const storedID = localStorage.getItem("activeGroup");
            if(storedID) {
                const ID = parseInt(storedID);
                if(data.groups.filter(val=>val.id==ID).length>0)
                    candidate = ID;
            }

            if(candidate===null) {
                candidate=data.groups[0].id;
                localStorage.setItem("activeGroup", candidate.toString());
            }

            setActiveGroup(candidate);
        }
        setTimeout(()=>setDelayedReadyState(true), 400);
    },[data]);


    useEffect(()=>{
        if(error?.code=="Unauthorized") navigate("/login")
    },[error]);

    useEffect(()=>{
        if(!isFetching) resolveActiveGroup();
    }, [isFetching]);

    const updateActiveGroup = useCallback((ID: number | null)=>{
        setActiveGroup(ID);
        if(ID)
            localStorage.setItem("activeGroup",ID.toString());
        else {
            localStorage.removeItem("activeGroup");
            resolveActiveGroup();
        }

        queryClient.invalidateQueries({queryKey: ["GroupData"]});
    },[resolveActiveGroup]);

    return (
        <>
            <div className={classes.PageWrapper}>
                <header>
                    <Link to="/">
                    <img src="/logo.png" alt="Logo" />
                    </Link>
                    <button type="button" className={classes.HeaderUserButton} title="User" onClick={profileClickHandler}>
                        <i className="fa-regular fa-user"></i>
                    </button>
                </header>
                <AppContext.Provider value={{
                        showModal: ()=>setShowModal(true),
                        setModalContent: modalContentSetter,
                        userData: data ?? null,
                        updatingUserData: isFetching,
                        activeGroup,
                        setActiveGroup: updateActiveGroup
                    }}>
                    <main>
                        <Suspense fallback={<div />}>
                            <Outlet />
                        </Suspense>
                    </main>
                    <AccountPopup accountName={data?.name ?? ""} groups={data?.groups ?? []} show={showAccountPopup} onActionTaken={()=>setShowAccountPopup(false)}/>
                    <ModalContainer show={showModal} onClose={()=>setShowModal(false)}>{modalContent}</ModalContainer>
                </AppContext.Provider>
            </div>
            <div className={`${classes.SplashScreen} ${data?classes.Intermediate:""} ${delayedReadyState?classes.Hidden:""}`}>
                <img className={!error?classes.Animated:""} src="/logo.png" alt="App logo"/>

                {
                    error?
                        <>
                            <h3>Something went wrong</h3>
                            <h5>Try reloading the application.</h5>
                        </>
                    :
                        <h3>Hang on a second...</h3>
                }
            </div>
        </>
    );
}
