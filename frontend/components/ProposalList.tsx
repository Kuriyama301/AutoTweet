'use client';

import { Proposal } from '@/types';
import ProposalCard from './ProposalCard';

interface ProposalListProps {
  proposals: Proposal[];
  onUpdate: (proposal: Proposal) => void;
  onDelete: (id: string) => void;
}

export default function ProposalList({
  proposals,
  onUpdate,
  onDelete,
}: ProposalListProps) {
  if (proposals.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-500">
          検索を実行すると、ここに提案が表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          リプライ提案（{proposals.length}件）
        </h2>
      </div>

      {proposals.map((proposal, index) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          index={index + 1}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
