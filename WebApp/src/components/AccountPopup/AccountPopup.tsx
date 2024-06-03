import React, { useCallback, useContext } from 'react'
import classes from "./AccountPopup.module.css";
import { useNavigate } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { RESTAPI } from '../../types/api';
import { AppContext } from '../../App';
import { useQueryClient } from '@tanstack/react-query';

interface IProps {
	accountName: string
	groups: RESTAPI.UserData.IBasicGroupData[]
	show?: boolean
	onActionTaken?: ()=>void
}

export default React.memo(function AccountPopup({accountName, groups, show, onActionTaken}: IProps) {

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {activeGroup, setActiveGroup} = useContext(AppContext);

	const notify = useCallback(()=>onActionTaken&&onActionTaken(), [onActionTaken]);

	const switchGroupCallback = useCallback(function(this: number) {
		notify();
		setActiveGroup(this);
		queryClient.invalidateQueries({queryKey: ["GroupData", activeGroup]});
		queryClient.invalidateQueries({queryKey: ["Tasks", activeGroup]});
		queryClient.invalidateQueries({queryKey: ["Notes", activeGroup]});
		queryClient.invalidateQueries({queryKey: ["EventLog", activeGroup]});
	},[notify]);

  	return (
		<div className={`${classes.Wrapper} ${show && classes.Shown}`}>
			<div className={classes.DetailsSection}>
				<i className='far fa-user'></i>
				<div className={classes.DetailsContainer}>
					<h4>{accountName}</h4>
					<button className={classes.SignOutButton} type='button' onClick={()=>navigate("/logout")}>
						<i className='fas fa-right-from-bracket'></i>
						Sign out
					</button>
				</div>
			</div>
			<h4>Your groups</h4>
			{
				groups.length>0?
					<div className={classes.GroupList}>
						<SimpleBar style={{width: "100%"}}>
							<div className={classes.GroupListHost}>
								{
									groups.map(elem=>
										<a key={elem.id} className={activeGroup==elem.id?classes.Active:""} onClick={switchGroupCallback.bind(elem.id)}>{elem.name}</a>
									)
								}
							</div>
						</SimpleBar>
					</div>
				:
					<h6 className={classes.NoGroupsText}>You don't belong to any group yet.</h6>		
			}
			<button className={classes.AddNewGroupButton} type='button' onClick={()=>{notify(); navigate("/new")}}>
				<i className='fas fa-plus'></i>
				{groups.length > 0?"Add new":"Add your first group"}
			</button>
			
		</div>
	)
});
