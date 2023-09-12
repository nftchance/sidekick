import { COGS } from '../lib/constants'

export type CogType = keyof typeof COGS

export type CogConstructor = ConstructorParameters<(typeof COGS)[CogType]>
