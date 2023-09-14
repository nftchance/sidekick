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

export async function getAllFiles(
	projectKey: string,
	folderPath: string,
	files: string[] = [],
	parentFolderPath: string | undefined = undefined
) {
	if (parentFolderPath === undefined) parentFolderPath = folderPath

	const contents = readdirSync(folderPath).filter(
		contentName => contentName !== `${projectKey}.json`
	)

	const hasFolders = contents.some(
		contentName => contentName.endsWith('.json') === false
	)

	if (hasFolders) {
		for (const contentName of contents) {
			const contentPath = `${folderPath}/${contentName}`
			const parentPath = `${parentFolderPath}/${contentName}`

			const isFolder = contentName.endsWith('.json') === false

			if (isFolder) {
				await getAllFiles(projectKey, contentPath, files, parentPath)
			} else {
				files.push(parentPath)
			}
		}
	} else {
		files.push(
			...contents.map(contentName => `${parentFolderPath}/${contentName}`)
		)
	}

	return files
}
