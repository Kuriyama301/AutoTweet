import { Post } from '../types/post';

/**
 * デフォルトの経営者判定キーワード
 */
export const DEFAULT_EXECUTIVE_KEYWORDS = [
  '代表',
  'CEO',
  'ceo',
  '創業者',
  '経営',
  '経営者',
  '代表取締役',
  'founder',
  'Founder',
  'FOUNDER',
  '社長',
  'Co-Founder',
  'co-founder',
  '取締役',
  '役員',
  'CTO',
  'cto',
  'COO',
  'coo',
  'CFO',
  'cfo',
  '起業家',
  'オーナー',
  '代表社員',
  'パートナー',
];

/**
 * ポスト選定サービス
 */
export class PostSelector {
  /**
   * キーワードでポストを選定
   * @param posts - 全ポストリスト
   * @param keywords - フィルタリング用キーワード（空の場合は全件取得）
   * @param limit - 最大件数（デフォルト: 10）
   * @returns 選定されたポストリスト
   */
  selectPosts(posts: Post[], keywords: string[], limit: number = 10): Post[] {
    // キーワードが空の場合は全件取得
    if (keywords.length === 0) {
      return posts.slice(0, limit);
    }

    const filteredPosts = posts.filter((post) => this.matchesKeywords(post, keywords));

    // limit件に制限
    return filteredPosts.slice(0, limit);
  }

  /**
   * 経営者のポストを選定（デフォルトキーワード使用）
   * @param posts - 全ポストリスト
   * @param limit - 最大件数（デフォルト: 10）
   * @returns 経営者のポストリスト
   */
  selectExecutivePosts(posts: Post[], limit: number = 10): Post[] {
    return this.selectPosts(posts, DEFAULT_EXECUTIVE_KEYWORDS, limit);
  }

  /**
   * プロフィールがキーワードにマッチするか判定
   * @param post - ポスト
   * @param keywords - キーワード配列
   * @returns マッチする場合true
   */
  private matchesKeywords(post: Post, keywords: string[]): boolean {
    const profile = post.authorProfile;

    if (!profile) {
      return false;
    }

    // いずれかのキーワードにマッチすればtrue
    return keywords.some((keyword) => profile.includes(keyword));
  }
}
