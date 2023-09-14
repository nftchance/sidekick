import { readdirSync } from 'node:fs'

const FOLDER_NAME = '.sidekick'

export function getLatest(startsWith: string) {
	const folders = readdirSync('.sidekick')
	const latest = folders
		.filter(folder => folder.startsWith(startsWith))
		.sort()
		.pop()

	if (!latest) throw new Error('❌ Must download results before seeding.')

	return latest
}

export async function getAggregate<T>(latest: string, aggregate: string) {
	const file = Bun.file(`${FOLDER_NAME}/${latest}/${aggregate}`)
	const fileAggregate: Record<string, T> = await file.json()

	return fileAggregate
}

export async function getLatestAggregate<T>(startsWith: string) {
	return await getAggregate<T>(
		getLatest(`${startsWith}-`),
		`${startsWith}.json`
	)
}
