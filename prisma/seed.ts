import { PrismaClient } from '@prisma/client'

import { seedGalaxe } from './seed/fixture.galaxe'
import { seedRabbithole } from './seed/fixture.rabbithole'

const prisma = new PrismaClient()

async function main() {
	await seedRabbithole(prisma)
	await seedGalaxe(prisma)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
