export type Galaxe_Campaign = {
	id: string
	name: string
	thumbnail: string
	rewardName: string
	type: string
	isBookmarked: boolean
	numberID: number
	info: string
	useCred: boolean
	formula: string
	gasType: string
	requirementInfo: string
	description: string
	enableWhitelist: boolean
	chain: string
	startTime: number
	status: string
	requireEmail: boolean
	requireUsername: boolean
	distributionType: string
	endTime: number
	cap: number
	loyaltyPoints: number
	childrenCampaigns?: string
	tokenRewardContract?: string
	createdAt: Date
	recurringType: string
	gamification: Gamification
	dao: DAO
	space: Space
	tokenReward: TokenReward
	rewardInfo: RewardInfo
	participants?: CampaignParticipant
}

export type Gamification = {
	id: string
	type: string
	typename: string
	galaxe_campaigns: Galaxe_Campaign[]
}

export type DAO = {
	id: string
	name: string
	logo: string
	alias: string
	isVerified: boolean
	typename: string
}

export type TokenReward = {
	userTokenAmount: string
	tokenAddress: string
	depositedTokenAmount: string
	tokenRewardId: number
	tokenDecimal: string
	tokenLogo: string
	tokenSymbol: string
	typename: string
}

export type Space = {
	id: string
	name: string
	thumbnail: string
	alias: string
	isVerified: boolean
	typename: string
}

export type DiscordRole = {
	guildId: string
	guildName: string
	roleId: string
	roleName: string
	inviteLink: string
	typename: string
}

export type Premint = {
	startTime: number
	endTime: number
	chain: string
	price: number
	totalSupply: number
	contractAddress: string
	banner: string
	typename: string
}

export type RewardInfo = {
	discordRole: DiscordRole | null
	premint: Premint | null
	typename: string
}

export type CampaignParticipant = {
	participantsCount: number
	bountyWinnersCount: number
	typename: string
}
