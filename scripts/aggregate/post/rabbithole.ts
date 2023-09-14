import { readdirSync } from 'node:fs'
import 'node:worker_threads'

const FOLDER_NAME = '.sidekick'

async function main() {
	const folders = readdirSync(FOLDER_NAME)
	const latest = folders
		.filter(folder => folder.startsWith('rabbithole-'))
		.sort()
		.pop()

	if (!latest) {
		console.log('No data found')
		return
	}

	const files = readdirSync(`${FOLDER_NAME}/${latest}`)

	const sorted = files
		.filter(file => file.startsWith('quests-'))
		.sort((a, b) => {
			const aNum = parseInt(a.split('-')[1].split('.')[0])
			const bNum = parseInt(b.split('-')[1].split('.')[0])

			return aNum - bNum
		})

	const json: Record<string, unknown> = {}

	for (const filePath of sorted) {
		const absoluteFilePath = `${FOLDER_NAME}/${latest}/${filePath}`

		const file = Bun.file(absoluteFilePath)

		const text = await file.text()

		const data = JSON.parse(text)

		for (const quest of data) {
			json[quest.quest.id] = {
				...quest,
				task: {
					...quest.task,
					network: `${
						Array.isArray(quest.task.network)
							? quest.task.network.join(',')
							: quest.task.network
					}`
				}
			}
		}
	}

	await Bun.write(
		Bun.file(`${FOLDER_NAME}/${latest}/rabbithole.json`),
		JSON.stringify(json, null, 4)
	)

	console.log(
		`✔️ Wrote ${
			Object.keys(json).length
		} campaigns to ${FOLDER_NAME}/${latest}/rabbithole.json`
	)
}

main()
