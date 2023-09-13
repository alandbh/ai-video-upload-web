import { FastifyInstance } from "fastify";
import {fastifyMultipart } from "@fastify/multipart"
// import path from "path";
import path from "node:path"; // Útil colocar o "node:" pra saber quando um módulo vem de dentro do Node.
import { prisma } from "../lib/prisma";
import fs from "node:fs"
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";


// O pipeline é uma api do Node que é um tanto antiga e não tem suporte nativo para Promise com Async e Await.
// Então o promisify serve para converter essa função do tipo Calback em uma Promise, com suporte ao Async e Await.
const pump = promisify(pipeline);

export async function uploadVideosRoute(app:FastifyInstance) {
    // Tem que registrar o fastifyMultipart no app, pois o ele é um plugin do fastify
    app.register(fastifyMultipart, {
        limits: {
            fieldSize: 1_048_576 * 100 // default field size (1MB or 1048576 bites)
        }
    })
    app.post('/videos', async (req, res) => {
        const data = await req.file()

        if (!data) {
            return res.status(400).send({error: 'Missing data'});
        }

        const extension = path.extname(data.filename) 

        if (extension !== '.mp3') {
            return res.status(400).send({error: 'Invalid file extension. Please insert a .mp3 file'});
        }

        // Tratando os casos de arquivos com o mesmo nome
        const fileBaseName = path.basename(data.filename, extension)
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

        const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

        // O primeiro parametro do Pump é o streaming do arquivo que está sendo upado.
        // O segundo parametro é o diretorio de destino.
        await pump(data.file, fs.createWriteStream(uploadDestination))

        // Gravando o video upado no banco de dados

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination
            }
        })

        return {video}
    })
}