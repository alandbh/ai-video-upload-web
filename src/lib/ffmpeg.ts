import {FFmpeg} from "@ffmpeg/ffmpeg"

import coreURL from "../ffmpeg/ffmpeg-core.js?url"
//  o ponto de interrogação acima é para informar a aplicação que esse script será carregado 
//  como um script comum na tag <script>

import wasmURL from "../ffmpeg/ffmpeg-core.wasm?url"
import workerURL from "../ffmpeg/ffmpeg-worker.js?url"

let ffmpeg: FFmpeg | null

// Aqui estamos garantindo que o FFmpeg Web Assembly seja carregado apenas quando necessario.
// Isso porque o FFmpeg Web Assembly é muito pesado (cerca de 30 MB)

export async function getFFmpeg() {
    if(ffmpeg) {
        return ffmpeg
    }

    ffmpeg = new FFmpeg()

    if(!ffmpeg.loaded) {
        await ffmpeg.load({
            coreURL,
            wasmURL,
            workerURL
        })
    }

    return ffmpeg
}