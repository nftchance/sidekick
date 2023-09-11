type Config = [requiredFields: string[], optionalFields: string[]]

class Cog {
	config

	constructor(...config: Config) {
		this.config = config
	}

	async parse() {
		// TODO: Convert flattened data to JSON that matches the schema.
	}
}

export default class Http<T> extends Cog<T> {
	request

	constructor(...request: Parameters<typeof fetch>) {
		this.request = request
	}

	async get(): Promise<Response | void> {
		const response = await fetch(...this.request)
			.then(response => response)
			.catch((error: Error) => console.error(error))

		return response
	}
}
