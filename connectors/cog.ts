import { z } from 'zod'

export class Cog<T extends z.ZodTypeAny> {
	schema
	builds

	constructor(_: T) {
		this.schema = _

		this.builds = [] as Array<{
			valid: boolean
			value?: z.infer<T>
		}>
	}

	parse(value: any) {
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
