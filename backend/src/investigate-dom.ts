/**
 * X検索ページのDOM構造調査スクリプト
 */
import { XScraper } from './services/xScraper';

async function investigateDOM() {
  const scraper = new XScraper();

  try {
    console.log('=== X検索ページDOM構造調査 ===\n');

    await scraper.init();

    const page = (scraper as any).page;
    if (!page) {
      throw new Error('Page is not initialized');
    }

    // X検索ページにアクセス
    const searchUrl = 'https://x.com/search?q=受託開発&f=live';
    console.log(`アクセス中: ${searchUrl}\n`);

    await page.goto(searchUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000); // ページ読み込み待機

    // article要素（ポストの基本単位）を取得
    const articles = await page.$$('article[data-testid="tweet"]');
    console.log(`検出したarticle要素数: ${articles.length}\n`);

    if (articles.length === 0) {
      console.log('article要素が見つかりませんでした。');
      console.log('他のセレクタを試します...\n');

      // 代替セレクタ
      const divs = await page.$$('div[data-testid="cellInnerDiv"]');
      console.log(`cellInnerDiv数: ${divs.length}`);
    } else {
      // 最初のポストの詳細情報を調査
      console.log('=== 最初のポストの情報を抽出 ===\n');

      const firstArticle = articles[0];

      // ユーザー名
      const userNameEl = await firstArticle.$('div[data-testid="User-Name"]');
      const userName = userNameEl ? await userNameEl.textContent() : null;
      console.log(`ユーザー名要素: ${userName}`);

      // ポスト本文
      const tweetTextEl = await firstArticle.$('div[data-testid="tweetText"]');
      const tweetText = tweetTextEl ? await tweetTextEl.textContent() : null;
      console.log(`ポスト本文: ${tweetText}`);

      // タイムスタンプ
      const timeEl = await firstArticle.$('time');
      const timestamp = timeEl ? await timeEl.getAttribute('datetime') : null;
      console.log(`タイムスタンプ: ${timestamp}`);

      // リンク（ポストURL）
      const linkEl = await firstArticle.$('a[href*="/status/"]');
      const href = linkEl ? await linkEl.getAttribute('href') : null;
      console.log(`ポストURL: ${href ? 'https://x.com' + href : null}`);

      console.log('\n=== HTML構造（最初のarticle） ===');
      const html = await firstArticle.innerHTML();
      console.log(html.substring(0, 500) + '...\n'); // 最初の500文字のみ
    }
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await scraper.close();
  }
}

investigateDOM();
