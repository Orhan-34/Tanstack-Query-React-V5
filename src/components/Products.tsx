import { Fragment, useState } from "react";
import { getProductQuery, getProductsQuery } from "../services/queries";
import type { Product } from "../types/product";

const Products = () => {
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null,
	);
	const productsQuery = getProductsQuery();
	const productQuery = getProductQuery(selectedProductId);

	return (
		<>
			{productsQuery.data?.pages.map((group, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<Fragment key={index}>
					{group.map((product: Product) => (
						<Fragment key={product.id}>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button onClick={() => setSelectedProductId(product.id)}>
								{product.name}
							</button>
							<br />
						</Fragment>
					))}
				</Fragment>
			))}
			<br />
			<div>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button
					onClick={() => productsQuery.fetchNextPage()}
					disabled={
						!productsQuery.hasNextPage || productsQuery.isFetchingNextPage
					}
				>
					{productsQuery.isFetchingNextPage
						? "Loading more..."
						: productsQuery.hasNextPage
							? "Load More"
							: "Nothing more to load"}
				</button>
			</div>
			<div>Selected product:</div>
			{JSON.stringify(productQuery.data)}
		</>
	);
};

export default Products;
