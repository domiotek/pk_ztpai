import { Suspense, createContext, useCallback, useState } from "react";
import classes from "./App.module.css";
import { Link, Outlet} from "react-router-dom";
import AccountPopup from "./components/AccountPopup/AccountPopup";
import ModalContainer from "./components/ModalContainer/ModalContainer";
import { WebApp } from "./types/app";

export const AppContext = createContext<WebApp.IApplicationContext>({showModal: ()=>false, setModalContent: ()=>false});

export default function App() {
    const [showAccountPopup, setShowAccountPopup] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

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

    return (
        <div className={classes.PageWrapper}>
            <header>
                <Link to="/">
                <img src="/logo.png" alt="Logo" />
                </Link>
                <button type="button" className={classes.HeaderUserButton} title="User" onClick={profileClickHandler}>
                    <i className="fa-regular fa-user"></i>
                </button>
            </header>
            <main>
                <AppContext.Provider value={{
                    showModal: ()=>setShowModal(true),
                    setModalContent: modalContentSetter
                }}>
                    <Suspense fallback={<div />}>
                        <Outlet />
                    </Suspense>
                </AppContext.Provider>
               
            </main>
            <AccountPopup accountName='Andrew' show={showAccountPopup} onActionTaken={()=>setShowAccountPopup(false)}/>
            <ModalContainer show={showModal} onClose={()=>setShowModal(false)}>{modalContent}</ModalContainer>
        </div>
    );
}
