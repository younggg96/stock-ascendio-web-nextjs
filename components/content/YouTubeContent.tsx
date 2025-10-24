"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContentWithModal from "../ContentWithModal";
import ExpandableText from "../ExpandableText";
import AIAnalysis from "../AIAnalysis";
import { YouTubeContentProps } from "./types";

export default function YouTubeContent({
  title,
  fullText,
  url,
  id,
  mediaUrls,
  aiSummary,
  aiAnalysis,
  onFormatText,
  viewCount,
  duration,
  thumbnailUrl,
  channelName,
}: YouTubeContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const summary = aiSummary || "";

  return (
    <>
      <div className="space-y-2 mb-3">
        {/* Summary */}
        <div className="text-xs text-gray-600 dark:text-white/60">
          Summary: {summary}
        </div>

        {/* Video Description */}
        <ContentWithModal
          onOpenModal={() => setIsModalOpen(true)}
          ariaLabel="Open video in modal"
        >
          <ExpandableText
            text={fullText}
            maxWords={80}
            onFormatText={onFormatText}
          />
        </ContentWithModal>

        {/* AI Analysis */}
        <AIAnalysis aiAnalysis={aiAnalysis} />
      </div>

      {/* YouTube Embed Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[600px] w-[95vw] max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-card-dark rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-gray-900 dark:text-white">
              YouTube Video
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto p-2 max-h-[calc(90vh-80px)] bg-white dark:bg-card-dark rounded-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              width="100%"
              height={500}
              frameBorder="0"
              className="rounded-xl bg-white dark:bg-card-dark"
              style={{ border: "none" }}
              allowFullScreen
            />
          </div>
          <DialogFooter className="px-6 pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View on YouTube
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
