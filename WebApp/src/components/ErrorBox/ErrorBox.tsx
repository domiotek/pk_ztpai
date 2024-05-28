import classes from "./ErrorBox.module.css";

interface IProps {
	className?: string
	children?: JSX.Element | JSX.Element[] | string
}

export default function ErrorBox({className, children}: IProps) {
	return (
		<p className={`${classes.ErrorBox} ${className?className:""}`}>{children}</p>
	)
}
