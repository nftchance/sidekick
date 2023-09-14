import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
	const quests = await prisma.rabbithole_Quest.findMany()

	return NextResponse.json(quests)
}
