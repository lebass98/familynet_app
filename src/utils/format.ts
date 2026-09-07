/** 화면 표기용 포맷 유틸 */
import type { ProgramStatus } from '@/types/domain';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** '2026-09-16' -> '9월 16일 (수)' */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

/** '2026-09-16' -> '9.16' */
export function formatShortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

/** ISO 일시 -> '오늘 09:00' / '어제' / '9월 3일' */
export function formatRelative(isoDateTime: string): string {
  const target = new Date(isoDateTime);
  const now = new Date();
  const days = Math.round(
    (startOfDay(now).getTime() - startOfDay(target).getTime()) / 86400000
  );
  const time = `${String(target.getHours()).padStart(2, '0')}:${String(
    target.getMinutes()
  ).padStart(2, '0')}`;
  if (days === 0) return `오늘 ${time}`;
  if (days === 1) return `어제 ${time}`;
  if (days < 7) return `${days}일 전`;
  return `${target.getMonth() + 1}월 ${target.getDate()}일`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** 마감까지 남은 일수 (오늘 마감이면 0, 이미 지났으면 음수) */
export function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((startOfDay(target).getTime() - startOfDay(new Date()).getTime()) / 86400000);
}

/** 마감 배지 문구 */
export function deadlineLabel(iso: string): string {
  const d = daysUntil(iso);
  if (d < 0) return '접수 마감';
  if (d === 0) return '오늘 마감';
  if (d === 1) return '내일 마감';
  return `D-${d}`;
}

export function formatFee(fee: number): string {
  return fee === 0 ? '무료' : `${fee.toLocaleString('ko-KR')}원`;
}

export function formatDistance(km?: number): string {
  if (km == null) return '';
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

export const STATUS_LABEL: Record<ProgramStatus, string> = {
  upcoming: '접수예정',
  open: '모집중',
  'almost-full': '마감임박',
  closed: '접수마감',
};

/** 상태별 배지 색상 (DESIGN.md Status Chips 규칙) */
export const STATUS_STYLE: Record<ProgramStatus, { bg: string; text: string }> = {
  upcoming: { bg: 'bg-brand-soft', text: 'text-brand' },
  open: { bg: 'bg-success-soft', text: 'text-success' },
  'almost-full': { bg: 'bg-accent-soft', text: 'text-accent' },
  closed: { bg: 'bg-ice', text: 'text-subtle' },
};
