import { PrismaClient } from '@prisma/client'

import {
	getAggregate,
	getLatest,
	getLatestAggregate
} from '@/lib/functions/aggregate'
import { Galaxe_Campaign } from '@/lib/types/galaxe'

export async function seedGalaxe(client: PrismaClient) {
	const aggregate: Record<string, Galaxe_Campaign> =
		await getLatestAggregate<Galaxe_Campaign>('galaxe')

	for (const obj in Object.keys(aggregate)) {
		const {
			gamification,
			dao,
			space,
			tokenReward,
			rewardInfo,
			participants: campaignParticipant,
			...rest
		} = aggregate[obj]

		const { discordRole, premint, ...rewardInfoRest } = rewardInfo

		client.galaxe_Campaign.upsert({
			where: { id: rest.id },
			update: {},
			create: {
				...rest,
				gamification: {
					connectOrCreate: {
						where: { id: gamification.id },
						create: gamification
					}
				},
				dao: {
					connectOrCreate: {
						where: { id: dao.id },
						create: dao
					}
				},
				space: {
					connectOrCreate: {
						where: { id: space.id },
						create: space
					}
				},
				tokenReward: {
					connectOrCreate: {
						where: { id: rest.id },
						create: {
							...tokenReward,
							id: rest.id
						}
					}
				},
				rewardInfo: {
					connectOrCreate: {
						where: { id: rest.id },
						create: {
							...rewardInfoRest,
							id: rest.id,
							discordRole:
								discordRole !== null
									? {
											connectOrCreate: {
												where: { id: rest.id },
												create: {
													...discordRole,
													id: rest.id
												}
											}
									  }
									: undefined,
							premint:
								premint !== null
									? {
											connectOrCreate: {
												where: { id: rest.id },
												create: {
													...premint,
													id: rest.id
												}
											}
									  }
									: undefined
						}
					}
				},
				campaignParticipant: campaignParticipant && {
					connectOrCreate: {
						where: { id: rest.id },
						create: {
							...campaignParticipant,
							id: rest.id
						}
					}
				}
			}
		})
	}

	console.log('✔︎ Galaxe quests seeded')
}
