import { SearchRequest, SearchResponse, Proposal } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * X検索 → ポスト選定 → リプライ文面生成
 */
export async function searchPosts(request: SearchRequest): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '検索に失敗しました');
  }

  return response.json();
}

/**
 * 全提案を取得
 */
export async function getProposals(): Promise<Proposal[]> {
  const response = await fetch(`${API_BASE_URL}/api/proposals`);

  if (!response.ok) {
    throw new Error('提案の取得に失敗しました');
  }

  const data = await response.json();
  return data.proposals;
}

/**
 * 提案を更新
 */
export async function updateProposal(
  id: string,
  updates: Partial<Proposal>
): Promise<Proposal> {
  const response = await fetch(`${API_BASE_URL}/api/proposals/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('提案の更新に失敗しました');
  }

  const data = await response.json();
  return data.proposal;
}

/**
 * 提案を削除
 */
export async function deleteProposal(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/proposals/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('提案の削除に失敗しました');
  }
}

/**
 * 提案を実行（リプライ投稿 + いいね）
 */
export async function executeProposal(id: string): Promise<Proposal> {
  const response = await fetch(`${API_BASE_URL}/api/proposals/${id}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '提案の実行に失敗しました');
  }

  const data = await response.json();
  return data.proposal;
}
