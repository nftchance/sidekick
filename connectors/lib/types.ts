import { CONNECTORS } from '../lib/constants'

export type ConnectorType = keyof typeof CONNECTORS

export type ConnectorConstructor = ConstructorParameters<
	(typeof CONNECTORS)[ConnectorType]
>
