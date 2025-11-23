import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { Post, SearchOptions } from '../types/post';
import * as fs from 'fs';
import * as path from 'path';

const COOKIE_FILE_PATH = path.join(__dirname, '../../.cookies/x-cookies.json');

/**
 * X検索スクレイピングクラス
 */
export class XScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  /**
   * ブラウザを初期化
   * @param useCookies - 保存されたCookieを使用するか（デフォルト: true）
   * @param headless - ヘッドレスモードで起動するか（デフォルト: true）
   */
  async init(useCookies: boolean = true, headless: boolean = true): Promise<void> {
    this.browser = await chromium.launch({
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const contextOptions: any = {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
    };

    // Cookie保存ファイルが存在する場合は読み込む
    if (useCookies && fs.existsSync(COOKIE_FILE_PATH)) {
      console.log('保存されたCookieを読み込んでいます...');
      contextOptions.storageState = COOKIE_FILE_PATH;
    }

    this.context = await this.browser.newContext(contextOptions);
    this.page = await this.context.newPage();
  }

  /**
   * ログイン後のCookieを保存
   */
  async saveCookies(): Promise<void> {
    if (!this.context) {
      throw new Error('BrowserContext is not initialized.');
    }

    const cookieDir = path.dirname(COOKIE_FILE_PATH);
    if (!fs.existsSync(cookieDir)) {
      fs.mkdirSync(cookieDir, { recursive: true });
    }

    await this.context.storageState({ path: COOKIE_FILE_PATH });
    console.log(`Cookieを保存しました: ${COOKIE_FILE_PATH}`);
  }

  /**
   * X検索を実行してポストを取得
   */
  async searchPosts(options: SearchOptions): Promise<Post[]> {
    if (!this.page) {
      throw new Error('XScraper is not initialized. Call init() first.');
    }

    const { query, limit = 20, searchType = 'live' } = options;

    // X検索URL構築
    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}&f=${searchType}`;

    console.log(`X検索URL: ${searchUrl}`);

    // ページに移動
    try {
      await this.page.goto(searchUrl, {
        waitUntil: 'load',
        timeout: 60000,
      });

      // ページの読み込み待機
      await this.page.waitForTimeout(5000);
    } catch (error) {
      console.error('ページ読み込みエラー:', error);
      throw error;
    }

    // article要素（ポスト）を取得
    const articles = await this.page.$$('article[data-testid="tweet"]');
    console.log(`検出したポスト数: ${articles.length}`);

    // Step 1: 検索結果ページから基本情報を全て取得
    interface TempPost {
      text: string;
      author: string;
      authorHandle: string;
      url: string;
      timestamp: string;
    }

    const tempPosts: TempPost[] = [];

    for (let i = 0; i < Math.min(articles.length, limit); i++) {
      const article = articles[i];

      try {
        // ユーザー名抽出
        const userNameEl = await article.$('div[data-testid="User-Name"]');
        const userNameText = userNameEl ? await userNameEl.textContent() : '';

        // @handle部分を抽出
        const handleMatch = userNameText?.match(/@(\w+)/);
        const authorHandle = handleMatch ? handleMatch[1] : '';

        // 表示名を抽出（@より前の部分）
        const author = userNameText?.split('@')[0]?.trim() || '';

        // ポスト本文
        const tweetTextEl = await article.$('div[data-testid="tweetText"]');
        const text = tweetTextEl ? (await tweetTextEl.textContent()) || '' : '';

        // タイムスタンプ
        const timeEl = await article.$('time');
        const timestamp = timeEl ? (await timeEl.getAttribute('datetime')) || '' : '';

        // ポストURL
        const linkEl = await article.$('a[href*="/status/"]');
        const href = linkEl ? await linkEl.getAttribute('href') : '';
        const url = href ? `https://x.com${href}` : '';

        if (authorHandle) {
          tempPosts.push({
            text,
            author,
            authorHandle,
            url,
            timestamp,
          });
        }
      } catch (error) {
        console.error(`ポスト[${i}]の基本情報抽出エラー:`, error);
      }
    }

    console.log(`基本情報取得完了: ${tempPosts.length}件`);

    // Step 2: 各ユーザーのプロフィールを取得
    const posts: Post[] = [];

    for (let i = 0; i < tempPosts.length; i++) {
      const tempPost = tempPosts[i];

      try {
        console.log(`[${i + 1}/${tempPosts.length}] @${tempPost.authorHandle} のプロフィール取得中...`);

        const authorProfile = await this.getUserProfile(tempPost.authorHandle);

        posts.push({
          ...tempPost,
          authorHandle: `@${tempPost.authorHandle}`,
          authorProfile,
        });
      } catch (error) {
        console.error(`プロフィール取得エラー (@${tempPost.authorHandle}):`, error);
        // プロフィール取得に失敗してもポストは追加（プロフィールは空文字）
        posts.push({
          ...tempPost,
          authorHandle: `@${tempPost.authorHandle}`,
          authorProfile: '',
        });
      }
    }

    console.log(`取得完了: ${posts.length}件`);

    return posts;
  }

  /**
   * ユーザープロフィールを取得
   */
  private async getUserProfile(username: string): Promise<string> {
    if (!this.page) {
      return '';
    }

    try {
      const profileUrl = `https://x.com/${username}`;

      await this.page.goto(profileUrl, { waitUntil: 'load', timeout: 30000 });
      await this.page.waitForTimeout(2000);

      // プロフィール（自己紹介）を取得
      const bioEl = await this.page.$('div[data-testid="UserDescription"]');
      const bio = bioEl ? (await bioEl.textContent()) || '' : '';

      return bio;
    } catch (error) {
      console.error(`プロフィール取得エラー (@${username}):`, error);
      return '';
    }
  }

  /**
   * ブラウザを閉じる
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
