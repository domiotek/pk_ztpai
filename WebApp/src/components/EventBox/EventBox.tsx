import classes from "./EventBox.module.css";

export default function EventBox() {
	return (
		<section className={classes.RecentEvents}>
			<h5>Recent events</h5>
			<div className={classes.EventCardCarousel}>
				<button type="button" title="Scroll left" data-direction="left">
					<i className="fa-solid fa-chevron-left" />
				</button>
				<div>
					<div className={classes.EventCard}>
						<div className={classes.EventCardHeader}>
							<i className="far fa-circle" />
							<h6>Andrew marked task as incomplete</h6>
						</div>
						<div className={classes.EventCardBody}>Check with guidelines</div>
						<div className={classes.EventCardFooter}>
							<span>Yesterday</span>
						</div>
					</div>
				</div>
				
				<button type="button" title="Scroll right" data-direction="right">
					<i className="fa-solid fa-chevron-right"></i>
				</button>
			</div>
		</section>
	)
}
