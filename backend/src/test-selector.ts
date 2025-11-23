/**
 * ポスト選定ロジックテスト
 */
import { XScraper } from './services/xScraper';
import { PostSelector } from './services/postSelector';

async function testSelector() {
  const scraper = new XScraper();
  const selector = new PostSelector();

  try {
    console.log('=== ポスト選定ロジックテスト ===\n');

    // 1. X検索スクレイピング実行
    await scraper.init();

    console.log('X検索を実行中...\n');

    const allPosts = await scraper.searchPosts({
      query: '受託開発',
      limit: 50,
      searchType: 'live',
    });

    console.log(`検索結果: ${allPosts.length}件\n`);

    // 2. 経営者のポストを選定
    console.log('=== 経営者のポスト選定中 ===\n');

    const executivePosts = selector.selectExecutivePosts(allPosts, 10);

    console.log(`選定結果: ${executivePosts.length}件\n`);

    // デバッグ: 全ポストのプロフィールを表示
    console.log('=== 全ポストのプロフィール（デバッグ） ===\n');
    allPosts.forEach((post, index) => {
      console.log(`[${index + 1}] ${post.author} (${post.authorHandle})`);
      console.log(`プロフィール: ${post.authorProfile || '(なし)'}`);
      console.log('');
    });

    // 3. 選定結果を表示
    console.log('=== 選定されたポスト ===\n');

    executivePosts.forEach((post, index) => {
      console.log(`[${index + 1}] ${post.author} (${post.authorHandle})`);
      console.log(`プロフィール: ${post.authorProfile || '(なし)'}`);
      console.log(`本文: ${post.text.substring(0, 100)}...`);
      console.log(`URL: ${post.url}`);
      console.log('');
    });

    console.log('=== テスト完了 ===');
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await scraper.close();
  }
}

testSelector();
