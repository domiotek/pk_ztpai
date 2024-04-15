import React, { useCallback } from 'react'
import classes from "./AccountPopup.module.css";
import { Link, useNavigate } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

interface IProps {
	accountName: string
	show?: boolean
	onActionTaken?: ()=>void
}

export default React.memo(function AccountPopup({accountName, show, onActionTaken}: IProps) {

	const navigate = useNavigate();

	const notify = useCallback(()=>onActionTaken&&onActionTaken(),[onActionTaken]);

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
			<div className={classes.GroupList}>
				<SimpleBar style={{width: "100%"}}>
					<a onClick={()=>notify()}>Roommates</a>
					<a onClick={()=>notify()}>School project</a>
				</SimpleBar>
			</div>
			<button className={classes.AddNewGroupButton} type='button' onClick={()=>{notify(); navigate("/new")}}>
				<i className='fas fa-plus'></i>
				Add new
			</button>
		</div>
	)
});
