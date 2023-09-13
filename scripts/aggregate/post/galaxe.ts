import { readdirSync } from 'node:fs'
import {  } from 'node:worker_threads'

const FOLDER_NAME = '.sidekick'

async function main() {
	const folders = readdirSync(FOLDER_NAME)
	const latest = folders.sort().pop()

	const hashedFolders = readdirSync(`${FOLDER_NAME}/${latest}`).filter(
		folder => folder.endsWith('.json') === false
	)

	const data = []

	for (const folder of hashedFolders) {
		const folderPath = `${FOLDER_NAME}/${latest}/${folder}`

		const files = readdirSync(folderPath)

		const sorted = files
			.filter(file => file.startsWith('galaxe-'))
			.sort((a, b) => {
				const aNum = parseInt(a.split('-')[1].split('.')[0])
				const bNum = parseInt(b.split('-')[1].split('.')[0])

				return aNum - bNum
			})

		const json = []

		for (const filePath of sorted) {
			const absoluteFilePath = `${folderPath}/${filePath}`

			const file = Bun.file(absoluteFilePath)

			const text = await file.text()

			const data = JSON.parse(text)

			json.push(data)
		}

		const deduped = json.reduce((acc, val) => {
			if (!val.data.campaigns) return acc

			const campaigns = val.data.campaigns.list

			if (!campaigns) return acc

			return [...acc, ...campaigns]
		}, [])

		if (!deduped.length) continue

		data.push(...deduped)
	}

	const dedupedData = data.reduce((acc, val) => {
		const { id, ...rest } = val

		return {
			...acc,
			[id]: {
				...rest
			}
		}
	}, {})

	await Bun.write(
		Bun.file(`${FOLDER_NAME}/${latest}/galaxe.json`),
		JSON.stringify(dedupedData, null, 4)
	)

	console.log(
		`✔️ Wrote ${
			Object.keys(dedupedData).length
		} campaigns to ${FOLDER_NAME}/${latest}/galaxe.json`
	)
}

main()
