import { MouseEventHandler } from "react";
import classes from "./NotePanel.module.css";
import { RESTAPI } from "../../types/api";
import { DateTime } from "luxon";

interface IProps {
	onClick?: MouseEventHandler
	data: RESTAPI.Entities.INote
}

export default function NotePanel({data, onClick}: IProps) {

	return (
		<li className={classes.EntityPanel} onClick={onClick}>
			<div className={classes.NoteHeader}>
				<h3>{data.title}</h3>
				<i className={`fas fa-edit ${classes.EditIcon}`} />
				<h6>{DateTime.fromISO(data.creationDate).toRelative()}</h6>
			</div>
			<div className={classes.NoteContent}>
				<textarea readOnly title='Note' defaultValue={data.content}></textarea>
			</div>
		</li>
	)
}
