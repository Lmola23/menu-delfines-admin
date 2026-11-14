import { API_URL } from "$lib/config";
import type { Category, Product, ProductInput } from "$lib/types";

export class ApiError extends Error {
	status: number;
	fields?: Record<string, string>;

	constructor(message: string, status: number, fields?: Record<string, string>) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.fields = fields;
	}
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...init,
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			...(init.headers ?? {}),
		},
		signal: AbortSignal.timeout(8000),
	});

	if (!response.ok) {
		let message = `La API respondió ${response.status}`;
		let fields: Record<string, string> | undefined;
		try {
			const body = (await response.json()) as {
				error?: { message?: string; fields?: Record<string, string> };
			};
			message = body.error?.message ?? message;
			fields = body.error?.fields;
		} catch {
			// La respuesta no era JSON; se conserva el mensaje genérico.
		}
		throw new ApiError(message, response.status, fields);
	}

	if (response.status === 204) return undefined as T;
	return (await response.json()) as T;
}

export function listProducts(): Promise<Product[]> {
	return request<Product[]>("/api/products?available=all");
}

const CATEGORY_LABEL_FIXES: Record<string, { from: string; to: string }> = {
	botellas: { from: "Botellas", to: "Tragos" },
};

export async function listCategories(): Promise<Category[]> {
	const categories = await request<Category[]>("/api/categories");
	// La categoría vende tragos, no botellas. El id se conserva para no romper
	// los productos; cuando la API tenga la migración, el valor ya viene bien.
	return categories.map((category) => {
		const fix = CATEGORY_LABEL_FIXES[category.id];
		return fix && category.label === fix.from
			? { ...category, label: fix.to }
			: category;
	});
}

export function getProduct(id: number | string): Promise<Product> {
	return request<Product>(`/api/products/${id}`);
}

export function createProduct(input: ProductInput): Promise<Product> {
	return request<Product>("/api/products", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export function updateProduct(
	id: number | string,
	input: ProductInput,
): Promise<Product> {
	return request<Product>(`/api/products/${id}`, {
		method: "PUT",
		body: JSON.stringify(input),
	});
}

export function deleteProduct(id: number | string): Promise<void> {
	return request<void>(`/api/products/${id}`, { method: "DELETE" });
}

export function setAvailability(
	id: number | string,
	available: boolean,
): Promise<Product> {
	return request<Product>(`/api/products/${id}/availability`, {
		method: "PATCH",
		body: JSON.stringify({ available }),
	});
}
