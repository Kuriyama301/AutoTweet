/**
 * ユーザープロフィール取得テスト
 */
import { XScraper } from './services/xScraper';

async function testProfile() {
  const scraper = new XScraper();

  try {
    console.log('=== ユーザープロフィール取得テスト ===\n');

    await scraper.init();

    const page = (scraper as any).page;
    if (!page) {
      throw new Error('Page is not initialized');
    }

    // テスト用のユーザー（検索結果から取得したユーザー名）
    const testUsername = 'yako_yoga326'; // 検索結果の最初のユーザー

    const profileUrl = `https://x.com/${testUsername}`;
    console.log(`プロフィールページにアクセス: ${profileUrl}\n`);

    await page.goto(profileUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);

    // プロフィール情報を取得
    // 表示名
    const displayNameEl = await page.$('div[data-testid="UserName"]');
    const displayName = displayNameEl ? await displayNameEl.textContent() : null;
    console.log(`表示名: ${displayName}`);

    // ユーザー名（@handle）
    const handleEl = await page.$('div[data-testid="UserName"] span:has-text("@")');
    const handle = handleEl ? await handleEl.textContent() : null;
    console.log(`ハンドル: ${handle}`);

    // プロフィール（自己紹介）
    const bioEl = await page.$('div[data-testid="UserDescription"]');
    const bio = bioEl ? await bioEl.textContent() : null;
    console.log(`プロフィール: ${bio}`);

    // フォロワー数など
    const followersEl = await page.$('a[href$="/verified_followers"] span span');
    const followers = followersEl ? await followersEl.textContent() : null;
    console.log(`フォロワー数: ${followers}`);

    console.log('\n=== 取得成功 ===');

    // スクリーンショット保存
    await page.screenshot({ path: '/app/debug-profile.png' });
    console.log('スクリーンショット保存: /app/debug-profile.png');
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await scraper.close();
  }
}

testProfile();
