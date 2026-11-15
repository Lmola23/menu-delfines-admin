import { fail, redirect } from "@sveltejs/kit";

import { API_URL } from "$lib/config";
import { valuesFromForm } from "$lib/forms";
import {
	deleteProduct,
	getProduct,
	listCategories,
	setAvailability,
	updateProduct,
} from "$lib/server/api";
import { errorFields, messageOf } from "$lib/server/errors";

export const load = async ({ params, url }) => {
	const [product, categories] = await Promise.all([
		getProduct(params.id),
		listCategories(),
	]);
	return {
		product,
		categories,
		apiUrl: API_URL,
		saved: url.searchParams.has("guardado"),
		created: url.searchParams.has("creado"),
		foto: url.searchParams.get("foto") ?? "",
		fotoError: url.searchParams.get("mensaje") ?? "",
	};
};

export const actions = {
	update: async ({ params, request }) => {
		const values = valuesFromForm(await request.formData());

		let product;
		try {
			product = await updateProduct(params.id, values);
		} catch (error) {
			return fail(400, { values, errors: errorFields(error) });
		}

		throw redirect(303, `/productos/${product.id}?guardado=1`);
	},

	toggle: async ({ params, request }) => {
		const form = await request.formData();
		const available = form.get("available") === "true";
		try {
			await setAvailability(params.id, available);
		} catch (error) {
			return fail(400, { message: messageOf(error) });
		}
		throw redirect(303, `/productos/${params.id}`);
	},

	delete: async ({ params }) => {
		try {
			await deleteProduct(params.id);
		} catch (error) {
			return fail(400, { message: messageOf(error) });
		}
		throw redirect(303, "/productos");
	},
};
