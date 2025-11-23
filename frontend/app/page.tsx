'use client';

import { useState } from 'react';
import { SearchRequest, Proposal } from '@/types';
import { searchPosts } from '@/lib/api';
import SearchForm from '@/components/SearchForm';
import ProposalList from '@/components/ProposalList';

export default function Home() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (request: SearchRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchPosts(request);

      if (!response.success) {
        throw new Error(response.error || '検索に失敗しました');
      }

      setProposals(response.proposals);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProposal = (updated: Proposal) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProposal = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AutoTweet
          </h1>
          <p className="text-gray-600">
            AI活用型Xエンゲージメント自動化ツール
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 検索フォーム */}
          <div className="lg:col-span-1">
            <SearchForm
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* エラー表示 */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* 提案リスト */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">検索中...</div>
              </div>
            ) : (
              <ProposalList
                proposals={proposals}
                onUpdate={handleUpdateProposal}
                onDelete={handleDeleteProposal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
