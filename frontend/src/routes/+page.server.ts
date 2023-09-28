import { ActionFailure, fail } from '@sveltejs/kit';
export const actions = {
	create: async ({ request }) => {
		// Get form data
        // const data = await request.formData();
        const formData = Object.fromEntries(await request.formData());
        // const file = data.get('fileToUpload') as File;
		console.log((formData.fileToUpload as File));
        
        
        try {
			// Send request to backend
            // await fetch('');
		} catch (error) {
			return fail(422, {
				description: "",
				error: error
			});
		}
	}
};