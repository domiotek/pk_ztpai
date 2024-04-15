import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import classes from "./Portal.module.css";

export default function Portal() {

    return (
        <div className={classes.ContentWrapper}>
            <img src="/logo.png" alt="Logo" />
            <Suspense fallback={<div />}>
                <Outlet />
            </Suspense>
        </div>
    )
}
