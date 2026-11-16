import type { ProductInput } from "$lib/types";

/** Convierte el FormData del formulario al JSON que espera la API. */
export function valuesFromForm(form: FormData): ProductInput {
	const text = (name: string) => String(form.get(name) ?? "").trim();
	const number = (name: string): number | null => {
		const raw = text(name);
		if (raw === "") return null;
		const value = Number(raw.replace(",", "."));
		return Number.isFinite(value) ? value : null;
	};

	return {
		name: text("name"),
		category: text("category"),
		price: number("price") ?? 0,
		currency: text("currency").toUpperCase() || "CUP",
		description: text("description"),
		detail: text("detail"),
		ingredients: text("ingredients")
			.split("\n")
			.map((item) => item.trim())
			.filter(Boolean),
		available: form.get("available") === "on",
	};
}
