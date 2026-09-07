import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CapacityBar } from '@/components/ui/progress';
import { CATEGORIES } from '@/mocks/data';
import { getCenterSync } from '@/services/familynet';
import type { Program } from '@/types/domain';
import { deadlineLabel, formatFee } from '@/utils/format';

const TONE_BY_STATUS = {
  upcoming: 'brand',
  open: 'success',
  'almost-full': 'accent',
  closed: 'neutral',
} as const;

const STATUS_TEXT = {
  upcoming: '접수예정',
  open: '모집중',
  'almost-full': '마감임박',
  closed: '접수마감',
} as const;

const ACCENT_BY_TONE = {
  brand: 'bg-brand',
  accent: 'bg-accent',
  success: 'bg-success',
} as const;

export function ProgramCard({
  program,
  onPress,
  showCenter = true,
}: {
  program: Program;
  onPress: () => void;
  showCenter?: boolean;
}) {
  const category = CATEGORIES.find((c) => c.id === program.category);
  const center = getCenterSync(program.centerId);
  const closed = program.status === 'closed';

  return (
    <Card onPress={onPress} accent={ACCENT_BY_TONE[category?.tone ?? 'brand']}>
      <View className="flex-row items-center gap-xxs">
        <Badge label={STATUS_TEXT[program.status]} tone={TONE_BY_STATUS[program.status]} />
        {category ? <Badge label={category.label} tone="neutral" /> : null}
        <View className="flex-1" />
        <Text
          className={`text-label-sm font-bold ${closed ? 'text-subtle' : 'text-accent'}`}>
          {deadlineLabel(program.applyEnd)}
        </Text>
      </View>

      <Text numberOfLines={2} className="mt-xs text-title-lg font-semibold text-ink">
        {program.title}
      </Text>
      <Text numberOfLines={1} className="mt-xxs text-body-sm text-muted">
        {program.summary}
      </Text>

      <View className="mt-xs flex-row flex-wrap items-center gap-x-xs">
        {showCenter && center ? (
          <>
            <Text className="text-label-sm text-subtle">{center.name}</Text>
            <Text className="text-label-sm text-subtle">·</Text>
          </>
        ) : null}
        <Text className="text-label-sm text-subtle">{formatFee(program.fee)}</Text>
        <Text className="text-label-sm text-subtle">·</Text>
        <Text className="text-label-sm text-subtle">{program.place}</Text>
      </View>

      <View className="mt-xs">
        <CapacityBar applied={program.applied} capacity={program.capacity} />
      </View>
    </Card>
  );
}
