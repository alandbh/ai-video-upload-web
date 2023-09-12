import { Github, FileVideo, Upload, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";

function App() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <div className="px-6 py-3 flex items-center justify-between border-b">
                    <h1 className="font-bold text-xl">AI Upload</h1>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 ">
                            Desenvolvido com ❤️
                        </span>

                        <Separator orientation="vertical" className="h-4" />
                        <Button variant="outline">
                            <Github className="w-4 h-4 mr-4" />
                            Github
                        </Button>
                    </div>
                </div>

                <main className=" flex-1 p-6 flex gap-6">
                    <div className="flex flex-col flex-1 gap-4">
                        <div className="grid grid-rows-2 gap-4 flex-1">
                            <Textarea
                                className="resize-none p-4 leading-relaxed"
                                placeholder="Type your AI prompt here..."
                            />
                            <Textarea
                                className="resize-none p-4 leading-relaxed"
                                placeholder="AI result"
                            />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Lembre-se: Você pode usar a variável{" "}
                            <code className="text-blue-500">
                                {"{transcription}"}
                            </code>{" "}
                            no seu promt para adicionar o conteúdo da
                            transcriçao do sideo selecionado
                        </p>
                    </div>

                    <aside className="w-80 space-y-6">
                        <form action="" className="space-y-6">
                            <label
                                htmlFor="video"
                                className="border w-full flex rounded-md aspect-video cursor-pointer flex-col gap-6 text-sm border-dashed items-center justify-center text-muted-foreground hover:bg-primary/10"
                            >
                                <FileVideo />
                                Select a mp4 file
                            </label>

                            <input
                                type="file"
                                accept="video/mp4"
                                name="video"
                                id="video"
                                className="sr-only"
                            />

                            <Separator />
                            <div className="space-y-4">
                                <Label htmlFor="transcription_prompt">
                                    Transcription prompt
                                </Label>
                                <Textarea
                                    id="transcription_prompt"
                                    className="min-h-[80px] leading-relaxed"
                                    placeholder="Include comma separated keywords that are present in the video."
                                />
                                <Button className="w-full">
                                    <Upload className="mr-2" /> Upload Video
                                </Button>
                            </div>
                        </form>

                        <Separator />

                        <form action="" className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="prompt">Prompt</Label>

                                <Select>
                                    <SelectTrigger id="prompt">
                                        <SelectValue placeholder="Select a custom prompt" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="title">
                                            Video Title
                                        </SelectItem>
                                        <SelectItem value="description">
                                            Video Description
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>

                                <Select disabled defaultValue="gpt3.5">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gpt3.5">
                                            GPT 3.5-turbo 16k
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground italic">
                                    You'll be able to customize this later.
                                </p>
                            </div>

                            <Separator />
                            <div className="space-y-6">
                                <Label htmlFor="temperature">Temperature</Label>
                                <Slider min={0} max={1} step={0.1} />
                                <p className="text-xs text-muted-foreground italic">
                                    The higher the temperature, the more
                                    creative (and prone to make mistakes) the
                                    response will be.
                                </p>
                            </div>

                            <Separator />

                            <Button type="submit" className="w-full">
                                <Wand2 className="w-4 mr-4" />
                                Do the Magic
                            </Button>
                        </form>
                    </aside>
                </main>
            </div>
        </>
    );
}

export default App;
