/**
 * 앱 전역 상태.
 * 신청·예약·패스 발급은 현재 메모리에만 기록됩니다.
 * TODO: 실제 연동 시 서버 상태 + 영속 저장(AsyncStorage/SecureStore)으로 승격.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import { NOTIFICATIONS, USER, isoDate } from '@/mocks/data';
import {
  FALLBACK_COORDS,
  getCenterSync,
  getCurrentCoords,
  getNearbyCenters,
  getProgramSync,
  getSlotSync,
  getSpaceSync,
  getToySync,
  type Coords,
} from '@/services/familynet';
import type {
  AppNotification,
  Application,
  CategoryId,
  Center,
  CounselingRequest,
  Emotion,
  LanguageCode,
  SmartPass,
  UserProfile,
} from '@/types/domain';

interface State {
  /** 위치 조회 상태 */
  locating: boolean;
  coords: Coords;
  /** 거리순 정렬된 센터 목록 */
  nearbyCenters: Center[];
  /** 현재 보고 있는 우리동네 센터 */
  selectedCenterId: string | null;
  favoriteCenterIds: string[];
  /** 관심 분야 키워드 (푸시 알림 대상) */
  interests: CategoryId[];
  pushEnabled: boolean;
  biometricEnabled: boolean;
  applications: Application[];
  passes: SmartPass[];
  notifications: AppNotification[];
  user: UserProfile;
  /** 다누리 다국어 UI 언어 */
  language: LanguageCode;
  /** 다문화 이지 모드(아이콘·큰 글씨) */
  easyMode: boolean;
  counselingRequests: CounselingRequest[];
  /** 오늘 기록한 마음 날씨 */
  emotion: Emotion | null;
  joinedGroupIds: string[];
}

type Action =
  | { type: 'locate/start' }
  | { type: 'locate/done'; coords: Coords; centers: Center[] }
  | { type: 'center/select'; centerId: string }
  | { type: 'center/toggleFavorite'; centerId: string }
  | { type: 'interest/toggle'; category: CategoryId }
  | { type: 'settings/push'; value: boolean }
  | { type: 'settings/biometric'; value: boolean }
  | { type: 'program/apply'; programId: string }
  | { type: 'program/cancel'; programId: string }
  | { type: 'pass/issue'; pass: SmartPass }
  | { type: 'pass/use'; passId: string }
  | { type: 'notification/read'; id: string }
  | { type: 'notification/readAll' }
  | { type: 'notification/push'; notification: AppNotification }
  | { type: 'settings/language'; value: LanguageCode }
  | { type: 'settings/easyMode'; value: boolean }
  | { type: 'counseling/request'; request: CounselingRequest }
  | { type: 'emotion/set'; value: Emotion }
  | { type: 'group/toggle'; groupId: string };

const initialState: State = {
  locating: true,
  coords: FALLBACK_COORDS,
  nearbyCenters: [],
  selectedCenterId: null,
  favoriteCenterIds: ['c-mapo'],
  interests: ['parent-edu', 'toy-rental'],
  pushEnabled: true,
  biometricEnabled: false,
  applications: [
    { id: 'a-seed-1', programId: 'p-002', appliedAt: `${isoDate(-1)}T10:20:00`, status: 'applied' },
  ],
  passes: [
    {
      id: 'pass-seed-1',
      kind: 'space',
      centerId: 'c-mapo',
      title: '마포 공동육아나눔터 2실 (유아)',
      subtitle: `${isoDate(1)} 10:00 - 12:00`,
      code: 'FN-SPACE-2601',
      issuedAt: `${isoDate(-1)}T17:30:00`,
      validUntil: `${isoDate(1)}T12:00:00`,
      status: 'active',
    },
  ],
  notifications: NOTIFICATIONS,
  user: USER,
  language: 'ko',
  easyMode: false,
  counselingRequests: [
    {
      id: 'cr-seed-1',
      counselorId: 'cs-001',
      mode: 'video',
      requestedAt: `${isoDate(-2)}T14:00:00`,
      status: 'confirmed',
    },
  ],
  emotion: 'anxious',
  joinedGroupIds: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'locate/start':
      return { ...state, locating: true };
    case 'locate/done':
      return {
        ...state,
        locating: false,
        coords: action.coords,
        nearbyCenters: action.centers,
        selectedCenterId: state.selectedCenterId ?? action.centers[0]?.id ?? null,
      };
    case 'center/select':
      return { ...state, selectedCenterId: action.centerId };
    case 'center/toggleFavorite': {
      const exists = state.favoriteCenterIds.includes(action.centerId);
      return {
        ...state,
        favoriteCenterIds: exists
          ? state.favoriteCenterIds.filter((id) => id !== action.centerId)
          : [...state.favoriteCenterIds, action.centerId],
      };
    }
    case 'interest/toggle': {
      const exists = state.interests.includes(action.category);
      return {
        ...state,
        interests: exists
          ? state.interests.filter((c) => c !== action.category)
          : [...state.interests, action.category],
      };
    }
    case 'settings/push':
      return { ...state, pushEnabled: action.value };
    case 'settings/biometric':
      return { ...state, biometricEnabled: action.value };
    case 'program/apply': {
      if (state.applications.some((a) => a.programId === action.programId && a.status !== 'cancelled'))
        return state;
      const program = getProgramSync(action.programId);
      const waiting = program ? program.applied >= program.capacity : false;
      return {
        ...state,
        applications: [
          ...state.applications,
          {
            id: `a-${Date.now()}`,
            programId: action.programId,
            appliedAt: new Date().toISOString(),
            status: waiting ? 'waiting' : 'applied',
          },
        ],
      };
    }
    case 'program/cancel':
      return {
        ...state,
        applications: state.applications.map((a) =>
          a.programId === action.programId ? { ...a, status: 'cancelled' } : a
        ),
      };
    case 'pass/issue':
      return { ...state, passes: [action.pass, ...state.passes] };
    case 'pass/use':
      return {
        ...state,
        passes: state.passes.map((p) => (p.id === action.passId ? { ...p, status: 'used' } : p)),
      };
    case 'notification/read':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      };
    case 'notification/readAll':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'notification/push':
      return { ...state, notifications: [action.notification, ...state.notifications] };
    case 'settings/language':
      return { ...state, language: action.value };
    case 'settings/easyMode':
      return { ...state, easyMode: action.value };
    case 'counseling/request':
      return { ...state, counselingRequests: [action.request, ...state.counselingRequests] };
    case 'emotion/set':
      return { ...state, emotion: action.value };
    case 'group/toggle': {
      const joined = state.joinedGroupIds.includes(action.groupId);
      return {
        ...state,
        joinedGroupIds: joined
          ? state.joinedGroupIds.filter((id) => id !== action.groupId)
          : [...state.joinedGroupIds, action.groupId],
      };
    }
    default:
      return state;
  }
}

function makeCode(prefix: string): string {
  return `FN-${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function useAppStoreValue() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /** 앱 진입 시 위치를 조회하고 가까운 센터를 정렬 */
  const locate = useCallback(async () => {
    dispatch({ type: 'locate/start' });
    const coords = await getCurrentCoords();
    const centers = await getNearbyCenters(coords);
    dispatch({ type: 'locate/done', coords, centers });
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  const selectedCenter = useMemo(
    () =>
      state.nearbyCenters.find((c) => c.id === state.selectedCenterId) ??
      (state.selectedCenterId ? getCenterSync(state.selectedCenterId) : undefined),
    [state.nearbyCenters, state.selectedCenterId]
  );

  const activeApplications = useMemo(
    () => state.applications.filter((a) => a.status !== 'cancelled'),
    [state.applications]
  );

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications]
  );

  const isApplied = useCallback(
    (programId: string) => activeApplications.some((a) => a.programId === programId),
    [activeApplications]
  );

  /** 공간 예약 확정 → QR 스마트패스 발급 */
  const reserveSlot = useCallback((slotId: string): SmartPass | undefined => {
    const slot = getSlotSync(slotId);
    const space = slot ? getSpaceSync(slot.spaceId) : undefined;
    if (!slot || !space) return undefined;
    const pass: SmartPass = {
      id: `pass-${Date.now()}`,
      kind: 'space',
      centerId: space.centerId,
      title: space.name,
      subtitle: `${slot.date} ${slot.start} - ${slot.end}`,
      code: makeCode('SPACE'),
      issuedAt: new Date().toISOString(),
      validUntil: `${slot.date}T${slot.end}:00`,
      status: 'active',
    };
    dispatch({ type: 'pass/issue', pass });
    dispatch({
      type: 'notification/push',
      notification: {
        id: `n-${Date.now()}`,
        kind: 'reservation',
        title: '예약이 확정되었습니다',
        body: `${space.name} · ${slot.date} ${slot.start} QR 패스가 발급되었습니다.`,
        createdAt: new Date().toISOString(),
        read: false,
        href: '/pass',
      },
    });
    return pass;
  }, []);

  /** 장난감 대여 신청 → QR 스마트패스 발급 */
  const rentToy = useCallback((toyId: string): SmartPass | undefined => {
    const toy = getToySync(toyId);
    if (!toy) return undefined;
    const due = new Date();
    due.setDate(due.getDate() + toy.rentalDays);
    const pass: SmartPass = {
      id: `pass-${Date.now()}`,
      kind: 'toy',
      centerId: toy.centerId,
      title: toy.name,
      subtitle: `반납 예정 ${due.toISOString().slice(0, 10)} (${toy.rentalDays}일)`,
      code: makeCode('TOY'),
      issuedAt: new Date().toISOString(),
      validUntil: due.toISOString(),
      status: 'active',
    };
    dispatch({ type: 'pass/issue', pass });
    return pass;
  }, []);

  /** 상담 예약 신청 → 알림 발송 */
  const requestCounseling = useCallback(
    (counselorId: string | null, mode: CounselingRequest['mode'], counselorName?: string) => {
      const request: CounselingRequest = {
        id: `cr-${Date.now()}`,
        counselorId,
        mode,
        requestedAt: new Date().toISOString(),
        status: 'requested',
      };
      dispatch({ type: 'counseling/request', request });
      dispatch({
        type: 'notification/push',
        notification: {
          id: `n-${Date.now()}`,
          kind: 'reservation',
          title: '상담 신청이 접수되었습니다',
          body: `${counselorName ?? '담당 상담사'} 배정 후 확정 일정을 알려드립니다. (${
            mode === 'chat' ? '비밀 채팅' : mode === 'video' ? '화상' : '센터 대면'
          })`,
          createdAt: new Date().toISOString(),
          read: false,
          href: '/counseling',
        },
      });
      return request;
    },
    []
  );

  return {
    ...state,
    selectedCenter,
    requestCounseling,
    activeApplications,
    unreadCount,
    isApplied,
    locate,
    reserveSlot,
    rentToy,
    selectCenter: (centerId: string) => dispatch({ type: 'center/select', centerId }),
    toggleFavorite: (centerId: string) => dispatch({ type: 'center/toggleFavorite', centerId }),
    toggleInterest: (category: CategoryId) => dispatch({ type: 'interest/toggle', category }),
    setPushEnabled: (value: boolean) => dispatch({ type: 'settings/push', value }),
    setBiometricEnabled: (value: boolean) => dispatch({ type: 'settings/biometric', value }),
    applyProgram: (programId: string) => dispatch({ type: 'program/apply', programId }),
    cancelApplication: (programId: string) => dispatch({ type: 'program/cancel', programId }),
    checkInPass: (passId: string) => dispatch({ type: 'pass/use', passId }),
    readNotification: (id: string) => dispatch({ type: 'notification/read', id }),
    readAllNotifications: () => dispatch({ type: 'notification/readAll' }),
    setLanguage: (value: LanguageCode) => dispatch({ type: 'settings/language', value }),
    setEasyMode: (value: boolean) => dispatch({ type: 'settings/easyMode', value }),
    setEmotion: (value: Emotion) => dispatch({ type: 'emotion/set', value }),
    toggleGroup: (groupId: string) => dispatch({ type: 'group/toggle', groupId }),
  };
}

type AppStore = ReturnType<typeof useAppStoreValue>;

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const value = useAppStoreValue();
  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error('useAppStore 는 AppStoreProvider 안에서만 사용할 수 있습니다.');
  return store;
}
