import { fail, redirect } from "@sveltejs/kit";

import {
	deleteProduct,
	listCategories,
	listProducts,
	setAvailability,
} from "$lib/server/api";
import { messageOf } from "$lib/server/errors";
import { normalize } from "$lib/normalize";
import { priceValue } from "$lib/price";
import type { ProductSummary } from "$lib/types";

type Estado = "todos" | "disponibles" | "agotados";

function parseEstado(value: string | null): Estado {
	return value === "disponibles" || value === "agotados" ? value : "todos";
}

function parseQuery(value: FormDataEntryValue | string | null): string {
	return typeof value === "string" ? value.trim() : "";
}

function listUrl(estado: Estado, query: string): string {
	const params = new URLSearchParams();
	if (estado !== "todos") params.set("estado", estado);
	if (query) params.set("q", query);
	const search = params.toString();
	return search ? `/productos?${search}` : "/productos";
}

function redirectToList(estado: Estado, query: string): never {
	throw redirect(303, listUrl(estado, query));
}

/** Texto que indexa el buscador: nombre, descripción, slug y categoría. */
function searchable(
	name: string,
	description: string,
	slug: string,
	categoryLabel: string,
): string {
	return normalize(`${name} ${description} ${slug} ${categoryLabel}`);
}

export const load = async ({ url }) => {
	const [all, categories] = await Promise.all([
		listProducts(),
		listCategories(),
	]);

	const filter = parseEstado(url.searchParams.get("estado"));
	const query = parseQuery(url.searchParams.get("q"));
	const tokens = query ? normalize(query).split(" ").filter(Boolean) : [];
	const labels = new Map(categories.map((category) => [category.id, category.label]));

	const totals = {
		todos: all.length,
		disponibles: all.filter((product) => product.available).length,
		agotados: all.filter((product) => !product.available).length,
	};

	// La lista incluye todos los productos del filtro de stock, incluso cuando
	// hay búsqueda: así el script puede ampliar o cambiar la consulta sin recargar.
	// `matches` y `hidden` dejan el filtro ya aplicado para quien no usa JavaScript.
	const products: ProductSummary[] = all
		.filter((product) => {
			if (filter === "disponibles") return product.available;
			if (filter === "agotados") return !product.available;
			return true;
		})
		.map((product) => {
			const categoryLabel = labels.get(product.category) ?? product.category;
			const search = searchable(
				product.name,
				product.description,
				product.slug,
				categoryLabel,
			);

			return {
				id: product.id,
				slug: product.slug,
				name: product.name,
				category: product.category,
				categoryLabel,
				price: product.price,
				currency: product.currency,
				priceLabel: `${priceValue(product.price, product.detail)} ${product.currency}`,
				imagePreviewUrl: product.imagePreviewUrl ?? "",
				available: product.available,
				search,
				matches: tokens.every((token) => search.includes(token)),
			};
		});

	return { products, totals, filter, query };
};

export const actions = {
	toggle: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get("id"));
		const available = form.get("available") === "true";
		const estado = parseEstado(String(form.get("estado") ?? "todos"));
		const query = parseQuery(form.get("q"));

		if (!Number.isInteger(id) || id <= 0) {
			return fail(400, { message: "Producto inválido" });
		}

		try {
			await setAvailability(id, available);
		} catch (error) {
			return fail(400, { message: messageOf(error) });
		}

		redirectToList(estado, query);
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get("id"));
		const estado = parseEstado(String(form.get("estado") ?? "todos"));
		const query = parseQuery(form.get("q"));

		if (!Number.isInteger(id) || id <= 0) {
			return fail(400, { message: "Producto inválido" });
		}

		try {
			await deleteProduct(id);
		} catch (error) {
			return fail(400, { message: messageOf(error) });
		}

		redirectToList(estado, query);
	},
};
