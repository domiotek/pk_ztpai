import { useQuery } from "@tanstack/react-query";
import classes from "./EventBox.module.css";
import { RESTAPI } from "../../types/api";
import { useContext, useRef } from "react";
import { AppContext } from "../../App";
import { callAPI } from "../../modules/utils";
import { DateTime } from "luxon";

export default function EventBox() {
	const {activeGroup} = useContext(AppContext);

	const containerRef = useRef<HTMLDivElement>(null);

	const {data, isFetching} = useQuery<RESTAPI.Entities.IEventLogEntry[], RESTAPI.GetEventLog.IEndpoint["error"]>({
        queryKey: ["EventLog", activeGroup],
        queryFn: ()=>callAPI<RESTAPI.GetEventLog.IEndpoint>("GET","/api/groups/:groupID/events",null, {groupID: activeGroup?.toString() ?? ""}),
        retry: true,
		staleTime: 60000
    });

	const resolveEntry = (entry: RESTAPI.Entities.IEventLogEntry)=>{
		const result: {title: string, content: string | string[], icon: string} =  {
			title: "Something happened",
			content: "We are not sure what.",
			icon: "fa-circle"
		}

		switch(entry.content.scope) {
			case "task":
			case "note":
				switch(entry.content.type) {
					case "create":
						result.title = `${entry.originator.name} created a new ${entry.content.scope}`;
						result.content = [`Named "${entry.content.name}"`];
						result.icon = "fa-circle-plus";
						
						if(entry.content.scope=="task") {
							if(entry.content.dueDate)
								result.content.push(`Due date is ${DateTime.fromISO(entry.content.dueDate).toFormat("dd/LL/yyyy")}`);
							if(entry.content.assignedUser)
								result.content.push(`Assigned to ${entry.content.assignedUser.name}`);
						}	
					break;
					case "update":
						result.title = `${entry.originator.name} edited a ${entry.content.scope}`;
						result.content = [`Named "${entry.content.name}"`];
						result.icon = "fa-circle-dot";
						
						if(entry.content.scope=="task") {
							if(entry.content.dueDate)
								result.content.push(`Due date is ${DateTime.fromISO(entry.content.dueDate).toFormat("dd/LL/yyyy")}`);
							if(entry.content.assignedUser)
								result.content.push(`Assigned to ${entry.content.assignedUser.name}`);
						}
					break;
					case "delete":
						result.title = `${entry.originator.name} deleted a ${entry.content.scope}`;
						result.content = `Named "${entry.content.name}"`;
						result.icon = "fa-circle-minus";
					break;
				}
			break;
			case "group":
				result.icon = "fa-circle-dot";

				switch(entry.content.type) {
					case "rename":
						result.title = `${entry.originator.name} renamed a group`;
						result.content = `New name is "${entry.content.name}"`;
					break;
					case "regenInvite":
						result.title = `${entry.originator.name} generated a new invite code`;
						result.content = `Naw code is "${entry.content.code}".`;
				}
			break;
			case "member":
				result.icon = "fa-circle-minus";

				switch(entry.content.type) {
					case "join":
						result.title = `${entry.originator.name} joined the group`;
						result.content = "What a surprise!";
						result.icon = "fa-circle-plus";
					break;
					case "leave":
						result.title = `${entry.originator.name} left the group`;
						result.content = "Why? We don't know either.";
					break;
					case "kick":
						result.title = `${entry.content.targetUser.name} was kicked from the group`;
						result.content = `${entry.originator.name} kicked them out for some reason.`;
					break;
				}
			break;
		}

		return result;
	}

	const scrollLeft = ()=>{
		if(containerRef.current)
			containerRef.current.scrollLeft = containerRef.current.scrollLeft - 200;
	}

	const scrollRight = ()=>{
		if(containerRef.current)
			containerRef.current.scrollLeft = containerRef.current.scrollLeft + 200;
	}

	return (
		<section className={classes.RecentEvents}>
			<h5>Recent events</h5>
			<div className={classes.EventCardCarousel}>
				<button type="button" title="Scroll left" onClick={scrollLeft}>
					<i className="fa-solid fa-chevron-left" />
				</button>
				<div ref={containerRef}>
					{
						isFetching||!data?
							<div>
								Loading...
							</div>
						:
							data.map(entry=>{
								const resolvedEntry = resolveEntry(entry);

								return <div key={entry.originatedAt} className={classes.EventCard}>
											<div className={classes.EventCardHeader}>
												<i className={`fas ${resolvedEntry.icon}`} />
												<h6>{resolvedEntry.title}</h6>
											</div>
											<div className={classes.EventCardBody}>
												{
													Array.isArray(resolvedEntry.content)?
														resolvedEntry.content.map(line=>
															<h5 key={line}>{line}</h5>
														)
													:
													resolvedEntry.content
												}
											</div>
											<div className={classes.EventCardFooter}>
												<span>{DateTime.fromISO(entry.originatedAt).toRelative()}</span>
											</div>
										</div>
							})
					}
				</div>
				
				<button type="button" title="Scroll right" onClick={scrollRight}>
					<i className="fa-solid fa-chevron-right"></i>
				</button>
			</div>
		</section>
	)
}
