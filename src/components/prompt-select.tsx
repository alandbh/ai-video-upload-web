import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { api } from "@/lib/axios";

type PromptType = {
    id: string;
    title: string;
    template: string;
};

type PromptSelectProps = {
    onPromptSelect: (template: string) => void;
};

export function PromptSelect(props: PromptSelectProps) {
    const [prompts, setPrompts] = useState<PromptType[] | null>(null);

    useEffect(() => {
        api.get("/prompts").then((response) => {
            setPrompts(response.data);
        });
    }, []);

    function handlePromptSelect(promptId: string) {
        const selectedPrompt = prompts?.find(
            (prompt) => prompt.id === promptId
        );

        if (!selectedPrompt) {
            return;
        }

        props.onPromptSelect(selectedPrompt.template);
    }
    return (
        <Select onValueChange={handlePromptSelect}>
            <SelectTrigger id="prompt">
                <SelectValue placeholder="Select a custom prompt" />
            </SelectTrigger>
            <SelectContent>
                {prompts?.map((prompt) => {
                    return (
                        <SelectItem key={prompt.id} value={prompt.id}>
                            {prompt.title}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
