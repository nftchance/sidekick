'use client'

import { useState } from 'react'

import { z } from 'zod'

import useConnector from '@/app/lib/hooks/useConnector'
import { COGS } from '@/connectors/lib/constants'
import { CogType } from '@/connectors/lib/types'

export default function ConnectorConfig({ type }: { type?: CogType }) {
	const [connectorType, setConnectorType] = useState(type || 'http')

	const { connector, useCog } = useConnector(connectorType)

	const { cog, isValid, isError, isLoading } = useCog({
		enabled: !!connectorType,
		connector,
		data: {
			url: 'https://example.com'
		}
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
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

			{connector && (
				<>
					{Object.keys(connector.cog.schema.shape).map(key => (
						<div key={key}>
							<label htmlFor={key}>{key}</label>
							<input
								type="text"
								name={key}
								id={key}
								className="text-black"
								defaultValue={'not working'}
							/>
						</div>
					))}

					<hr />

					<p>isValid: {isValid ? 'true' : 'false'}</p>
					<p>isError: {isError ? 'true' : 'false'}</p>
					<p>isLoading: {isLoading ? 'true' : 'false'}</p>
				</>
			)}

			<hr />

			<button type="submit">Submit</button>
		</form>
	)
}

