import { z } from 'zod'

// type CogBuild = {
// 	valid: boolean
// 	value?: Partial<z.ParseParams>
// }

export class Cog<T> {
	schema
	builds

	constructor(_: T) {
		this.schema = _

		this.builds = [] as Array<any>
	}

	parse<Tp extends z.ZodTypeAny>(value: any) {
		const valid = this.schema.safeParse(value)

		const build: {
			valid: boolean
			value?: Partial<z.ParseParams>
		} = {
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
}
