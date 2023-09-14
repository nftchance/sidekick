import { appendFileSync, readdirSync } from 'node:fs'

import { getAllFiles } from '@/lib/functions/aggregate'

const FOLDER_NAME = '.sidekick'
const PROJECT_KEY = 'galaxe'

async function main() {
	const folders = readdirSync(FOLDER_NAME)
	const latest = folders
		.filter(folder => folder.startsWith(PROJECT_KEY))
		.sort()
		.pop()
	const aggregatePath = `${FOLDER_NAME}/${latest}`
	const aggregate = await getAllFiles(PROJECT_KEY, aggregatePath)

	await Bun.write(Bun.file(`${aggregatePath}/galaxe.json`), '{')

	const ids = new Set()

	for (const filePath of aggregate) {
		const file = Bun.file(filePath)

		const text = await file.text()

		const { data } = JSON.parse(text)

		if (!data.campaigns) continue

		const campaigns: [] = data.campaigns.list

		if (campaigns.length === 0) continue

		const campaignsDict = campaigns.reduce((acc, val: any) => {
			if (ids.has(val.id)) return acc

			ids.add(val.id)

			return {
				...acc,
				[val.id]: val
			}
		}, {})

		if (Object.keys(campaignsDict).length === 0) continue

		// ! Slice to remove extra curly braces
		const string = JSON.stringify(campaignsDict, null, 4).slice(1, -1)

		appendFileSync(`${aggregatePath}/${PROJECT_KEY}.json`, `${string},\n`)
	}

	appendFileSync(`${aggregatePath}/${PROJECT_KEY}.json`, '}')

	console.log(
		`✔️ Wrote ${ids.size} campaigns to ${FOLDER_NAME}/${latest}/${PROJECT_KEY}.json`
	)
}

main()
