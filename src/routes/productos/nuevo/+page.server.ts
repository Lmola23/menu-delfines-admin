import { API_URL } from "$lib/config";
import { listCategories } from "$lib/server/api";

export const load = async ({ url }) => {
	return {
		categories: await listCategories(),
		apiUrl: API_URL,
		error: url.searchParams.get("mensaje") ?? "",
	};
};
