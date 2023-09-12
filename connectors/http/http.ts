import { z } from 'zod'

import { Cog } from '@/app/components/connector/Config'

const initSchema = z.object({
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
	credentials: z.enum(['omit', 'same-origin', 'include']).default('omit'),
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

const HttpSchema = z.object({
	url: z.string().default('https://example.com'),
	init: initSchema.partial()
})

type HttpSchemaType = z.infer<typeof HttpSchema>

export default class Http<
	T extends typeof HttpSchema,
	P extends HttpSchemaType
> extends Cog<T> {
	constructor() {
		super(HttpSchema)
	}

	async get(): Promise<Response | void> {
		const latest = this.latest()

		if (!latest.valid) throw new Error('Invalid build')

		const response = await fetch(latest.value.url, latest.value.init)
			.then(response => response)
			.catch((error: Error) => console.error(error))

		return response
	}
}
