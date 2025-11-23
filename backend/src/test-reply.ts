/**
 * リプライ文面生成テスト
 */
import { XScraper } from './services/xScraper';
import { PostSelector } from './services/postSelector';
import { ReplyGenerator } from './services/replyGenerator';

async function testReply() {
  const scraper = new XScraper();
  const selector = new PostSelector();
  const generator = new ReplyGenerator();

  try {
    console.log('=== リプライ文面生成テスト ===\n');

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
    const executivePosts = selector.selectExecutivePosts(allPosts, 10);

    console.log(`選定結果: ${executivePosts.length}件\n`);

    if (executivePosts.length === 0) {
      console.log('経営者のポストが選定されませんでした。');
      console.log('全ポストに対してリプライ生成を実行します。\n');
    }

    // 3. リプライ文面を生成
    const targetPosts = executivePosts.length > 0 ? executivePosts : allPosts.slice(0, 5);

    console.log('=== リプライ文面生成結果 ===\n');

    targetPosts.forEach((post, index) => {
      const reply = generator.generateReply(post);

      console.log(`[${index + 1}] ${post.author} (${post.authorHandle})`);
      console.log(`ポスト: ${post.text.substring(0, 100)}...`);
      console.log(`リプライ文面: ${reply}`);
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

testReply();
