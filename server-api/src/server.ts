import { log } from "console";
import {fastify} from "fastify";
import {fastifyCors} from "@fastify/cors"
import { prisma } from "./lib/prisma";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideosRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAiCompletionRoute } from "./routes/generate-ai-completion";

const app = fastify()

app.register(fastifyCors, {
    origin: "*",
})

app.register(getAllPromptsRoute)
app.register(uploadVideosRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletionRoute)


app.listen({
    port: 3333,
}).then(() => {
    log('AAA http server listening on port')
})