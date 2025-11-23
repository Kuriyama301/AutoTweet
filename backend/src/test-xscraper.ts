import { XScraper } from './services/xScraper';

async function testXScraper() {
  const scraper = new XScraper();

  try {
    console.log('XScraper 初期化中...');
    await scraper.init();

    console.log('X検索実行中...');
    const posts = await scraper.searchPosts({
      query: '受託開発',
      limit: 10,
      searchType: 'live',
    });

    console.log(`取得したポスト数: ${posts.length}`);

    if (posts.length > 0) {
      console.log('\n--- 最初のポスト ---');
      console.log(JSON.stringify(posts[0], null, 2));
    } else {
      console.log('\nポストが取得できませんでした。DOM構造の調査が必要です。');
    }
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    console.log('\nブラウザを閉じています...');
    await scraper.close();
    console.log('完了');
  }
}

testXScraper();
