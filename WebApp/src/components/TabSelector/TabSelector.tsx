import classes from "./TabSelector.module.css";

type IProps<T> = {
	tabHeaders: T[]
	selectedTab: T
	tabSelector: (tab: T)=>void
}

export default function TabHeader<T extends string=string>({tabHeaders, selectedTab, tabSelector}: IProps<T>) {

	return (
		<div className={classes.Wrapper}>
			{
				tabHeaders.map(opt=>
					<div key={opt} className={`${classes.Option} ${opt==selectedTab?classes.Active:""}`} onClick={()=>tabSelector(opt)}>{opt}</div>
				)
			}
		</div>
	)
};
