import classes from "./CheckBox.module.css";

interface IProps {
	label: string,
	name: string
}

export default function CheckBox({label, name}: IProps) {

	return (
		<label className={classes.CheckBox}>
			{label}
			<input type="checkbox" name={name} />
			<span className={classes.CheckMark}></span>
        </label>
	)
}
