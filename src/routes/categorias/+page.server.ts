import { fail } from "@sveltejs/kit";

import {
	createCategory,
	listCategories,
	reorderCategories,
	updateCategory,
} from "$lib/server/api";
import { errorFields, messageOf } from "$lib/server/errors";

function text(value: FormDataEntryValue | null): string {
	return typeof value === "string" ? value.trim() : "";
}

export const load = async () => {
	return { categories: await listCategories() };
};

export const actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const label = text(form.get("label"));

		if (!label) {
			return fail(400, {
				message: "El nombre es obligatorio.",
				values: { label },
			});
		}

		try {
			await createCategory(label);
		} catch (error) {
			return fail(400, {
				message: messageOf(error),
				values: { label },
				errors: errorFields(error),
			});
		}

		return { success: true, message: "Categoría creada." };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = text(form.get("id"));
		const label = text(form.get("label"));

		if (!id) {
			return fail(400, { message: "Categoría inválida." });
		}
		if (!label) {
			return fail(400, {
				message: "El nombre es obligatorio.",
				values: { id, label },
			});
		}

		try {
			await updateCategory(id, label);
		} catch (error) {
			return fail(400, {
				message: messageOf(error),
				values: { id, label },
				errors: errorFields(error),
			});
		}

		return { success: true, message: "Categoría actualizada." };
	},

	reorder: async ({ request }) => {
		const form = await request.formData();
		const ids = text(form.get("order"))
			.split(",")
			.map((id) => id.trim())
			.filter(Boolean);

		if (ids.length === 0) {
			return fail(400, { message: "El orden está vacío." });
		}

		try {
			await reorderCategories(ids);
		} catch (error) {
			return fail(400, { message: messageOf(error) });
		}

		return { success: true };
	},
};
