'use client';

import { useState } from 'react';
import { SearchRequest } from '@/types';

interface SearchFormProps {
  onSearch: (request: SearchRequest) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('受託開発&最新');
  const [limit, setLimit] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    onSearch({ query, limit });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        検索設定
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 検索クエリ */}
        <div>
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            検索クエリ
          </label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="受託開発&最新"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            X検索で使用するキーワードを入力
          </p>
        </div>

        {/* 取得件数 */}
        <div>
          <label
            htmlFor="limit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            取得件数
          </label>
          <input
            type="number"
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            min={1}
            max={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            経営者のポストを何件取得するか（1〜20件）
          </p>
        </div>

        {/* 検索ボタン */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </form>
    </div>
  );
}
