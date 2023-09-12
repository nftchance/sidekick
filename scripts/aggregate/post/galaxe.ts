import { readdirSync, unlinkSync } from 'node:fs'

const FOLDER_NAME = '.sidekick'

async function main() {
	const folders = readdirSync(FOLDER_NAME)
	const latest = folders.sort().pop()

	const files = readdirSync(`${FOLDER_NAME}/${latest}`)

	const sorted = files
		.filter(file => file.startsWith('galaxe-'))
		.sort((a, b) => {
			const aNum = parseInt(a.split('-')[1].split('.')[0])
			const bNum = parseInt(b.split('-')[1].split('.')[0])

			return aNum - bNum
		})

	const json = []

	for (const filePath of sorted) {
		const absoluteFilePath = `${FOLDER_NAME}/${latest}/${filePath}`

		const file = Bun.file(absoluteFilePath)

		const text = await file.text()

		const data = JSON.parse(text)

		json.push(data)
	}

	const data = json.reduce((acc, val) => {
		const campaigns = val.data.campaigns.list

		return [...acc, ...campaigns]
	}, [])

	await Bun.write(
		Bun.file(`${FOLDER_NAME}/${latest}/galaxe.json`),
		JSON.stringify(data, null, 4)
	)

	for (const filePath of sorted) {
		const absoluteFilePath = `${FOLDER_NAME}/${latest}/${filePath}`

		unlinkSync(absoluteFilePath)
	}

	console.log(
		`✔️ Wrote ${data.length} campaigns to ${FOLDER_NAME}/${latest}/galaxe.json`
	)
}

main()
