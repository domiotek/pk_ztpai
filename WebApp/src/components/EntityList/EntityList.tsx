
import { Link } from "react-router-dom";
import classes from "./EntityList.module.css";

interface IProps {
	header?: string
	children?: JSX.Element[] | JSX.Element
	viewAllLink?: string
}

export default function EntityList({header, children, viewAllLink}: IProps) {

	if(children&&!Array.isArray(children)) children = [children];

	return (
		<section className={classes.EntityList}>
			{
				header && 
				<h3>
					{header}
					{viewAllLink && children && children.length > 0 && <Link to={viewAllLink}>See all</Link>}
				</h3>
			}
			{
				children && children.length > 0?
					<ul>{children}</ul>
				:
				<div className={classes.NoPanelsNotice}>
					<h5>No tasks defined yet</h5>
				</div>
			}
		</section>
	)
}
