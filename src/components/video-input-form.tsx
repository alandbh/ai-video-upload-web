import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { FileVideo, Upload } from "lucide-react";
import React, { FormEvent, useMemo, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { log } from "console";

// import { Container } from './styles';

export const VideoInputForm: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget;

        if (!files) {
            return;
        }

        const selectedFile = files[0];

        setVideoFile(selectedFile);
    }

    async function convertVideoToAudio(video: File) {
        console.log("começou a converter...");

        const ffmpeg = await getFFmpeg();

        await ffmpeg.writeFile("input.mp4", await fetchFile(video));

        // Apenas para debugar
        // ffmpeg.on('log', (log) => console.log(log))

        ffmpeg.on("progress", (progress) => {
            console.log(
                "Converting progress: " + Math.round(progress.progress * 100)
            );
        });

        // Aqui a gente passa o comando FFmpeg como faríamos no terminal
        // A diferença é que cada espaço se transforma em uma posição no array
        // O comando será:
        // ffmpeg -i input.mp4 -map 0:a -b:a 20k -acodec linmp3lame output.mp3
        await ffmpeg.exec([
            "-i",
            "input.mp4",
            "-map",
            "0:a",
            "-b:a",
            "20k",
            "-acodec",
            "libmp3lame",
            "output.mp3",
        ]);

        const data = await ffmpeg.readFile("output.mp3");

        const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
        const audioFile = new File([audioFileBlob], "audio.mp3", {
            type: "audio/mpeg",
        });

        console.log("Conversão finalizada!!!");

        return audioFile;
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const prompt = promptInputRef.current?.value;

        if (!videoFile) {
            return;
        }

        // Convertendo o video em audio NO BROWSER!!!

        const audioFile = await convertVideoToAudio(videoFile);

        console.log(audioFile, prompt);
    }

    const previewURL = useMemo(() => {
        if (!videoFile) {
            return null;
        }

        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    return (
        <form onSubmit={handleUploadVideo} className="space-y-6">
            <label
                htmlFor="video"
                className="relative border w-full flex rounded-md aspect-video cursor-pointer flex-col gap-6 text-sm border-dashed items-center justify-center text-muted-foreground hover:bg-primary/10"
            >
                {previewURL ? (
                    <video
                        src={previewURL}
                        autoPlay
                        muted
                        className="pointer-events-none absolute inset-0"
                    />
                ) : (
                    <>
                        <FileVideo />
                        Select a mp4 file
                    </>
                )}
            </label>

            <input
                type="file"
                accept="video/mp4"
                name="video"
                id="video"
                className="sr-only"
                onChange={handleFileSelect}
            />

            <Separator />
            <div className="space-y-4">
                <Label htmlFor="transcription_prompt">
                    Transcription prompt
                </Label>
                <Textarea
                    ref={promptInputRef}
                    id="transcription_prompt"
                    className="min-h-[80px] leading-relaxed"
                    placeholder="Include comma separated keywords that are present in the video."
                />
                <Button className="w-full">
                    <Upload className="mr-2" /> Upload Video
                </Button>
            </div>
        </form>
    );
};
