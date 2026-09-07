/** 패밀리넷 앱 도메인 모델. 실제 API 연동 시 이 타입을 계약으로 사용합니다. */
import type { Href } from 'expo-router';

/** 프로그램/관심 분야 카테고리 */
export type CategoryId =
  | 'parent-edu'
  | 'family-culture'
  | 'multicultural'
  | 'toy-rental'
  | 'care-share'
  | 'counseling';

export interface Category {
  id: CategoryId;
  label: string;
  /** 카테고리 강조색 (DESIGN.md 팔레트 내에서 선택) */
  tone: 'brand' | 'accent' | 'success';
}

export interface Center {
  id: string;
  name: string;
  /** 시·도 / 시·군·구 */
  region: string;
  district: string;
  address: string;
  tel: string;
  latitude: number;
  longitude: number;
  /** 현재 위치 기준 거리(km). 서비스 레이어에서 계산해 채웁니다. */
  distanceKm?: number;
  /** 센터가 운영하는 부가 시설 */
  facilities: ('care-share' | 'toy-library' | 'counseling')[];
  openHours: string;
}

export type ProgramStatus = 'upcoming' | 'open' | 'almost-full' | 'closed';

export interface Program {
  id: string;
  centerId: string;
  title: string;
  category: CategoryId;
  summary: string;
  description: string;
  /** 모집 시작/종료 (ISO 8601 날짜) */
  applyStart: string;
  applyEnd: string;
  /** 운영 기간 안내 문구 */
  schedule: string;
  place: string;
  capacity: number;
  applied: number;
  fee: number;
  target: string;
  status: ProgramStatus;
}

export interface Application {
  id: string;
  programId: string;
  appliedAt: string;
  status: 'applied' | 'waiting' | 'cancelled';
}

/** 공동육아나눔터 등 예약 가능한 공간 */
export interface Space {
  id: string;
  centerId: string;
  name: string;
  kind: 'care-share' | 'toy-library';
  capacity: number;
  description: string;
}

export interface TimeSlot {
  id: string;
  spaceId: string;
  /** ISO 날짜 (YYYY-MM-DD) */
  date: string;
  start: string;
  end: string;
  remaining: number;
  capacity: number;
}

export type ToyCondition = 'available' | 'rented' | 'repair';

export interface Toy {
  id: string;
  centerId: string;
  name: string;
  ageRange: string;
  category: string;
  total: number;
  available: number;
  condition: ToyCondition;
  /** 대여 기간(일) */
  rentalDays: number;
}

export type PassKind = 'space' | 'toy';
export type PassStatus = 'active' | 'used' | 'expired';

/** QR 스마트패스 — 예약/대여 확정 시 발급 */
export interface SmartPass {
  id: string;
  kind: PassKind;
  centerId: string;
  title: string;
  subtitle: string;
  /** 현장 키오스크에 태깅되는 코드 값 */
  code: string;
  issuedAt: string;
  validUntil: string;
  status: PassStatus;
}

export type NotificationKind = 'program-open' | 'deadline' | 'reservation' | 'notice';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  /** 연결되는 앱 내부 경로 */
  href?: Href;
}

/** 앱 사용자(시연용 고정 회원) */
export interface UserProfile {
  name: string;
  memberNo: string;
  /** 가구원 수 */
  householdSize: number;
  memberType: '정회원' | '일반회원';
  validUntil: string;
}

/** 가족상담 분야 */
export type CounselingField = 'couple' | 'parenting' | 'single-multi';

export interface Counselor {
  id: string;
  centerId: string;
  name: string;
  license: string;
  rating: number;
  sessions: number;
  specialty: string;
  fields: CounselingField[];
  /** 제공 방식 */
  modes: ('chat' | 'video' | 'visit')[];
  availableToday: boolean;
  note?: string;
}

export interface CounselingRequest {
  id: string;
  counselorId: string | null;
  mode: 'chat' | 'video' | 'visit';
  requestedAt: string;
  status: 'requested' | 'confirmed';
}

/** 마음 날씨(감정 다이어리) */
export type Emotion = 'peace' | 'tired' | 'anxious' | 'gratitude';

/** 육아 품앗이 모임 */
export interface PumasiGroup {
  id: string;
  centerId: string;
  area: string;
  title: string;
  schedule: string;
  members: number;
  capacity: number;
  initials: string[];
}

/** 다문화 진행 중 맞춤 서비스 */
export interface MulticulturalService {
  id: string;
  kind: 'language-dev' | 'korean-class';
  tag: string;
  title: string;
  subtitle: string;
  nextSession?: string;
  place?: string;
  progressDone?: number;
  progressTotal?: number;
}

export type LanguageCode = 'ko' | 'en' | 'vi' | 'zh' | 'fil' | 'ru' | 'th' | 'ja';

export interface Language {
  code: LanguageCode;
  flag: string;
  label: string;
}
