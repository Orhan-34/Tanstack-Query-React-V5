import { useState } from "react";
import { getProjectsQuery } from "../services/queries";

const Projects = () => {
	const [page, setPage] = useState(1);
	const { data, isPending, error, isError, isPlaceholderData, isFetching } =
		getProjectsQuery(page);
	return (
		<>
			{isPending ? (
				<div>Loading...</div>
			) : isError ? (
				<div>Error: {error.message}</div>
			) : (
				<div>
					{data.map((project) => (
						<p key={project.id}>{project.name}</p>
					))}
				</div>
			)}
			<span>Current page: {page}</span>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button onClick={() => setPage((old) => Math.max(old - 1, 0))}>
				Previous page
			</button>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() => {
					if (!isPlaceholderData) {
						setPage((old) => Math.max(old + 1));
					}
				}}
				disabled={isPlaceholderData}
			>
				Next page
			</button>
			{isFetching ? <span>Loading...</span> : null}
		</>
	);
};

export default Projects;
