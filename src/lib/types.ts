export interface Category {
	id: string;
	label: string;
	position: number;
}

export interface Product {
	id: number;
	slug: string;
	name: string;
	category: string;
	price: number;
	currency: string;
	description: string;
	detail: string;
	ingredients: string[];
	available: boolean;
	imageId: string;
	imageUrl: string;
	/** Variante pequeña ya preparada por el API para el admin. */
	imagePreviewUrl?: string;
	/** Variante mínima para la lista. */
	imageThumbUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductInput {
	name: string;
	category: string;
	price: number;
	currency: string;
	description: string;
	detail: string;
	ingredients: string[];
	available: boolean;
}

export interface FormState {
	message?: string;
	success?: boolean;
	values?: ProductInput;
	errors?: Record<string, string>;
}

export interface CategoryFormState {
	message?: string;
	success?: boolean;
	values?: { id?: string; label?: string };
	errors?: Record<string, string>;
}

/** Datos mínimos que necesita la lista para no enviar la ficha completa al móvil. */
export interface ProductSummary {
	id: number;
	name: string;
	category: string;
	categoryLabel: string;
	price: number;
	currency: string;
	/** Precio simple o rango de raciones, ya formateado para la lista. */
	priceLabel: string;
	/** Variante mínima ya preparada por el API; vacía si no hay foto. */
	imageThumbUrl: string;
	available: boolean;
	/** Índice normalizado que usan el script del buscador y el filtro SSR. */
	search: string;
	/** Si el producto coincide con la búsqueda actual; se usa como fallback SSR. */
	matches: boolean;
}

export function productToValues(product: Product): ProductInput {
	return {
		name: product.name,
		category: product.category,
		price: product.price,
		currency: product.currency,
		description: product.description,
		detail: product.detail,
		ingredients: product.ingredients,
		available: product.available,
	};
}
