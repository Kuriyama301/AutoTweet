'use client';

import { useState } from 'react';
import { Proposal } from '@/types';
import { updateProposal, deleteProposal, executeProposal } from '@/lib/api';
import EditModal from './EditModal';

interface ProposalCardProps {
  proposal: Proposal;
  index: number;
  onUpdate: (proposal: Proposal) => void;
  onDelete: (id: string) => void;
}

export default function ProposalCard({
  proposal,
  index,
  onUpdate,
  onDelete,
}: ProposalCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecute = async () => {
    if (!confirm('この提案を実行しますか？\n（リプライ投稿 + いいね）')) {
      return;
    }

    setIsProcessing(true);

    try {
      const updated = await executeProposal(proposal.id);
      onUpdate(updated);
      alert('リプライ投稿といいねが完了しました');
    } catch (error) {
      console.error('Execute error:', error);
      alert(
        error instanceof Error
          ? `実行に失敗しました: ${error.message}`
          : '実行に失敗しました'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = async () => {
    setIsProcessing(true);

    try {
      const updated = await updateProposal(proposal.id, {
        status: 'skipped',
      });
      onUpdate(updated);
    } catch (error) {
      console.error('Skip error:', error);
      alert('スキップに失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この提案を削除しますか？')) {
      return;
    }

    setIsProcessing(true);

    try {
      await deleteProposal(proposal.id);
      onDelete(proposal.id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('削除に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async (newReplyText: string) => {
    if (!confirm('修正したリプライを実行しますか？\n（リプライ投稿 + いいね）')) {
      return;
    }

    setIsProcessing(true);

    try {
      // リプライ文面を更新
      await updateProposal(proposal.id, {
        replyText: newReplyText,
      });

      // 実行
      const updated = await executeProposal(proposal.id);
      onUpdate(updated);
      setIsEditModalOpen(false);
      alert('リプライ投稿といいねが完了しました');
    } catch (error) {
      console.error('Edit and execute error:', error);
      alert(
        error instanceof Error
          ? `実行に失敗しました: ${error.message}`
          : '実行に失敗しました'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    approved: 'bg-green-100 text-green-800',
    skipped: 'bg-yellow-100 text-yellow-800',
    executed: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    pending: '保留中',
    approved: '承認済み',
    skipped: 'スキップ',
    executed: '実行済み',
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">
              #{index}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                statusColors[proposal.status]
              }`}
            >
              {statusLabels[proposal.status]}
            </span>
          </div>
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 元ポスト */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">
              {proposal.post.author}
            </span>
            <span className="text-sm text-gray-500">
              {proposal.post.authorHandle}
            </span>
          </div>
          <p className="text-gray-700 mb-2">{proposal.post.text}</p>
          <a
            href={proposal.post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            ポストを見る →
          </a>
        </div>

        {/* リプライ文面 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            リプライ文面
          </h3>
          <p className="text-gray-900 bg-blue-50 p-3 rounded">
            {proposal.replyText}
          </p>
        </div>

        {/* アクションボタン */}
        {proposal.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={handleExecute}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 transition-colors"
            >
              {isProcessing ? '実行中...' : '実行'}
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              修正して実行
            </button>
            <button
              onClick={handleSkip}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
            >
              スキップ
            </button>
          </div>
        )}
      </div>

      {/* 編集モーダル */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialText={proposal.replyText}
        onSave={handleEdit}
        isProcessing={isProcessing}
      />
    </>
  );
}
