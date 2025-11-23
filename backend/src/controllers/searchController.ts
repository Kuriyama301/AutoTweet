import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { XScraper } from '../services/xScraper';
import { PostSelector } from '../services/postSelector';
import { ReplyGenerator } from '../services/replyGenerator';
import { ProposalStore } from '../services/proposalStore';
import { SearchRequest, SearchResponse } from '../types/proposal';
import { Proposal } from '../types/proposal';

/**
 * 検索コントローラー
 */
export class SearchController {
  private xScraper: XScraper;
  private postSelector: PostSelector;
  private replyGenerator: ReplyGenerator;
  private proposalStore: ProposalStore;

  constructor() {
    this.xScraper = new XScraper();
    this.postSelector = new PostSelector();
    this.replyGenerator = new ReplyGenerator();
    this.proposalStore = new ProposalStore();
  }

  /**
   * X検索 → ポスト選定 → リプライ文面生成 → 提案保存
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit = 10 } = req.body as SearchRequest;

      // バリデーション
      if (!query || typeof query !== 'string' || query.trim() === '') {
        res.status(400).json({
          success: false,
          error: '検索クエリを入力してください',
        } as SearchResponse);
        return;
      }

      console.log(`🔍 検索開始: ${query}`);

      // 0. XScraperを初期化（Cookieを使用、ヘッドレスモード）
      await this.xScraper.init(true, true);

      // 1. X検索スクレイピング
      const allPosts = await this.xScraper.searchPosts({ query, limit: 20 });
      console.log(`✅ ${allPosts.length}件のポストを取得`);

      // 2. 経営者のポスト選定
      const selectedPosts = this.postSelector.selectExecutivePosts(allPosts, limit);
      console.log(`✅ ${selectedPosts.length}件のポストを選定`);

      // 3. ブラウザをクリーンアップ
      await this.xScraper.close();

      if (selectedPosts.length === 0) {
        res.status(200).json({
          success: true,
          proposals: [],
        } as SearchResponse);
        return;
      }

      // 4. リプライ文面生成 + 提案作成
      const proposals: Proposal[] = selectedPosts.map((post) => ({
        id: uuidv4(),
        post,
        replyText: this.replyGenerator.generateReply(post),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // 5. 提案を保存
      await this.proposalStore.add(proposals);
      console.log(`✅ ${proposals.length}件の提案を保存`);

      // 6. レスポンス返却
      res.status(200).json({
        success: true,
        proposals,
      } as SearchResponse);
    } catch (error) {
      console.error('検索エラー:', error);

      // エラー時もブラウザをクリーンアップ
      try {
        await this.xScraper.close();
      } catch (cleanupError) {
        console.error('クリーンアップエラー:', cleanupError);
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '検索処理中にエラーが発生しました',
      } as SearchResponse);
    }
  }

  /**
   * 全提案を取得
   */
  async getProposals(_req: Request, res: Response): Promise<void> {
    try {
      const proposals = await this.proposalStore.getAll();

      res.status(200).json({
        success: true,
        proposals,
      });
    } catch (error) {
      console.error('提案取得エラー:', error);

      res.status(500).json({
        success: false,
        error: '提案の取得に失敗しました',
      });
    }
  }

  /**
   * 提案を更新
   */
  async updateProposal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = await this.proposalStore.update(id, updates);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: '提案が見つかりませんでした',
        });
        return;
      }

      res.status(200).json({
        success: true,
        proposal: updated,
      });
    } catch (error) {
      console.error('提案更新エラー:', error);

      res.status(500).json({
        success: false,
        error: '提案の更新に失敗しました',
      });
    }
  }

  /**
   * 提案を削除
   */
  async deleteProposal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await this.proposalStore.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: '提案が見つかりませんでした',
        });
        return;
      }

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error('提案削除エラー:', error);

      res.status(500).json({
        success: false,
        error: '提案の削除に失敗しました',
      });
    }
  }

  /**
   * XScraperのクリーンアップ
   */
  async cleanup(): Promise<void> {
    await this.xScraper.close();
  }
}
