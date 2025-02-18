// src/components/ui/dream_card.tsx

import React from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Dream } from '@/types/dreamAnalysis';

interface DreamCardProps {
  dream: Dream;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream }) => {
  const { created_at, analysis } = dream;
  const { title, original_dream, tags } = analysis;

  return (
    <Card className="p-4">
      <p className="text-sm italic text-gray-500">
        {new Date(created_at).toLocaleString()}
      </p>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-base my-2">{original_dream}</p>
      <div className="flex space-x-1 mt-2">
        {tags.general_theme.map((tag, idx) => (
          <Badge key={idx} className="cursor-pointer">
            #{tag}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default DreamCard;