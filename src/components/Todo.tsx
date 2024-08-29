import { getTodosWithQuery, getTodosWithIdQuery } from "./../services/queries";
import {
	createTodoMutation,
	updateTodoMutation,
	deleteTodoMutation,
} from "./../services/mutation";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { Todo } from "../types/todo";

const Todos = () => {
	const TodosGetWithQuery = getTodosWithQuery();
	const TodosGetWithIdQuery = getTodosWithIdQuery(TodosGetWithQuery.data);

	const createTodoMutationHook = createTodoMutation();

	const updateTodoMutationHook = updateTodoMutation();

	const deleteTodoMutationHook = deleteTodoMutation();

	const { handleSubmit, register } = useForm<Todo>();

	const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
		createTodoMutationHook.mutate(data);
	};

	const handleUpdateTodoSubmit = (data: Todo | undefined) => {
		if (data) {
			updateTodoMutationHook.mutate({ ...data, checked: true });
		}
	};

	const handleDeleteTodoSubmit = (id: number | undefined) => {
		if (id) {
			deleteTodoMutationHook.mutate(id);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
				<h3>New ToDo</h3>
				<input placeholder="Title" {...register("title")} />
				<br />
				<input placeholder="Description" {...register("description")} />
				<br />
				<input
					onClick={handleSubmit(handleUpdateTodoSubmit)}
					type="submit"
					disabled={createTodoMutationHook.isPending}
					value={createTodoMutationHook.isPending ? "Creating..." : "Created"}
				/>
			</form>

			<ul>
				{TodosGetWithIdQuery.map(({ data }) => (
					<li key={data?.id}>
						<div>Id : {data?.id}</div>
						<span>
							<strong>Title: </strong>
							{data?.title} <br />
							<strong>Description: </strong>
							{data?.description} <br />
						</span>
						<div>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button
								onClick={() => handleUpdateTodoSubmit(data)}
								disabled={data?.checked}
							>
								{data?.checked ? "Done" : "Not Updated"}
							</button>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button onClick={() => handleDeleteTodoSubmit(data?.id)}>
								Delete
							</button>
						</div>
						<hr />
					</li>
				))}
			</ul>
		</>
	);
};

export default Todos;
