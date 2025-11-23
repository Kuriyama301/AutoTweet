'use client';

import { useState, useEffect } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onSave: (text: string) => void;
  isProcessing: boolean;
}

export default function EditModal({
  isOpen,
  onClose,
  initialText,
  onSave,
  isProcessing,
}: EditModalProps) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (text.trim().length === 0) {
      alert('リプライ文面を入力してください');
      return;
    }

    if (text.length > 280) {
      alert('リプライ文面は280文字以内で入力してください');
      return;
    }

    onSave(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            リプライ文面を編集
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
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

        {/* 本文 */}
        <div className="p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isProcessing}
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="リプライ文面を入力..."
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {text.length} / 280文字
            </span>
            {text.length > 280 && (
              <span className="text-red-600">
                文字数オーバー
              </span>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing || text.length === 0 || text.length > 280}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            {isProcessing ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
