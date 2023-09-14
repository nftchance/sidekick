export type Rabbithole_Quest = {
	id: string
	appLink: string
	iconOption: string
	imagePath: string
	name: string
	questEnd: string
	questStart: string
	description: string
	network: string
	receiptsMinted: number
	status: string
	createdAt: string
	contractAddress: string
	creatorAddress: string
	tasks: string[]
	allowlistEnabled: boolean
	isReceiptEnabled: boolean
}

export type Rabbithole_Reward = {
	amount: string
	totalAllocated: number
	type: string
	tokenSymbol: string
	token: string
	decimals: number
	network: string
	s3Link: string
	ethValue: string
	tokenContractAddress: string
}

export type Rabbithole_Task = {
	id: string
	name: string
	action: string
	network: string
	description: string
}

export type Rabbithole_Project = {
	id: string
	name: string
	description: string
	iconOption: string
	imagePath: string
}

export type Rabbithole_Campaign = {
	quest: Rabbithole_Quest
	reward: Rabbithole_Reward
	task: Rabbithole_Task
	project: Rabbithole_Project
}
