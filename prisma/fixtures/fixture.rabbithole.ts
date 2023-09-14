import { PrismaClient } from '@prisma/client'

import { getLatestAggregate } from '@/lib/functions/aggregate'
import { Rabbithole_Campaign } from '@/lib/types/rabbithole'

export async function seedRabbithole(client: PrismaClient) {
	const aggregate: Record<string, Rabbithole_Campaign> =
		await getLatestAggregate<Rabbithole_Campaign>('rabbithole')

	for (const obj in Object.keys(aggregate)) {
		const { quest, task, reward, project } = aggregate[obj]

		client.rabbithole_Quest.upsert({
			where: { id: quest.id },
			update: {},
			create: {
				...{
					...quest,
					tasks: undefined,
					reward: undefined,
					project: undefined
				},
				tasks: {
					connectOrCreate: [
						{
							where: { id: task.id },
							create: {
								id: task.id,
								name: task.name,
								action: task.action,
								network: task.network,
								description: task.description
							}
						}
					]
				},
				reward: {
					connectOrCreate: {
						where: { id: quest.id },
						create: {
							...reward,
							id: quest.id
						}
					}
				},
				project: {
					connectOrCreate: {
						where: { id: project.id },
						create: {
							id: project.id,
							name: project.name,
							description: project.description,
							iconOption: project.iconOption,
							imagePath: project.imagePath
						}
					}
				}
			}
		})
	}

	console.log('✔︎ Rabbithole quests seeded')
}
