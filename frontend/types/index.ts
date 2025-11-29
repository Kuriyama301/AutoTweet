/**
 * Xのポスト情報
 */
export interface Post {
  text: string;
  author: string;
  authorHandle: string;
  authorProfile: string;
  url: string;
  timestamp: string;
}

/**
 * リプライ提案
 */
export interface Proposal {
  id: string;
  post: Post;
  replyText: string;
  status: 'pending' | 'approved' | 'skipped' | 'executed';
  createdAt: string;
  updatedAt: string;
}

/**
 * 検索リクエスト
 */
export interface SearchRequest {
  query: string;
  limit?: number;
  selectionKeywords?: string[];
}

/**
 * 検索レスポンス
 */
export interface SearchResponse {
  proposals: Proposal[];
  success: boolean;
  error?: string;
}
