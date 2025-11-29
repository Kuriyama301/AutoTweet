'use client';

import { useState, useEffect } from 'react';
import { SearchRequest } from '@/types';

const STORAGE_KEY = 'autotweet_selection_keywords';
const DEFAULT_KEYWORDS = '代表,CEO,創業者,経営,経営者,代表取締役,founder,社長,取締役,役員,CTO,COO,CFO,起業家,オーナー';

interface SearchFormProps {
  onSearch: (request: SearchRequest) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('受託開発&最新');
  const [limit, setLimit] = useState(10);
  const [keywordsInput, setKeywordsInput] = useState(DEFAULT_KEYWORDS);

  // ローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setKeywordsInput(saved);
    }
  }, []);

  // キーワード変更時にローカルストレージに保存
  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  // キーワードをクリア
  const handleClearKeywords = () => {
    setKeywordsInput('');
    localStorage.setItem(STORAGE_KEY, '');
  };

  // デフォルトに戻す
  const handleResetKeywords = () => {
    setKeywordsInput(DEFAULT_KEYWORDS);
    localStorage.setItem(STORAGE_KEY, DEFAULT_KEYWORDS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    // キーワードをカンマで分割してトリム、空文字を除外
    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k !== '');

    onSearch({
      query,
      limit,
      selectionKeywords: keywords.length > 0 ? keywords : [],
    });
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

        {/* 選定キーワード */}
        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            選定キーワード
          </label>
          <div className="relative">
            <input
              type="text"
              id="keywords"
              value={keywordsInput}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="例: 代表,CEO,創業者,経営者"
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            {keywordsInput && (
              <button
                type="button"
                onClick={handleClearKeywords}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                disabled={isLoading}
              >
                クリア
              </button>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              カンマ区切りで入力。空欄の場合は全件取得。
            </p>
            <button
              type="button"
              onClick={handleResetKeywords}
              className="text-xs text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              デフォルトに戻す
            </button>
          </div>
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
            選定されたポストを何件取得するか（1〜20件）
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
