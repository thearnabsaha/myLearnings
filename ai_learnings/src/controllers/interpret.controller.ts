import { Request, Response } from 'express';
import { interpretEmotion } from '../models/interpretEmotion';
import { prisma } from '../db/client';
import { extractTags } from '../models/extractTags';

export const InterpetationByPsychologists = async (req: Request, res: Response) => {
    const { dream } = req.body
    if (!dream) {
        res.status(400).json({ message: "dream doesn't exist!" });
        return;
    }
    try {
        const interpretationByJung = await interpretEmotion(dream, "jung");
        const interpretationByFreud = await interpretEmotion(dream, "freud");
        const tags = await extractTags(dream)
        await prisma.dream.create({
            data: {
                dream: dream,
                interpretationByFreud: interpretationByFreud,
                interpretationByJung: interpretationByJung,
                tags: {
                    connectOrCreate: tags.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag },
                    }))
                }
            },
            include: { tags: true }
        })
        res.status(200).json({ tags, interpretationByFreud, interpretationByJung });
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
