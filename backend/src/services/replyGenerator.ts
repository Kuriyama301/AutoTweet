import { Post } from '../types/post';

/**
 * リプライテンプレート
 */
const REPLY_TEMPLATES = [
  '{author}さん、勉強になります！',
  '{author}さん、参考になりました。ありがとうございます！',
  '{author}さん、素晴らしい視点ですね！',
  '{author}さん、まさにそのとおりですね。',
  '{author}さん、とても共感しました！',
  '{author}さん、面白い内容ですね！',
  '{author}さん、興味深いお話です。',
  '{author}さん、ありがとうございます！勉強になりました。',
];

/**
 * リプライ文面生成サービス
 */
export class ReplyGenerator {
  /**
   * リプライ文面を生成
   * @param post - 対象ポスト
   * @returns 生成されたリプライ文面
   */
  generateReply(post: Post): string {
    // ランダムにテンプレートを選択
    const template = this.selectRandomTemplate();

    // テンプレート内のプレースホルダーを置換
    const reply = this.replacePlaceholders(template, post);

    return reply;
  }

  /**
   * ランダムにテンプレートを選択
   * @returns テンプレート文字列
   */
  private selectRandomTemplate(): string {
    const randomIndex = Math.floor(Math.random() * REPLY_TEMPLATES.length);
    return REPLY_TEMPLATES[randomIndex];
  }

  /**
   * テンプレート内のプレースホルダーを置換
   * @param template - テンプレート文字列
   * @param post - ポスト情報
   * @returns 置換後の文字列
   */
  private replacePlaceholders(template: string, post: Post): string {
    let result = template;

    // {author} を実際の作成者名に置換
    result = result.replace(/{author}/g, post.author);

    // 将来的に他のプレースホルダーを追加可能
    // 例: {keyword}, {topic} など

    return result;
  }
}
