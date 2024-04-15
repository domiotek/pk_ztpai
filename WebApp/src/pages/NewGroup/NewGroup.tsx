import classes from "./NewGroup.module.css";

export default function NewGroup() {
	return (
		<div className={classes.ContentWrapper}>
			<h2>Hello Andrew</h2>
			<h5 className={classes.Subtitle}>Want to explore something new?</h5>

			<div className={classes.PanelsWrapper}>
				<section className={classes.Panel}>
					<h3>Join existing group</h3>
					<form>
						<label htmlFor="joinCodeInput">Code</label>
						<input id="joinCodeInput" name="code" type="text" required />
						<button type="submit">Join</button>
					</form>
				</section>
				<h3 className={classes.PanelDivider}>Or</h3>
				<section className={classes.Panel}>
					<h3>Create new group</h3>
					<form>
						<label htmlFor="groupNameInput">Group name</label>
						<input id="groupNameInput" name="name" type="text" minLength={2} maxLength={30} required />
						<button type="submit">Create</button>
					</form>
				</section>
			</div>
		</div>
	)
}
