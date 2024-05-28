import { SyncLoader } from "react-spinners";
import classes from "./LoadingPageWrapper.module.css";
import { useEffect, useState } from "react";


interface IProps {
	isLoading?: boolean
	children?: JSX.Element | JSX.Element[]
}

export default function LoadingPageWrapper({isLoading, children}: IProps) {
	const [isFading, setIsFading] = useState<boolean>(false);

	useEffect(()=>{
		if(!isLoading) {
			setIsFading(true);
			setTimeout(()=>setIsFading(false), 400);
		}else setIsFading(false);
	}, [isLoading])

	return (
		<div className={classes.Wrapper}>
			{children}
			<div className={`${classes.LoadingCover} ${isLoading?classes.Shown:""} ${isFading?classes.Intermediate:""}`}>
				<SyncLoader color="var(--primary-color)" className={classes.Loader} />
			</div>
		</div>
	)
}
