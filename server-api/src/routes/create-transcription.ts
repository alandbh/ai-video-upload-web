import "dotenv/config"
import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import {z} from 'zod' // Validação
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";
import { log } from "node:console";

export async function createTranscriptionRoute(app:FastifyInstance) {

   
    app.post('/videos/:videoId/transcription', async (req, res) => {

        // aqui estou estabelecendo o formato dos parametros obrigatorios na URL.
        const paramsSchema = z.object({
            videoId: z.string().uuid() // Este é o formato que está salvo no Banco
        })
        // const videoId = req.params.videoId; // Vou usar o parametro configurado no Zod
        const {videoId} = paramsSchema.parse(req.params) // O zod vai checar se o req.params está no formato que estabelecemos acima


        // agora vamos validar o parametro promt
        // aquele campo de texto no frontend para ajudar o GPT a interpretar palavras específicas do contexto do video.
        const bodySchema = z.object({
            prompt: z.string()
        })

        const {prompt} = bodySchema.parse(req.body)

        // Aqui estamos fazendo uma query do video no Banco
        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId
            }
        })

        const videoPath = video.path
        const audioReadStream = createReadStream(videoPath)

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt
        })

        const transcription = response.text

        await prisma.video.update({
            where: {
                id: videoId,
            }, 
            data: {
                transcription
            }
        })

        return {transcription}

    })
}