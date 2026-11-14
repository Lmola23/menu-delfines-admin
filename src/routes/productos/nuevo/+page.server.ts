import { fail, redirect } from "@sveltejs/kit";

import { valuesFromForm } from "$lib/forms";
import { createProduct, listCategories } from "$lib/server/api";
import { errorFields } from "$lib/server/errors";

export const load = async () => {
	return { categories: await listCategories() };
};

export const actions = {
	create: async ({ request }) => {
		const values = valuesFromForm(await request.formData());

		let product;
		try {
			product = await createProduct(values);
		} catch (error) {
			return fail(400, { values, errors: errorFields(error) });
		}

		throw redirect(303, `/productos/${product.id}?creado=1`);
	},
};
