import { MouseEventHandler } from "react";
import classes from "./TaskPanel.module.css";

interface IProps {
	onClick?: MouseEventHandler
}

export default function TaskPanel({onClick}: IProps) {
	return (
		<li className={classes.EntityPanel} onClick={onClick}>
			<label className={classes.CheckBox}>
				<input type='checkbox' title="test"/>
				<span className={classes.Checkmark}></span>
			</label>
			<div className={classes.TaskBody}>
				<h3>Check with guidelines</h3>
				<h6>Assigned to Camila
					<span className='fa-solid fa-circle'></span>
					Yesterday
					<span className='fa-solid fa-circle'></span>
					Due 25/04/2024
				</h6>
			</div>
		</li>
	)
}
