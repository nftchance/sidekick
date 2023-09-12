'use client'

import { useMemo, useState } from 'react'

import { Connector } from '@/connectors/connector'
import { COGS } from '@/connectors/lib/constants'
import { CogType } from '@/connectors/lib/types'

export default function ConnectorConfig({ type }: { type?: CogType }) {
	const [connectorType, setConnectorType] = useState(type || 'http')

	const [error, setError] = useState<string | null>(null)

	const connector = useMemo(() => {
		if (!connectorType) return null

		return new Connector(connectorType, {
			url: 'https://jsonplaceholder.typicode.com/todos/1',
			init: {
				method: 'GET'
			}
		})
	}, [connectorType])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		connector
			?.save()
			.then(() => setError(null))
			.catch(err => setError(err.message))
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="connector">Connector</label>
			<select
				name="connector"
				id="connector"
				className="text-black"
				onChange={e => setConnectorType(e.target.value as CogType)}
			>
				{Object.keys(COGS).map(key => (
					<option key={key} value={key} selected={key === type}>
						{key}
					</option>
				))}
			</select>

			<hr />

			<p>connectorType: {connectorType}</p>

			{connector &&
				Object.keys(connector.abstract).map(key => (
					<div key={key}>
						<label htmlFor={key}>{key}</label>
						<input type="text" name={key} id={key} />
					</div>
				))}

			<hr />

			<button type="submit">Submit</button>
		</form>
	)
}
