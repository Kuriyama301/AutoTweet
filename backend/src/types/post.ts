/**
 * Xのポスト情報
 */
export interface Post {
  /** ポストの本文 */
  text: string;

  /** 作成者の表示名 */
  author: string;

  /** 作成者のハンドル名（@username） */
  authorHandle: string;

  /** 作成者のプロフィール */
  authorProfile: string;

  /** ポストのURL */
  url: string;

  /** 投稿日時（ISO 8601形式） */
  timestamp: string;
}

/**
 * X検索オプション
 */
export interface SearchOptions {
  /** 検索クエリ */
  query: string;

  /** 取得件数（デフォルト: 20） */
  limit?: number;

  /** 検索タイプ（最新: live, 人気: top） */
  searchType?: 'live' | 'top';

  /** 最大スクロール回数（デフォルト: 10） */
  maxScrolls?: number;
}
