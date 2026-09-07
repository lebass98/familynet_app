/**
 * 데이터 접근 레이어.
 * 지금은 목업을 비동기로 감싸 반환하며, 실제 패밀리넷 API가 열리면
 * 이 파일의 구현부만 fetch 호출로 교체하면 화면 코드는 그대로 유지됩니다.
 */
import { CENTERS, NOTIFICATIONS, PROGRAMS, SPACES, TIME_SLOTS, TOYS } from '@/mocks/data';
import type {
  AppNotification,
  CategoryId,
  Center,
  Program,
  Space,
  TimeSlot,
  Toy,
} from '@/types/domain';

/** 네트워크 지연 흉내 (실 API 교체 시 제거) */
function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface Coords {
  latitude: number;
  longitude: number;
}

/** 시연 기본 좌표: 서울 마포구 상암동 부근 */
export const FALLBACK_COORDS: Coords = { latitude: 37.5665, longitude: 126.9105 };

/**
 * 현재 위치 조회.
 * TODO(native): expo-location 설치 후 requestForegroundPermissionsAsync + getCurrentPositionAsync 로 교체.
 */
export async function getCurrentCoords(): Promise<Coords> {
  return delay(FALLBACK_COORDS, 350);
}

/** 두 좌표 사이 거리(km) — 하버사인 공식 */
export function distanceKm(a: Coords, b: Coords): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** 현재 위치 기준으로 가까운 순 정렬된 센터 목록 */
export async function getNearbyCenters(coords: Coords): Promise<Center[]> {
  const list = CENTERS.map((center) => ({
    ...center,
    distanceKm: distanceKm(coords, center),
  })).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return delay(list);
}

export async function getCenter(centerId: string): Promise<Center | undefined> {
  return delay(CENTERS.find((c) => c.id === centerId));
}

export function getCenterSync(centerId: string): Center | undefined {
  return CENTERS.find((c) => c.id === centerId);
}

export interface ProgramQuery {
  centerId?: string;
  categories?: CategoryId[];
  keyword?: string;
  /** 모집 중(open/almost-full)만 보기 */
  openOnly?: boolean;
}

export async function listPrograms(query: ProgramQuery = {}): Promise<Program[]> {
  const keyword = query.keyword?.trim().toLowerCase();
  const result = PROGRAMS.filter((program) => {
    if (query.centerId && program.centerId !== query.centerId) return false;
    if (query.categories?.length && !query.categories.includes(program.category)) return false;
    if (query.openOnly && program.status !== 'open' && program.status !== 'almost-full')
      return false;
    if (keyword) {
      const haystack = `${program.title} ${program.summary} ${program.target}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  }).sort((a, b) => a.applyEnd.localeCompare(b.applyEnd));
  return delay(result);
}

export function getProgramSync(programId: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === programId);
}

export async function getProgram(programId: string): Promise<Program | undefined> {
  return delay(getProgramSync(programId));
}

export async function listSpaces(centerId?: string): Promise<Space[]> {
  return delay(SPACES.filter((s) => !centerId || s.centerId === centerId));
}

export function getSpaceSync(spaceId: string): Space | undefined {
  return SPACES.find((s) => s.id === spaceId);
}

export async function listSlots(spaceId: string, date: string): Promise<TimeSlot[]> {
  return delay(TIME_SLOTS.filter((slot) => slot.spaceId === spaceId && slot.date === date));
}

export function getSlotSync(slotId: string): TimeSlot | undefined {
  return TIME_SLOTS.find((slot) => slot.id === slotId);
}

export async function listToys(centerId?: string): Promise<Toy[]> {
  return delay(TOYS.filter((toy) => !centerId || toy.centerId === centerId));
}

export function getToySync(toyId: string): Toy | undefined {
  return TOYS.find((toy) => toy.id === toyId);
}

export async function listNotifications(): Promise<AppNotification[]> {
  return delay(
    [...NOTIFICATIONS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    120
  );
}
