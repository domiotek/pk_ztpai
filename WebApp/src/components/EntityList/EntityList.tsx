
import { Link } from "react-router-dom";
import classes from "./EntityList.module.css";
import { RESTAPI } from "../../types/api";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { callAPI } from "../../modules/utils";
import { AppContext } from "../../App";
import GenericIlustratedMessage from "../GenericIlustratedMessage/GenericIlustratedMessage";
import { PuffLoader } from "react-spinners";



interface IBaseFetchEntityEndpoint extends RESTAPI.Common.IBaseAPIEndpoint {
	method: "GET"
	returnData: any[]
	requestData: null
	urlParams: {groupID: string}
}

interface IProps<T extends IBaseFetchEntityEndpoint> {
	header?: string
	viewAllLink?: string
	itemFactory: (data: T["returnData"])=>JSX.Element[]
	endpointURL: T["url"]
	noItemsImageUrl: string
	dataSetID: string
}

export default function EntityList<T extends IBaseFetchEntityEndpoint>({header, viewAllLink, dataSetID, endpointURL, itemFactory, noItemsImageUrl}: IProps<T>) {
	const {activeGroup} = useContext(AppContext);

	const { data: items, isFetching} = useQuery<T["returnData"], T["error"]>({
        queryKey: [dataSetID, activeGroup],
        queryFn: ()=>callAPI<T>("GET",endpointURL,null, {groupID: activeGroup?.toString() ?? ""}),
        retry: true,
		staleTime: 60000
    });

	return (
		<section className={classes.EntityList}>
			{
				header && 
				<h3>
					{header}
					{viewAllLink && items && items.length > 0 && <Link to={viewAllLink}>See all</Link>}
				</h3>
			}
			{
				items?

					items.length > 0?
						<ul>{itemFactory(items)}</ul>
					:
						<GenericIlustratedMessage
							className={classes.NoItemsMessage} 
							imgSrc={noItemsImageUrl}
							imgAlt="Empty set"
							title="Nothing here yet..."
						/>
				:
					isFetching?
						<div className={classes.LoadingView}>
							<PuffLoader color="var(--primary-color)"/>
						</div>
					:
						<GenericIlustratedMessage 
							className={classes.NoItemsMessage}
							imgSrc="/illustrations/generic_error.svg"
							imgAlt="Loading problem"
							title="Something went wrong"
						/>
							
			}
		</section>
	)
}
