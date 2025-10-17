import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

export type PieDatum = { label: string; value: number; color?: string };

// Simple pie chart for small datasets
export function PieChart({ data, size = 220, colors }: { data: PieDatum[]; size?: number; colors?: string[] }) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0) || 1, [data]);
  const radius = size / 2;
  let angle = 0;
  const palette = colors || [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#06B6D4', '#22C55E', '#EAB308'
  ];
  const [active, setActive] = useState<number | null>(null);
  const segments = data.map((d, i) => {
    const portion = d.value / total;
    const startAngle = angle;
    const endAngle = angle + portion * Math.PI * 2;
    angle = endAngle;
    const largeArc = portion > 0.5 ? 1 : 0;
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);
    const dpath = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { d: dpath, color: d.color || palette[i % palette.length], midAngle: (startAngle + endAngle) / 2, value: d.value, label: d.label, portion };
  });

  return (
    <View>
      <Svg width={size} height={size}>
        {segments.map((s, i) => (
          <Path key={i} d={s.d} fill={s.color} opacity={active === null || active === i ? 1 : 0.5} onPressIn={() => setActive(i)} />
        ))}
        {/* Labels on slices */}
        {segments.map((s, i) => {
          if (s.portion < 0.06) return null; // skip tiny labels
          const lx = radius + (radius * 0.6) * Math.cos(s.midAngle);
          const ly = radius + (radius * 0.6) * Math.sin(s.midAngle);
          const pct = Math.round((s.value / total) * 100);
          return (
            <SvgText key={`lbl-${i}`} x={lx} y={ly} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
              {`${s.label} ${pct}%`}
            </SvgText>
          );
        })}
        {/* Center info */}
        <SvgText x={radius} y={radius - 6} textAnchor="middle" fill="#374151" fontSize="12">
          {active === null ? 'Total' : data[active]?.label}
        </SvgText>
        <SvgText x={radius} y={radius + 12} textAnchor="middle" fill="#111827" fontSize="14" fontWeight="700">
          {active === null ? `${total} clicks` : `${data[active]?.value || 0} (${Math.round(((data[active]?.value || 0) / total) * 100)}%)`}
        </SvgText>
      </Svg>
    </View>
  );
}
