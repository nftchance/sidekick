import { z } from 'zod'

import { COGS } from './lib/constants'

export type CogType = keyof typeof COGS

export type CogConstructor = ConstructorParameters<(typeof COGS)[CogType]>

export abstract class Cog<T extends z.ZodTypeAny, TReturn> {
	schema
	builds

	constructor(_: T) {
		this.schema = _

		this.builds = [] as Array<
			| {
					valid: false
					value: undefined
			  }
			| {
					valid: true
					value: z.infer<T>
			  }
		>
	}

	parse(value: any) {
		const valid = this.schema.safeParse(value)

		const build = {
			valid: valid.success,
			value: valid ? this.schema.parse(value) : undefined
		}

		this.builds.push(build)

		return build
	}

	latest() {
		if (!this.builds.length) throw new Error('No builds found')

		return this.builds[this.builds.length - 1]
	}

	valid(build: (typeof Cog.prototype.builds)[0]) {
		if (!build) throw new Error('No build found')

		const { valid, value } = build

		if (!valid) throw new Error('No valid value found')

		return { valid, value }
	}

	value(index: number | undefined = undefined) {
		const build = index ? this.builds[index] : this.latest()

		return this.valid(build).value
	}

	abstract get(): TReturn
}
