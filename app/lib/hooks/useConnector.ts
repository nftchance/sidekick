import { useMemo, useState } from 'react'

import { Connector } from '@/connectors/connector'
import { CogType } from '@/connectors/lib/types'

export default function useConnector(type: CogType) {
	const connector = useMemo(() => {
		if (!type) return null

		return new Connector<typeof type>(type)
	}, [type])

	const useCog = <T extends typeof type>({
		enabled,
		connector,
		data,
		onError,
		onSuccess
	}: {
		enabled: boolean
		connector: Connector<T> | null
		// TODO: Fix
		data: any
		onError?: (error: Error) => void
		onSuccess?: (data: any) => void
	}) => {
		const [isLoading, setIsLoading] = useState(false)
		const [isError, setIsError] = useState(false)

		const isValid = useMemo(() => {
			if (!connector) return false

			return connector.cog.schema.safeParse(data).success
		}, [connector, data])

		return {
			cog: connector ? connector.cog : null,
			isValid,
			isError,
			isLoading,
			onError,
			onSuccess
		}
	}

	return { connector, useCog }
}
