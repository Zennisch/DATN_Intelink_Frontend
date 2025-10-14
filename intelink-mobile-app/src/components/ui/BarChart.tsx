import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

export type BarDatum = { label: string; value: number };

export function BarChart({ data, height = 200, barColor = '#3B82F6', gap = 12, barWidth = 20, showValues = true, showXAxis = true, maxLabelChars = 8, rotateLabels = false, onBarPress }: {
  data: BarDatum[];
  height?: number;
  barColor?: string;
  gap?: number;
  barWidth?: number;
  showValues?: boolean;
  showXAxis?: boolean;
  maxLabelChars?: number;
  rotateLabels?: boolean;
  onBarPress?: (d: BarDatum, index: number) => void;
}) {
  const max = Math.max(1, ...data.map(d => d.value));
  const xAxisHeight = showXAxis ? 32 : 0;
  const topPad = showValues ? 12 : 4;
  const chartHeight = height - xAxisHeight;
  const width = data.length * (barWidth + gap) + gap;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const yValue = (v: number) => Math.max(1, Math.round((v / max) * (chartHeight - topPad)));
  const labels = useMemo(() => data.map(d => (d.label.length > maxLabelChars ? `${d.label.slice(0, maxLabelChars)}…` : d.label)), [data, maxLabelChars]);

  return (
    <View style={{ width: '100%' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingHorizontal: 4 }}>
        <Svg width={Math.max(width, 0)} height={chartHeight + xAxisHeight}>
          {data.map((d, i) => {
            const h = yValue(d.value);
            const x = gap + i * (barWidth + gap);
            const y = chartHeight - h;
            const label = labels[i];
            return (
              <React.Fragment key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill={barColor}
                  rx={4}
                  onPressIn={() => {
                    setHoverIndex(i);
                    onBarPress?.(d, i);
                  }}
                  onPressOut={() => setHoverIndex(null)}
                />
                {(showValues || hoverIndex === i) && (
                  <SvgText x={x + barWidth / 2} y={y - 4} fill="#111827" fontSize="11" fontWeight="600" textAnchor="middle">
                    {d.value}
                  </SvgText>
                )}
                {showXAxis && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight + (rotateLabels ? 26 : 18)}
                    fill="#6B7280"
                    fontSize="9"
                    textAnchor="middle"
                    transform={rotateLabels ? `rotate(-45 ${x + barWidth / 2},${chartHeight + 18})` : undefined}
                  >
                    {label}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
}
