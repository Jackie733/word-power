"use client";

import { Button } from "@/components/ui/button";
import { type Word } from "@prisma/client";
import { Trash2, Volume2 } from "lucide-react";

interface WordCardProps {
  word: Word;
  onDelete: (id: string) => void;
}

export function WordCard({ word, onDelete }: WordCardProps) {
  const playAudio = () => {
    if (word.audioUrl) {
      new Audio(word.audioUrl).play();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">{word.text}</h2>
        {word.pronunciation && (
          <p className="text-muted-foreground">{word.pronunciation}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1">Definition</h4>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {word.meaning}
          </p>
        </div>
        {word.example && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Example</h4>
            <p className="text-muted-foreground italic">
              &quot;{word.example}&quot;
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-muted-foreground">
          Added on {new Date(word.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={playAudio}
            disabled={!word.audioUrl}
            aria-label="Play pronunciation"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(word.id)}
            className="text-destructive hover:text-destructive/80"
            aria-label="Delete word"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
