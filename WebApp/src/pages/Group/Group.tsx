import classes from "./Group.module.css";

export default function Group() {
	return (
		<div className={classes.GroupPage}>
            <h2>Your group</h2>
			
            <h3>Group name</h3>
            <form className={classes.UpdateNameForm}>
                <input name="name" type="text" title="New group name" required minLength={2} maxLength={30} />
                <button>Update</button>
            </form>

            <h3>Members</h3>
            <section className={classes.UserList}>
				<div className={classes.UserPanel}>
					<div className={classes.UserImage}>
						<i className='fa-regular fa-user'></i>
					</div>
					<div className={classes.PanelBody}>
						<h3>You (organizer)</h3>
						<a className='Button'>Leave</a>
					</div>
				</div>

				<div className={classes.UserPanel}>
					<div className={classes.UserImage}>
						<i className='fa-regular fa-user'></i>
					</div>
					<div className={classes.PanelBody}>
						<h3>Camila</h3>
						<h6>camila@gmail.com</h6>
						<a className='Button'>Kick</a>
					</div>
				</div>
            </section>
            <section className={classes.JoinSection}>
                <h4>Want to add more people?</h4>
                <h6>Just send them this link</h6>
                <div className={classes.InviteLinkHolder}>
                    <h6>http://localhost:5147/invite?code=dssg451</h6>
                    <button className={classes.InviteCopyButton}type="button" title="Copy invitation code"><i className="fa-regular fa-copy"></i></button>
                </div>
                <h6 className={classes.RegenerateCodePrompt}>Want new one? <a href='/regenInvite'>Regenerate</a></h6>
            </section>
		</div>
	)
}
