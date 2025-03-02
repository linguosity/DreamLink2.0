"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BookIcon, PuzzleIcon, Trash2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type DreamEntryProps = {
  empty?: boolean;
  loading?: boolean;
  dream: {
    id: string;
    original_text: string;
    title?: string;
    dream_summary?: string;
    analysis_summary?: string;
    topic_sentence?: string;
    supporting_points?: string[];
    conclusion_sentence?: string;
    formatted_analysis?: string;
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

export default function DreamCard({ empty, loading: initialLoading, dream }: DreamEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initialLoading || false);
  
  // Format date as MMM DD
  const dateObj = dream.created_at ? new Date(dream.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  // Check if this dream is the loading dream (just submitted)
  useEffect(() => {
    // Get the loading dream ID from localStorage
    const loadingDreamId = typeof window !== 'undefined' ? 
      localStorage.getItem('loadingDreamId') : null;
    
    // If this is the loading dream, set loading state
    if (loadingDreamId === dream.id) {
      console.log('This dream is loading:', dream.id);
      setIsLoading(true);
      
      // Check every 2 seconds if the dream analysis is complete
      const interval = setInterval(() => {
        // If dream has analysis, clear interval and update state
        if (dream.dream_summary || dream.analysis_summary || 
            (dream.supporting_points && dream.supporting_points.length > 0)) {
          console.log('Dream analysis complete:', dream.id);
          setIsLoading(false);
          localStorage.removeItem('loadingDreamId');
          clearInterval(interval);
        } else {
          // Refresh the page to get updated dream data
          router.refresh();
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [dream.id, dream.dream_summary, dream.analysis_summary, dream.supporting_points]);

  // Handle card click to show dialog
  const handleCardClick = () => {
    // Always open dialog, even for placeholder/example dreams
    setIsOpen(true);
  };
  
  // Handle delete dream
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteDream = async () => {
    if (empty) return; // Don't allow deleting example dreams
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/dream-entries?id=${dream.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete dream');
      }
      
      // Close the dialog and refresh the page
      setIsOpen(false);
      router.refresh();
      
    } catch (error) {
      console.error('Error deleting dream:', error);
      alert('Failed to delete this dream. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to format Bible citations in parentheses with tooltips
  const formatBibleCitations = (text: string | undefined, refs?: string[]) => {
    if (!text || !refs || refs.length === 0) return text;
    
    // Create JSX elements with formatted citations and tooltips
    return (
      <TooltipProvider>
        {text.split(/(\([^)]*\))/).map((part, index) => {
          // Check if this part contains a Bible reference
          const refMatch = part.match(/\(([\w\s]+\d+:\d+)\)/);
          
          if (refMatch && refs.includes(refMatch[1])) {
            const reference = refMatch[1];
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span className="cursor-help">{part}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[300px] text-xs">{BIBLE_VERSES[reference as keyof typeof BIBLE_VERSES] || "Verse content"}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
          
          return <span key={index}>{part}</span>;
        })}
      </TooltipProvider>
    );
  };

  // Render loading skeleton if in loading state
  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all h-full">
        <CardHeader className="p-3 pb-1">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-3 w-[60px]" />
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-1 space-y-2">
          {/* Summary Skeleton */}
          <div>
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-[80%]" />
          </div>
          
          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

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
          
          {/* Bible References - removed from card view */}
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
          
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analysis" className="flex items-center gap-1"><PuzzleIcon className="h-3 w-3" />Analysis</TabsTrigger>
              <TabsTrigger value="original">Original Dream</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="space-y-4 p-1">
              {dream.dream_summary && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {dream.dream_summary}
                  </p>
                </div>
              )}
              
              {dream.formatted_analysis ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatBibleCitations(dream.formatted_analysis, dream.bible_refs)}
                  </p>
                </div>
              ) : dream.analysis_summary ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatBibleCitations(dream.analysis_summary, dream.bible_refs)}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Analysis</h4>
                  {dream.topic_sentence && (
                    <p className="text-sm text-muted-foreground font-medium">
                      {dream.topic_sentence}
                    </p>
                  )}
                  {dream.supporting_points && dream.supporting_points.length > 0 && (
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {dream.supporting_points.map((point, index) => (
                        <li key={index}>{formatBibleCitations(point, dream.bible_refs)}</li>
                      ))}
                    </ul>
                  )}
                  {dream.conclusion_sentence && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {dream.conclusion_sentence}
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="original" className="space-y-4 p-1">
              <div className="text-sm whitespace-pre-wrap">
                {dream.original_text}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Footer with tags and biblical references */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                {dream.tags && dream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dream.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
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
              </div>
              
              {/* Delete Button with Confirmation */}
              {!empty && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2Icon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this dream?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your dream and all associated analysis.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteDream}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete Dream"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}