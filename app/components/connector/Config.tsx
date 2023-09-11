'use client'

import { useMemo, useState } from 'react'

import Connector from '@/connectors/connector'
import { CONNECTORS } from '@/connectors/lib/constants'
import { ConnectorType } from '@/connectors/lib/types'

export default function ConnectorConfig({ type }: { type?: ConnectorType }) {
	const [connectorType, setConnectorType] = useState(type || 'http')

	const [formData, setFormData] = useState()
	const [error, setError] = useState<string | null>(null)

	const connector = useMemo(() => {
		if (!connectorType) return null

		return new Connector(connectorType, [
			'https://jsonplaceholder.typicode.com/todos/1',
			{
				method: 'GET'
			}
		])
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
				onChange={e =>
					setConnectorType(e.target.value as ConnectorType)
				}
			>
				{Object.keys(CONNECTORS).map(key => (
					<option key={key} value={key} selected={key === type}>
						{key}
					</option>
				))}
			</select>

			<hr />

			<p>connectorType: {connectorType}</p>

			{connector &&
				Object.keys(connector.abstract.requiredFields).map(key => (
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
