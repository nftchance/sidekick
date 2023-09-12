import { z } from 'zod'

import { COGS } from './lib/constants'
import { CogConstructor, CogType } from './lib/types'

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
