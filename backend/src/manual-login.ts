/**
 * 手動ログインスクリプト（初回のみ実行）
 *
 * 実行方法:
 * npx ts-node src/manual-login.ts
 *
 * 手順:
 * 1. ブラウザが起動します
 * 2. Xのログインページが開きます
 * 3. 手動でテストアカウントにログインしてください
 * 4. ログイン完了後、Enterキーを押してください
 * 5. Cookieが保存されます
 */

import { XScraper } from './services/xScraper';
import * as readline from 'readline';

async function manualLogin() {
  const scraper = new XScraper();

  try {
    console.log('=== X 手動ログインスクリプト ===\n');

    // Cookie読み込みなし＆ヘッドレスモード無効でブラウザ起動
    await scraper.init(false, false); // useCookies=false, headless=false

    console.log('ブラウザを起動しました。');
    console.log('X（Twitter）のログインページを開きます...\n');

    // Xのログインページを開く
    const page = (scraper as any).page;
    if (!page) {
      throw new Error('Page is not initialized');
    }
    await page.goto('https://x.com/login', { waitUntil: 'load' });

    console.log('【重要】');
    console.log('1. ブラウザ上で手動でログインしてください');
    console.log('2. ログイン完了後、このターミナルに戻ってください');
    console.log('3. Enterキーを押してCookieを保存してください\n');

    // ユーザー入力待機
    await waitForEnter();

    // Cookieを保存
    console.log('\nCookieを保存しています...');
    await scraper.saveCookies();

    console.log('\n=== ログイン完了 ===');
    console.log('次回から自動的にログイン状態で実行できます。');
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await scraper.close();
  }
}

function waitForEnter(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enterキーを押してください...', () => {
      rl.close();
      resolve();
    });
  });
}

manualLogin();
