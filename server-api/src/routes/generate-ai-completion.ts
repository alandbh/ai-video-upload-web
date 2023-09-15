import "dotenv/config"
import { FastifyInstance } from "fastify";
import {z} from 'zod' // Validação
import {streamToResponse, OpenAIStream} from 'ai'
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function generateAiCompletionRoute(app:FastifyInstance) {
    app.post('/ai/complete', async (req, res) => {
        const bodySchema = z.object({
            videoId: z.string().uuid(),
            prompt: z.string(),
            temperature: z.number().min(0).max(1).default(.5)
        })

        const {videoId, prompt, temperature} = bodySchema.parse(req.body)

        const video  = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId
            }
        })

        if (!video.transcription) {
            return res.status(400).send({error: "Video transcript not found"})
        }

        const promptMessage = prompt.replace('{transcription}', video.transcription)

        /**
         * Sobre a escolha do modelo
         * 
         * O modelo gpt-3.5-turbo aceita no máximo 4096 tokens, incluindo o prompt e a resposta.
         * Então, como a nossa descrição é muito grande, a gente iria gastar quase toda a cota apenas no prompt.
         * Por isso, escolhemos o 'gpt-3.5-turbo-16k' que permite 16000 tokens.
         * 
         * Neste site é possível calcular a quantidade de tokens que a gente tá usando:
         * https://platform.openai.com/tokenizer
         */

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            temperature,
            messages: [{
                role: 'user', content: promptMessage
            }],
            stream: true
        })

        const stream = OpenAIStream(response)

        streamToResponse(stream, res.raw, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            }
        })

        // return response


    })
}