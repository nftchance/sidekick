import { z } from 'zod'

import { COGS } from './lib/constants'
import { CogConstructor, CogType } from './lib/types'

export abstract class Cog<T> {
	schema
	builds: T[] = []

	constructor(schema: z.Schema) {
		this.schema = schema
	}

	parse(value: T) {
		const build = this.schema.parse(value) as T

		this.builds.push(build)

		return build
	}

	latest() {
		if (!this.builds.length) throw new Error('No builds found')

		return this.builds[this.builds.length - 1]
	}
}

export class Connector<T extends CogType> {
	cog

	constructor(cogType: T, ...options: CogConstructor) {
		this.cog = new COGS[cogType](...options)
	}

	async get() {
		return await this.cog
			.get()
			.then(response => response)
			.catch((error: Error) => console.error(error))
	}

	async save() {
		// TODO: Prisma write to the database using the parsed data on the schema.
	}
}
