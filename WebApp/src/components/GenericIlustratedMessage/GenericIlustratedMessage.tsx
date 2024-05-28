import classes from "./GenericIlustratedMessage.module.css";

interface IProps {
	className?: string
	imgSrc: string
	imgAlt: string
	title: string
	subtitle?: string
}


export default function GenericIlustratedMessage({className, imgSrc, imgAlt, title, subtitle}: IProps) {
	return (
		<div className={`${classes.Message} ${className?className:""}`}>
			<img src={imgSrc} alt={imgAlt} />
			<h4>{title}</h4>
			{subtitle && <p>{subtitle}</p>}
		</div>
	)
}
