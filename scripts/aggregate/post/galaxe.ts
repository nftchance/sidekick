import { readdirSync, unlinkSync } from 'node:fs'

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

		data.push(
			...json.reduce((acc, val) => {
				const campaigns = val.data.campaigns.list

				return [...acc, ...campaigns]
			}, [])
		)
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
