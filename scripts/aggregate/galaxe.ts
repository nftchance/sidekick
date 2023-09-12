import { mkdir } from 'fs'

// ! CI will fail if the test cannot be run and TEST has not been set to false.
const TEST = process.env.TEST ? process.env.TEST : true

const SIZE = 100
const START = -1
const LOOK_AHEAD = true

const TIMESTAMP = new Date().toISOString().replace(/:/g, '-')

const FOLDER_NAME = `./.sidekick/${TIMESTAMP}`

let cache:
	| {
			start: number
			hasNext: boolean
	  }
	| undefined = undefined

async function getGalaxeBatch(AFTER = START, CHASE = false) {
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
		body: `{"operationName":"CampaignList","variables":{"input":{"listType":"Trending","credSources":null,"gasTypes":null,"types":null,"rewardTypes":null,"chains":null,"isVerified":null,"statuses":null,"spaceCategories":null,"backers":null,"first":${SIZE},"after":"${AFTER}","searchString":null,"claimableByUser":null},"address":""},"query":"query CampaignList($input: ListCampaignInput!, $address: String!) {\\n  campaigns(input: $input) {\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n      __typename\\n    }\\n    list {\\n      ...CampaignSnap\\n      isBookmarked(address: $address)\\n      id\\n      numberID\\n      name\\n      childrenCampaigns {\\n        id\\n        type\\n        rewardName\\n        rewardInfo {\\n          discordRole {\\n            guildId\\n            guildName\\n            roleId\\n            roleName\\n            inviteLink\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      info\\n      useCred\\n      formula\\n      thumbnail\\n      gasType\\n      createdAt\\n      requirementInfo\\n      description\\n      enableWhitelist\\n      chain\\n      startTime\\n      status\\n      requireEmail\\n      requireUsername\\n      distributionType\\n      endTime\\n      rewardName\\n      cap\\n      loyaltyPoints\\n      tokenRewardContract {\\n        id\\n        address\\n        chain\\n        __typename\\n      }\\n      tokenReward {\\n        userTokenAmount\\n        tokenAddress\\n        depositedTokenAmount\\n        tokenRewardId\\n        tokenDecimal\\n        tokenLogo\\n        tokenSymbol\\n        __typename\\n      }\\n      space {\\n        id\\n        name\\n        thumbnail\\n        alias\\n        isVerified\\n        __typename\\n      }\\n      rewardInfo {\\n        discordRole {\\n          guildId\\n          guildName\\n          roleId\\n          roleName\\n          inviteLink\\n          __typename\\n        }\\n        premint {\\n          startTime\\n          endTime\\n          chain\\n          price\\n          totalSupply\\n          contractAddress\\n          banner\\n          __typename\\n        }\\n        __typename\\n      }\\n      participants {\\n        participantsCount\\n        bountyWinnersCount\\n        __typename\\n      }\\n      recurringType\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment CampaignSnap on Campaign {\\n  id\\n  name\\n  ...CampaignMedia\\n  dao {\\n    ...DaoSnap\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment DaoSnap on DAO {\\n  id\\n  name\\n  logo\\n  alias\\n  isVerified\\n  __typename\\n}\\n\\nfragment CampaignMedia on Campaign {\\n  thumbnail\\n  rewardName\\n  type\\n  gamification {\\n    id\\n    type\\n    __typename\\n  }\\n  __typename\\n}\\n"}`
	})

	const json = await response.json()

	return json
}

function recover(response: any) {
	if ('errors' in response) throw new Error('Error in test Galaxe query.')

	const start = response.data.campaigns.pageInfo.endCursor

	const hasNext = response.data.campaigns.pageInfo.hasNextPage

	return { start, hasNext }
}

async function save(index: number, value: unknown, folderName = FOLDER_NAME) {
	const data = JSON.stringify(value, null, 4)

	mkdir(folderName, { recursive: true }, err => {
		if (err) throw err
	})

	await Bun.write(Bun.file(`${folderName}/galaxe-${index}.json`), data)

	return data
}

async function test() {
	const response = await getGalaxeBatch(START)

	save(START, response)

	cache = recover(response)
}

async function run() {
	let start = START
	let hasNext = true

	if (cache) {
		start = cache.start
		hasNext = cache.hasNext
	}

	while (hasNext) {
		const response = await getGalaxeBatch(start, LOOK_AHEAD)

		save(start, response)

		start = response.data.campaigns.pageInfo.endCursor

		hasNext = response.data.campaigns.pageInfo.hasNextPage
	}
}

async function main() {
	if (TEST) test()

	run()
}

main()
