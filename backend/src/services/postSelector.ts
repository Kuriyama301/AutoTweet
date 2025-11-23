import { Post } from '../types/post';

/**
 * 経営者判定キーワード
 */
const EXECUTIVE_KEYWORDS = [
  '代表',
  'CEO',
  'ceo',
  '創業者',
  '経営',
  '代表取締役',
  'founder',
  'Founder',
  'FOUNDER',
  '社長',
  'Co-Founder',
  'co-founder',
];

/**
 * ポスト選定サービス
 */
export class PostSelector {
  /**
   * 経営者のポストを選定
   * @param posts - 全ポストリスト
   * @param limit - 最大件数（デフォルト: 10）
   * @returns 経営者のポストリスト
   */
  selectExecutivePosts(posts: Post[], limit: number = 10): Post[] {
    const executivePosts = posts.filter((post) => this.isExecutive(post));

    // limit件に制限
    return executivePosts.slice(0, limit);
  }

  /**
   * プロフィールから経営者かどうか判定
   * @param post - ポスト
   * @returns 経営者の場合true
   */
  private isExecutive(post: Post): boolean {
    const profile = post.authorProfile;

    if (!profile) {
      return false;
    }

    // キーワードマッチング
    return EXECUTIVE_KEYWORDS.some((keyword) => profile.includes(keyword));
  }
}
