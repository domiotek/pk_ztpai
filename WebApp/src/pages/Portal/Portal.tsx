import { Suspense, createContext, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import classes from "./Portal.module.css";
import { OutsideContextNotifier } from '../../modules/utils';

interface IPortalContext {
    showLogo: (state: boolean)=>void
}

export const PortalContext = createContext<IPortalContext>({showLogo: OutsideContextNotifier});

export default function Portal() {
    const [showLogo, setShowLogo] = useState<boolean>(true);

    const location = useLocation();

    useLayoutEffect(()=>{
        setShowLogo(true);
    },[location.pathname]);

    return (
        <div className={classes.ContentWrapper}>
            {showLogo && <img src="/logo.png" alt="Logo" />}
            <PortalContext.Provider value={{
                showLogo: setShowLogo
            }}>
                <Suspense fallback={<div />}>
                    <Outlet />
                </Suspense>
            </PortalContext.Provider>
        </div>
    )
}
