
import { RESTAPI } from "../../types/api";
import classes from "./GroupMemberPanel.module.css";

interface IProps {
	data: RESTAPI.GroupData.IUserBasic
	renderOwner: boolean
	renderSelf: boolean
	onLeave: ()=>void
	onKick: (ID: number)=>void
}

export default function GroupMemberPanel({data, renderOwner, renderSelf, onLeave, onKick}: IProps) {
	return (
		<div className={classes.UserPanel}>
			<div className={classes.UserImage}>
				<i className='fa-regular fa-user'></i>
			</div>
			<div className={classes.PanelBody}>
				{
					renderSelf?
						<h3>You {renderOwner?"(organizer)":""}</h3>
					:
						<>
							<h3>{data.name}</h3>
							<h6>{data.email}</h6>
						</>
				}

				{
					renderSelf?
						<button type="button" onClick={onLeave}>Leave</button>
					:
						renderOwner?
							<button type="button" onClick={()=>onKick(data.id)}>Kick</button>
						:""
				}
			</div>
		</div>
	);
}
