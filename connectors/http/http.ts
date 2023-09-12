import { z } from 'zod'

import { Cog, Connector } from '../connector'

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

const schema = z.object({
	url: z.string(),
	init: initSchema.partial()
})

export default class Http<T extends z.infer<typeof schema>> extends Cog<T> {
	constructor() {
		super(schema)
	}

	async get(): Promise<Response | void> {
		const latest = this.latest()

		const response = await fetch(latest.url, latest.init)
			.then(response => response)
			.catch((error: Error) => console.error(error))

		return response
	}
}

// ! Should always have the infered fields from the schema.
const connector = new Connector<'http'>('http')

// * Here, the data would be updated with useState, form data, etc.
const cog = connector.cog.parse({
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	init: {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}
})

connector.cog.latest()
