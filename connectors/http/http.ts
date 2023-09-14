import { z } from 'zod'

import { Cog } from '../cog'

const httpSchema = z.object({
	url: z.string().default('https://example.com'),
	init: z
		.object({
			body: z.string(),
			cache: z
				.enum([
					'default',
					'no-cache',
					'reload',
					'force-cache',
					'only-if-cached'
				])
				.default('default'),
			credentials: z
				.enum(['omit', 'same-origin', 'include'])
				.default('omit'),
			headers: z.record(z.string()),
			integrity: z.string(),
			keepalive: z.boolean(),
			method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
			mode: z.enum(['cors', 'no-cors', 'same-origin']).default('cors'),
			redirect: z.enum(['follow', 'error', 'manual']).default('follow'),
			referrer: z.string(),
			referrerPolicy: z
				.enum([
					'no-referrer',
					'no-referrer-when-downgrade',
					'origin',
					'origin-when-cross-origin',
					'same-origin',
					'strict-origin',
					'strict-origin-when-cross-origin',
					'unsafe-url'
				])
				.default('no-referrer')
		})
		.partial()
})

export default class Http extends Cog<typeof httpSchema> {
	constructor() {
		super(httpSchema)
	}

	async get(): Promise<Response | void> {
		const latest = this.latest()

		const { valid, value } = latest

		if (!valid) throw new Error('Invalid build')

		if (!value) throw new Error('No value found')

		const { url, init } = value

		const response = await fetch(url, init)
			.then(response => response)
			.catch((error: Error) => console.error(error))

		return response
	}
}
