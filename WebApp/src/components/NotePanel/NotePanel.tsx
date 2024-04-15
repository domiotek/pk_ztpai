import { MouseEventHandler } from "react";
import classes from "./NotePanel.module.css";

interface IProps {
	onClick?: MouseEventHandler
}

export default function NotePanel({onClick}: IProps) {


	return (
		<li className={classes.EntityPanel} onClick={onClick}>
			<div className={classes.NoteHeader}>
				<h3>Project outline</h3>
				<h6>2 days ago</h6>
			</div>
			<div className={classes.NoteContent}>
				<textarea readOnly title='Note' defaultValue={"This project is about something, I don't know it though. "}></textarea>
			</div>
		</li>
	)
}
