import { CONNECTORS } from './lib/constants'
import { ConnectorConstructor, ConnectorType } from './lib/types'

export default class Connector {
	abstract

	constructor(connectorType: ConnectorType, options: ConnectorConstructor) {
		if (!connectorType) throw new Error('Connector type not provided')

		this.abstract = new CONNECTORS[connectorType](...options)
	}

	async get() {
		return await this.abstract
			.get()
			.then(response => response)
			.catch((error: Error) => console.error(error))
	}

	async save() {
		// TODO: Prisma write to the database using the parsed data on the schema.
	}
}

const httpConnector = new Connector('http', [
	'https://jsonplaceholder.typicode.com/todos/1',
	{
		method: 'GET'
	}
])

httpConnector.get().then(response => console.log(response))
