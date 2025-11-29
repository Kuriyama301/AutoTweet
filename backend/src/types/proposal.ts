import { Post } from './post';

/**
 * リプライ提案
 */
export interface Proposal {
  /** 提案ID（自動生成） */
  id: string;

  /** 対象ポスト */
  post: Post;

  /** 生成されたリプライ文面 */
  replyText: string;

  /** 提案の状態 */
  status: 'pending' | 'approved' | 'skipped' | 'executed';

  /** 作成日時（ISO 8601形式） */
  createdAt: string;

  /** 更新日時（ISO 8601形式） */
  updatedAt: string;
}

/**
 * 検索リクエスト
 */
export interface SearchRequest {
  /** 検索クエリ */
  query: string;

  /** 取得件数（オプション） */
  limit?: number;

  /** 選定キーワード（オプション、空の場合は全件取得） */
  selectionKeywords?: string[];
}

/**
 * 検索レスポンス
 */
export interface SearchResponse {
  /** 提案リスト */
  proposals: Proposal[];

  /** 成功フラグ */
  success: boolean;

  /** エラーメッセージ（エラー時） */
  error?: string;
}
