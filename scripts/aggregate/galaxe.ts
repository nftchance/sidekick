import bar from 'cli-progress'
import { createHash } from 'node:crypto'
import { mkdir } from 'node:fs'

const progressBar = new bar.SingleBar(
	{
		format:
			'Progress |' +
			'{bar}' +
			'| {percentage}% || {value}/{total} Chunks || Speed: {speed} Chunks/s || ETA: {eta}s || Duration: {duration}s',
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: false
	},
	bar.Presets.shades_classic
)

// ! CI will fail if the test cannot be run and TEST has not been set to false.
const TEST = process.env.TEST ? process.env.TEST : true

const SIZE = 100
const START = -1
const LOOK_AHEAD = true

const TIMESTAMP = new Date().toISOString().replace(/:/g, '-')

const FOLDER_NAME = `./.sidekick/${TIMESTAMP}`

enum ListType {
	Trending = 'Trending',
	Earliest = 'Earliest',
	Newest = 'Newest'
}

enum Status {
	None = 'null',
	NotStarted = `["NotStarted"]`,
	Active = `["Active"]`,
	Expired = `["Expired"]`
}

enum CredSource {
	None = 'null',
	TwitterSpace = '["TWITTER_SPACE"]',
	TwitterLike = '["TWITTER_LIKE"]',
	TwitterRT = '["TWITTER_RT"]',
	TwitterFollow = '["TWITTER_FOLLOW"]',
	TwitterFollowedBy = '["TWITTER_FOLLOWED_BY"]',
	TwitterQuote = '["TWITTER_QUOTE"]',
	DiscordAMA = '["DISCORD_AMA"]',
	DiscordMember = '["DISCORD_MEMBER"]',
	DiscordMessage = '["DISCORD_MESSAGE"]',
	JoinTelegram = '["JOIN_TELEGRAM"]',
	Quiz = '["QUIZ"]',
	SnapshotOrg = '["SNAPSHOT_ORG"]',
	GithubContributor = '["GITHUB_CONTRIBUTOR"]',
	Subgraph = '["SUBGRAPH"]',
	LensPostMirror = '["LENS_POST_MIRROR"]',
	LensPostUpvote = '["LENS_POST_UPVOTE"]',
	LensProfileFollow = '["LENS_PROFILE_FOLLOW"]'
}

enum RewardTypes {
	None = 'null',
	OAT = '["OAT"]',
	NFT = '["NFT"]',
	Custom = '["CUSTOM"]',
	Token = '["TOKEN"]',
	DiscordRole = '["DISCORDROLE"]',
	LoyaltyPoints = '["LOYALTYPOINTS"]',
	LoyaltyPointsMysteryBox = '["LOYALTYPOINTSMYSTERYBOX"]',
	MintList = '["MINTLIST"]'
}

enum Verified {
	None = 'null',
	No = '[0]',
	Yes = '[1]'
}

enum SpaceCategories {
	None = 'null',
	DeFi = '["DeFi"]',
	Dex = '["Dex"]',
	Staking = '["Staking"]',
	Bridge = '["Bridge"]',
	YieldFarming = '["YieldFarming"]',
	GameFi = '["GameFi"]',
	Launchpad = '["Launchpad"]',
	CeFi = '["CeFi"]',
	NFT = '["NFT"]',
	Collectibles = '["Collectibles"]',
	NFTMarketplace = '["NFT Marketplace"]',
	NFTFi = '["NFT-Fi"]',
	NFTData = '["NFT-Data"]',
	Web3 = '["Web3"]',
	DID = '["DID"]',
	Social = '["Social"]',
	DAO = '["DAO"]',
	PlayToEarn = '["Play-To-Earn"]',
	Metaverse = '["Metaverse"]',
	Infrastructure = '["Infrastructure"]',
	Wallet = '["Wallet"]',
	Privacy = '["Privacy"]',
	Storage = '["Storage"]',
	APIProvider = '["API Provider"]',
	Layer1 = '["Layer 1"]',
	Layer2 = '["Layer 2"]'
}

enum Chain {
	None = 'null',
	MATIC = '["MATIC"]',
	BSC = '["BSC"]',
	ETHEREUM = '["ETHEREUM"]',
	ZKSYNC_ERA = '["ZKSYNC_ERA"]',
	ARBITRUM = '["ARBITRUM"]',
	SEPOLIA = '["SEPOLIA"]',
	OPTIMISM = '["OPTIMISM"]',
	GOERLI = '["GOERLI"]',
	AVALANCHE = '["AVALANCHE"]',
	MOONBEAM = '["MOONBEAM"]',
	FANTOM = '["FANTOM"]',
	OKC = '["OKC"]',
	BOBA_BNB = '["BOBA_BNB"]',
	BOBA_MOONBEAM = '["BOBA_MOONBEAM"]',
	IOTEX = '["IOTEX"]',
	BOBA_ETH = '["BOBA_ETH"]',
	BOBA_AVAX = '["BOBA_AVAX"]',
	BASE = '["BASE"]',
	BSC_TESTNET = '["BSC_TESTNET"]',
	BASE_TESTNET = '["BASE_TESTNET"]',
	LINEA = '["LINEA"]',
	LINEA_TESTNET = '["LINEA_TESTNET"]',
	SCROLL_TESTNET = '["SCROLL_TESTNET"]',
	POLYGON_ZKEVM = '["POLYGON_ZKEVM"]',
	MODE_SEPOLIA = '["MODE_SEPOLIA"]',
	SCROLL_SEPOLIA = '["SCROLL_SEPOLIA"]',
	SOLANA = '["SOLANA"]',
	APTOS = '["APTOS"]',
	SEI = '["SEI"]',
	ATLANTIC2 = '["ATLANTIC2"]',
	INJECTIVE = '["INJECTIVE"]',
	FLOW = '["FLOW"]'
}

enum GasTypes {
	None = 'null',
	Gasless = '["Gasless"]'
}

async function getGalaxeBatch(
	STATUS = Status.None,
	LIST_TYPE = ListType.Trending,
	CRED_SOURCE = CredSource.None,
	REWARD_TYPES = RewardTypes.None,
	VERIFIED = Verified.None,
	SPACE_CATEGORIES = SpaceCategories.None,
	CHAIN = Chain.None,
	GAS_TYPE = GasTypes.None,
	AFTER = START,
	CHASE = false
) {
	const URL = 'https://graphigo.prd.galaxy.eco/query'

	const response = await fetch(URL, {
		method: 'POST',
		mode: 'cors',
		credentials: 'omit',
		referrerPolicy: 'no-referrer',
		headers: {
			accept: '*/*',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/json',
			'request-id': '847b0078-2daa-4c37-b155-0f55650917ca',
			'sec-ch-ua': '"Not)A;Brand";v="24", "Chromium";v="116"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'cross-site'
		},
		body: `{"operationName":"CampaignList","variables":{"input":{"listType":"${LIST_TYPE}","credSources":${CRED_SOURCE},"gasTypes":${GAS_TYPE},"types":null,"rewardTypes":${REWARD_TYPES},"chains":${CHAIN},"isVerified":${VERIFIED},"statuses":${STATUS},"spaceCategories":${SPACE_CATEGORIES},"backers":null,"first":${SIZE},"after":"${AFTER}","searchString":null,"claimableByUser":null},"address":""},"query":"query CampaignList($input: ListCampaignInput!, $address: String!) {\\n  campaigns(input: $input) {\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n      __typename\\n    }\\n    list {\\n      ...CampaignSnap\\n      isBookmarked(address: $address)\\n      id\\n      numberID\\n      name\\n      childrenCampaigns {\\n        id\\n        type\\n        rewardName\\n        rewardInfo {\\n          discordRole {\\n            guildId\\n            guildName\\n            roleId\\n            roleName\\n            inviteLink\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      info\\n      useCred\\n      formula\\n      thumbnail\\n      gasType\\n      createdAt\\n      requirementInfo\\n      description\\n      enableWhitelist\\n      chain\\n      startTime\\n      status\\n      requireEmail\\n      requireUsername\\n      distributionType\\n      endTime\\n      rewardName\\n      cap\\n      loyaltyPoints\\n      tokenRewardContract {\\n        id\\n        address\\n        chain\\n        __typename\\n      }\\n      tokenReward {\\n        userTokenAmount\\n        tokenAddress\\n        depositedTokenAmount\\n        tokenRewardId\\n        tokenDecimal\\n        tokenLogo\\n        tokenSymbol\\n        __typename\\n      }\\n      space {\\n        id\\n        name\\n        thumbnail\\n        alias\\n        isVerified\\n        __typename\\n      }\\n      rewardInfo {\\n        discordRole {\\n          guildId\\n          guildName\\n          roleId\\n          roleName\\n          inviteLink\\n          __typename\\n        }\\n        premint {\\n          startTime\\n          endTime\\n          chain\\n          price\\n          totalSupply\\n          contractAddress\\n          banner\\n          __typename\\n        }\\n        __typename\\n      }\\n      participants {\\n        participantsCount\\n        bountyWinnersCount\\n        __typename\\n      }\\n      recurringType\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment CampaignSnap on Campaign {\\n  id\\n  name\\n  ...CampaignMedia\\n  dao {\\n    ...DaoSnap\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment DaoSnap on DAO {\\n  id\\n  name\\n  logo\\n  alias\\n  isVerified\\n  __typename\\n}\\n\\nfragment CampaignMedia on Campaign {\\n  thumbnail\\n  rewardName\\n  type\\n  gamification {\\n    id\\n    type\\n    __typename\\n  }\\n  __typename\\n}\\n"}`
	})

	const json = await response.json()

	return json
}

function formatFilter(filter: string) {
	return filter
		.toLocaleLowerCase()
		.replaceAll('_', '-')
		.replaceAll('[', '')
		.replaceAll(']', '')
		.replaceAll(' ', '-')
		.replaceAll('null', 'none')
		.replaceAll('"', '')
}

async function save(
	status: Status,
	listType: ListType,
	credSource: CredSource,
	rewardType: RewardTypes,
	verified: Verified,
	spaceCategory: SpaceCategories,
	chain: Chain,
	gasType: GasTypes,
	index: number,
	value: unknown,
	folderName = FOLDER_NAME
) {
	const data = JSON.stringify(value, null, 4)

	const statusFolderTag = formatFilter(status)
	const listTypeFolderTag = formatFilter(listType)
	const credSourceFolderTag = formatFilter(credSource)
	const rewardTypeFolderTag = formatFilter(rewardType)
	const verifiedFolderTag = formatFilter(verified)
	const spaceCategoryFolderTag = formatFilter(spaceCategory)
	const chainFolderTag = formatFilter(chain)
	const gasTypeFolderTag = formatFilter(gasType)

	const statusFolderName = `${statusFolderTag}/${listTypeFolderTag}/${credSourceFolderTag}/${rewardTypeFolderTag}/${verifiedFolderTag}/${spaceCategoryFolderTag}/${chainFolderTag}/${gasTypeFolderTag}`

	const hash = createHash('sha256')

	hash.update(statusFolderName)

	const hexDigest = hash.digest('hex').toString()

	const hashedFolderName = `${folderName}/${hexDigest}`

	mkdir(hashedFolderName, { recursive: true }, err => {
		if (err) throw err
	})

	await Bun.write(Bun.file(`${hashedFolderName}/galaxe-${index}.json`), data)

	return data
}

async function test() {
	const response = await getGalaxeBatch(
		Status.None,
		ListType.Trending,
		CredSource.None,
		RewardTypes.None,
		Verified.None,
		SpaceCategories.None,
		Chain.None,
		GasTypes.None,
		START
	)

	save(
		Status.None,
		ListType.Trending,
		CredSource.None,
		RewardTypes.None,
		Verified.None,
		SpaceCategories.None,
		Chain.None,
		GasTypes.None,
		START,
		response
	)
}

async function run() {
	const combinations = Array.from(Object.values(Status)).flatMap(status =>
		Object.values(ListType).flatMap(listType =>
			Object.values(CredSource).flatMap(credSource =>
				Object.values(RewardTypes).flatMap(rewardType =>
					Object.values(Verified).flatMap(verified =>
						Object.values(SpaceCategories).flatMap(spaceCategory =>
							Object.values(Chain).flatMap(chain =>
								Object.values(GasTypes).map(gasType => ({
									status,
									listType,
									credSource,
									rewardType,
									verified,
									spaceCategory,
									chain,
									gasType
								}))
							)
						)
					)
				)
			)
		)
	)

	progressBar.start(combinations.length, 0)

	for (const {
		status,
		listType,
		credSource,
		rewardType,
		verified,
		spaceCategory,
		chain,
		gasType
	} of combinations) {
		let start = START
		let hasNext = true

		while (hasNext) {
			const response = await getGalaxeBatch(
				status,
				listType,
				credSource,
				rewardType,
				verified,
				spaceCategory,
				chain,
				gasType,
				start,
				LOOK_AHEAD
			)

			save(
				status,
				listType,
				credSource,
				rewardType,
				verified,
				spaceCategory,
				chain,
				gasType,
				start,
				response
			)

			start = response.data.campaigns.pageInfo.endCursor

			hasNext = response.data.campaigns.pageInfo.hasNextPage || false
		}

		progressBar.increment()
	}
}

async function main() {
	if (TEST) test()

	run()
}

main()
