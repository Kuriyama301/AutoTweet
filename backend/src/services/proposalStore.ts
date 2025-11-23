import fs from 'fs/promises';
import path from 'path';
import { Proposal } from '../types/proposal';

/**
 * 提案データの永続化管理サービス
 */
export class ProposalStore {
  private readonly storePath: string;

  constructor(storePath: string = path.join(__dirname, '../../.data/proposals.json')) {
    this.storePath = storePath;
  }

  /**
   * 全提案を取得
   */
  async getAll(): Promise<Proposal[]> {
    try {
      await this.ensureStoreExists();
      const data = await fs.readFile(this.storePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read proposals:', error);
      return [];
    }
  }

  /**
   * 提案を保存
   */
  async save(proposals: Proposal[]): Promise<void> {
    try {
      await this.ensureStoreExists();
      await fs.writeFile(this.storePath, JSON.stringify(proposals, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save proposals:', error);
      throw new Error('提案の保存に失敗しました');
    }
  }

  /**
   * 提案を追加
   */
  async add(proposals: Proposal[]): Promise<void> {
    const existing = await this.getAll();
    const updated = [...existing, ...proposals];
    await this.save(updated);
  }

  /**
   * 提案を更新
   */
  async update(id: string, updates: Partial<Proposal>): Promise<Proposal | null> {
    const proposals = await this.getAll();
    const index = proposals.findIndex((p) => p.id === id);

    if (index === -1) {
      return null;
    }

    proposals[index] = {
      ...proposals[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.save(proposals);
    return proposals[index];
  }

  /**
   * 提案を削除
   */
  async delete(id: string): Promise<boolean> {
    const proposals = await this.getAll();
    const filtered = proposals.filter((p) => p.id !== id);

    if (filtered.length === proposals.length) {
      return false;
    }

    await this.save(filtered);
    return true;
  }

  /**
   * ストレージファイルが存在しない場合は作成
   */
  private async ensureStoreExists(): Promise<void> {
    try {
      await fs.access(this.storePath);
    } catch {
      // ディレクトリを作成
      const dir = path.dirname(this.storePath);
      await fs.mkdir(dir, { recursive: true });

      // 空の配列で初期化
      await fs.writeFile(this.storePath, JSON.stringify([]), 'utf-8');
    }
  }
}
