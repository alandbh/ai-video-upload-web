import { Github, Wand2 } from "lucide-react";
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
import { VideoInputForm } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-select";
import { log } from "./lib/utils";
import { useState } from "react";
import { useCompletion } from "ai/react";

function App() {
    const [temperature, setTemperature] = useState(0.5);
    const [videoId, setVideoId] = useState<string | null>(null);

    function handlePromptSelect(template: string) {
        log({ template });
        // setInput()
    }

    const {
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        completion,
        isLoading,
    } = useCompletion({
        api: "http://localhost:3333/ai/complete",
        body: {
            videoId,
            temperature,
        },
        headers: {
            "Content-Type": "application/json",
        },
    });
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
                                value={input}
                                onChange={handleInputChange}
                            />
                            <Textarea
                                readOnly
                                className="resize-none p-4 leading-relaxed"
                                placeholder="AI result"
                                value={completion}
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
                        <VideoInputForm onUploaded={setVideoId} />

                        <Separator />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="prompt">Prompt</Label>

                                <PromptSelect onPromptSelect={setInput} />
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

                                {/* Esse componente Slider sempre tem os values como array, mesmo ele sendo simples como o abaixo
                                é que por padrão o slider pode receber dois valores (minimo e maximo - com duas bolinhas)
                                Então, neste caso, o value, tem que ser em formato de array */}
                                <Slider
                                    value={[temperature]}
                                    onValueChange={(value) =>
                                        setTemperature(value[0])
                                    }
                                    min={0}
                                    max={1}
                                    step={0.1}
                                />
                                <p className="text-xs text-muted-foreground italic">
                                    The higher the temperature, the more
                                    creative (and prone to make mistakes) the
                                    response will be.
                                </p>
                            </div>

                            <Separator />

                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="w-full"
                            >
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
