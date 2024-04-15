import React from 'react'
import classes from "./Footer.css"
import { WebApp } from '../../types/app';

interface IProps {
	//[TODO] Prepare loading screen when api call is in progress
	companyData: WebApp.IFooterCompanyData // | null
}

export default React.memo(function Footer({companyData}: IProps) {
	return (
		<footer className={classes.Container}>
			<div className={classes.DetailsWrapper}>
				<div className={classes.LogoSection}>
					<img src="/logo.png" alt="Logo" />
					<h4>{companyData.companyName}</h4>
					<h4>NIP: {companyData.nipNumber}</h4>
				</div>
				<div className={classes.DetailsSection}>
					<h3>Find Us</h3>
					<h5>{companyData.firstAddressLine}</h5>
					<h5>{companyData.secondAddressLine}</h5>
				</div>
				<div className={classes.DetailsSection}>
					<h3>Contact Us</h3>
					<h5><i className='fas fa-phone'></i> <a href={`tel:${companyData.phoneNumber}`}>{companyData.phoneNumber}</a></h5>
					<h5><i className='far fa-envelope'></i> <a href={`mailto:${companyData.email}`}>{companyData.email}</a></h5>
				</div>
			</div>
			<span className={classes.CopyrightDisclaimer}>&copy;2024 All rights reserved</span>
		</footer>
	)
});
