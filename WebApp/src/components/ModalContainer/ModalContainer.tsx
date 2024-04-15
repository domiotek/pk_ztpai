import { MouseEvent, createContext, useCallback, useState } from 'react'
import SimpleBar from "simplebar-react";
import classes from "./ModalContainer.module.css";
import { WebApp } from '../../types/app';
import { OutsideContextNotifier as  ctxNotify } from '../../modules/utils';
import useBodyScrollBlocker from '../../hooks/useBodyScrollBlocker';

interface IProps {
	show?: boolean
	onClose: ()=>void
	children?: JSX.Element | null
}

export const ModalContext = createContext<WebApp.IModalContext>({
								closeModal: ctxNotify,
								setAllowCoverClosing: ctxNotify,
								setOnCoverCloseAttemptListener: ctxNotify,
								setHostClassName: ctxNotify,
								setRenderHost: ctxNotify
							});

export default function ModalContainer({show, onClose, children}: IProps) {
	const [allowCoverExit, setAllowCoverExit] = useState<boolean>(true);
	const [closingNotifier, setClosingNotifier] = useState<WebApp.TModalClosingListener>(null);
	const [closingSoon, setClosingSoon] = useState<boolean>(false);
	const [hostClassName, setHostClassName] = useState<string | null>(null);
	const [renderHost, setRenderHost] = useState<boolean>(true);

	const [block, unblock] = useBodyScrollBlocker();

	if(show) block();
	else unblock();

	const handleClosing = useCallback(()=>{
		setClosingSoon(true);
		setTimeout(()=>{
			setClosingSoon(false);
			onClose();
		},400);

	}, [onClose]);

	const coverClickCallback = useCallback((e: MouseEvent)=>{

		//Process only events that target 'cover' element.
		if((e.target as HTMLElement).classList.contains(classes.Container)) {
			if(allowCoverExit) {

				if(!closingNotifier || closingNotifier())
					handleClosing();
			}
		}

	},[allowCoverExit, closingNotifier]);

	return (
		<div className={`${classes.Container} ${show&&children?classes.Shown:""} ${show&&closingSoon?classes.Intermediate:""}`} onClick={coverClickCallback}>
			<div className={`${classes.Wrapper} ${hostClassName?hostClassName:""}`}>
				<div className={`${classes.Host} ${renderHost?classes.Rendered:""} ${closingSoon?classes.Intermediate:""}`}>
					<SimpleBar style={{width: "100%"}}>
						<ModalContext.Provider value={
							{
								closeModal: handleClosing,
								setOnCoverCloseAttemptListener: l=>setClosingNotifier(()=>l),
								setAllowCoverClosing: setAllowCoverExit,
								setHostClassName,
								setRenderHost
							}}>
								{children}
						</ModalContext.Provider>
					</SimpleBar>
				</div>
			</div>

		</div>
	)
}
