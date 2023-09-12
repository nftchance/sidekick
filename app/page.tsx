import { CogType } from '@/connectors/lib/types'

import ConnectorConfig from './components/connector/Config'

export default async function Page({
	searchParams
}: {
	searchParams?: {
		type: CogType
	}
}) {
	// ! Using a base search parameter here to link to pre-seeded data.
	const type = searchParams?.type

	return (
		<main>
			<h4 className="font-light opacity-80">Admin Interface</h4>
			<h1 className="text-2xl font-bold">Transaction Validation</h1>

			<ConnectorConfig type={type} />
		</main>
	)
}
