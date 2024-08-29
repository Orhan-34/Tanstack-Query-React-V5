import {
	keepPreviousData,
	useInfiniteQuery,
	useQueries,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	getProduct,
	getProducts,
	getProjects,
	getTodos,
	getTodosWithId,
} from "./api";
import type { Product } from "../types/product";

export function getTodosWithQuery() {
	return useQuery({
		queryKey: ["todos"],
		queryFn: getTodos,
		refetchOnWindowFocus: false,
	});
}

export function getTodosWithIdQuery(ids: (number | undefined)[] | undefined) {
	return useQueries({
		queries: (ids ?? []).map((id) => {
			return {
				queryKey: ["todos", { id }],
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				queryFn: () => getTodosWithId(id!),
			};
		}),
	});
}

export function getProjectsQuery(page: number) {
	return useQuery({
		queryKey: ["projects", { page }],
		queryFn: () => getProjects(page),
		placeholderData: keepPreviousData,
	});
}

export function getProductsQuery() {
	return useInfiniteQuery({
		queryKey: ["products"],
		queryFn: getProducts,
		initialPageParam: 0,
		getNextPageParam: (lastPage, __, lastPageParam) => {
			if (lastPage.length === 0) {
				return undefined;
			}
			return lastPageParam + 1;
		},
		getPreviousPageParam: (_, __, firstPageParam) => {
			if (firstPageParam <= 1) {
				return undefined;
			}
			return firstPageParam - 1;
		},
	});
}

export function getProductQuery(id: number | null) {
	const queryClient = useQueryClient();
	return useQuery({
		queryKey: ["product", { id }],
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		queryFn: () => getProduct(id!),
		enabled: !!id,
		placeholderData: () => {
			const cachedProducts = (
				queryClient.getQueryData(["products"]) as {
					pages: Product[] | undefined;
				}
			)?.pages?.flat(2);
			if (cachedProducts) {
				return cachedProducts.find((product) => product.id === id);
			}
		},
	});
}
