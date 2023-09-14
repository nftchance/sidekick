import { mkdir } from 'node:fs'

const PAGE = 1

const TIMESTAMP = new Date().toISOString().replace(/:/g, '-')

const PROJECT_KEY = 'rabbithole'
const FOLDER_NAME = `./.sidekick/${PROJECT_KEY}-${TIMESTAMP}`

async function getRabbitholeBatch(page = PAGE) {
	const URL = `https://api.rabbithole.gg/v1/terminal-quest/quests?pageSize=50&searchQuery=&status=&sortBy=quest_start&sortOrder=DESC&pageNumber=${page}`

	const response = await fetch(URL, {
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json;charset=utf-8'
		}
	})

	const json = await response.json()

	return json
}

async function save(page: number, quests: unknown) {
	mkdir(FOLDER_NAME, { recursive: true }, err => {
		if (err) throw err
	})

	await Bun.write(
		Bun.file(`${FOLDER_NAME}/quests-${page}.json`),
		JSON.stringify(quests, null, 4)
	)

	return quests
}

async function run() {
	let page = PAGE
	let hasNext = true

	while (hasNext) {
		const quests = await getRabbitholeBatch(page)

		if (quests.length === 0) {
			hasNext = false
			continue
		}

		await save(page, quests)

		page++
	}
}

async function main() {
	await run()
}

main()
