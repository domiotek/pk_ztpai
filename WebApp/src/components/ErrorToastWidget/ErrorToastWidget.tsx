import { useEffect, useState } from "react";
import classes from "./ErrorToastWidget.module.css";

interface IProps {
	message: string
	show: number | false
}

export default function ErrorToastWidget({message, show: showProp}: IProps) {
	const [show, setShow] = useState<boolean>(false);

	useEffect(()=>{
		setShow(typeof showProp =="number");
		if(showProp !== false) 
			setTimeout(()=>setShow(false),3000);

	}, [showProp]);

	return (
		<div className={`${classes.ErrorToast} ${show && classes.Shown}`} onClick={()=>setShow(false)}>
			<i className='fas fa-circle-exclamation'></i>
			<span>{message}</span>
		</div>
	)
}
