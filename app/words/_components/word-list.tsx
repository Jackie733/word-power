"use client";

import { useState } from "react";
import { type Word } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WordCard } from "@/components/word-card";
import { BookOpen, Volume2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WordListProps {
  initialWords: Word[];
}

export function WordList({ initialWords }: WordListProps) {
  const [words, setWords] = useState(initialWords);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRowClick = (word: Word) => {
    setSelectedWord(word);
  };

  const playAudio = (e: React.MouseEvent, audioUrl: string | null) => {
    e.stopPropagation(); // Prevent row click when clicking the button
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };

  const handleDelete = async (wordId: string) => {
    const originalWords = [...words];

    // Optimistically update UI
    setWords(currentWords => currentWords.filter(word => word.id !== wordId));
    setSelectedWord(null); // Close dialog
    toast.success("Word deleted successfully!");

    try {
      const response = await fetch(`/api/words/${wordId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Revert UI and show error toast
        setWords(originalWords);
        toast.error("Failed to delete the word. Please try again.");
      }
    } catch {
      // Revert UI and show error toast on network error
      setWords(originalWords);
      toast.error("An error occurred. Please check your connection.");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // 刷新页面数据
      router.refresh();
      toast.success("Word list refreshed!");
    } catch {
      toast.error("Failed to refresh word list");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (words.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
        <BookOpen className="h-12 w-12" />
        <h3 className="text-xl font-semibold">No Words Yet</h3>
        <p>Your word collection is empty. Start by adding a new word!</p>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {words.length} word{words.length !== 1 ? "s" : ""} in your library
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Word</TableHead>
              <TableHead className="hidden sm:table-cell">
                Pronunciation
              </TableHead>
              <TableHead>Meaning</TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Audio
              </TableHead>
              <TableHead className="hidden md:table-cell text-right">
                Added On
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map(word => (
              <TableRow
                key={word.id}
                onClick={() => handleRowClick(word)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{word.text}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {word.pronunciation}
                </TableCell>
                <TableCell className="truncate max-w-xs">
                  {word.meaning}
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => playAudio(e, word.audioUrl)}
                    disabled={!word.audioUrl}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  {new Date(word.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedWord} onOpenChange={() => setSelectedWord(null)}>
        <DialogContent>
          {selectedWord && (
            <WordCard word={selectedWord} onDelete={handleDelete} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
