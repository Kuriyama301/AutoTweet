import { Router } from 'express';
import { SearchController } from '../controllers/searchController';

const router = Router();
const searchController = new SearchController();

/**
 * POST /api/search
 * X検索 → ポスト選定 → リプライ文面生成
 */
router.post('/search', (req, res) => searchController.search(req, res));

/**
 * GET /api/proposals
 * 全提案を取得
 */
router.get('/proposals', (req, res) => searchController.getProposals(req, res));

/**
 * PATCH /api/proposals/:id
 * 提案を更新
 */
router.patch('/proposals/:id', (req, res) => searchController.updateProposal(req, res));

/**
 * DELETE /api/proposals/:id
 * 提案を削除
 */
router.delete('/proposals/:id', (req, res) => searchController.deleteProposal(req, res));

export default router;
