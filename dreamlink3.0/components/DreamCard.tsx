"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type DreamEntryProps = {
  empty?: boolean;
  dream: {
    id: string;
    original_text: string;
    title?: string;
    dream_summary?: string;
    analysis_summary?: string;
    tags?: string[];
    bible_refs?: string[];
    created_at?: string;
  };
};

// This would come from your API in a real implementation
const BIBLE_VERSES = {
  "Genesis 1:1": "In the beginning God created the heaven and the earth.",
  "Psalm 23": "The Lord is my shepherd; I shall not want.",
  "Psalm 23:2": "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
  "Matthew 5:3": "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
  "John 3:16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  "John 8:12": "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.",
  "Exodus 14:21": "And Moses stretched out his hand over the sea; and the LORD caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided.",
  "1 Kings 6:19": "And the oracle he prepared in the house within, to set there the ark of the covenant of the LORD."
};

export default function DreamCard({ empty, dream }: DreamEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Format date as MMM DD
  const dateObj = dream.created_at ? new Date(dream.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  // Handle card click to show dialog
  const handleCardClick = () => {
    // Always open dialog, even for placeholder/example dreams
    setIsOpen(true);
  };

  return (
    <>
      <Card 
        className="overflow-hidden transition-all h-full cursor-pointer hover:shadow-md"
        onClick={handleCardClick}
      >
        <CardHeader className="p-3 pb-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm line-clamp-1">{dream.title}</CardTitle>
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-1 space-y-2">
          {/* Summary */}
          {dream.dream_summary && (
            <div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {dream.dream_summary}
              </p>
            </div>
          )}
          
          {/* Tags */}
          {dream.tags && dream.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {dream.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Bible References */}
          {dream.bible_refs && dream.bible_refs.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <TooltipProvider>
                {dream.bible_refs.map((ref, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <BookIcon className="h-2 w-2" />
                        {ref}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[300px] text-xs">{BIBLE_VERSES[ref as keyof typeof BIBLE_VERSES] || "Verse content"}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dream.title}</DialogTitle>
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="original" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="original">Original Dream</TabsTrigger>
              <TabsTrigger value="analysis">Dream Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="original" className="space-y-4 p-1">
              <div className="text-sm whitespace-pre-wrap">
                {dream.original_text}
              </div>
              
              {dream.tags && dream.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-4 border-t">
                  {dream.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4 p-1">
              {dream.dream_summary && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {dream.dream_summary}
                  </p>
                </div>
              )}
              
              {dream.analysis_summary && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {dream.analysis_summary}
                  </p>
                </div>
              )}
              
              {dream.bible_refs && dream.bible_refs.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-medium">Biblical References</h4>
                  <div className="space-y-2">
                    {dream.bible_refs.map((ref, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{ref}:</span>{" "}
                        <span className="text-muted-foreground">
                          {BIBLE_VERSES[ref as keyof typeof BIBLE_VERSES] || "Verse content"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}