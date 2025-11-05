import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text as RNText } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Rect, Path } from 'react-native-svg';

export type LineDatum = { 
  time: string; 
  clicks: number;
  allows: number;
  blocks: number;
};

const LINE_COLORS = {
  clicks: '#3B82F6',  // blue
  allows: '#10B981',  // green
  blocks: '#EF4444',  // red
};

export function LineChart({ 
  data, 
  height = 280, 
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  maxLabelChars = 8,
  rotateLabels = false 
}: {
  data: LineDatum[];
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  maxLabelChars?: number;
  rotateLabels?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Calculate dimensions
  const yAxisWidth = showYAxis ? 13 : 0;
  const xAxisHeight = showXAxis ? (rotateLabels ? 44 : 32) : 0;
  const topPad = 30;
  const rightPad = 10;
  const bottomPad = 10;
  const chartHeight = height - xAxisHeight - topPad - bottomPad;
  const pointWidth = 60; // width per data point
  const chartWidth = Math.max(data.length * pointWidth, 320);
  
  // Find max value across all series
  const maxValue = useMemo(() => {
    if (data.length === 0) return 100;
    const allValues = data.flatMap(d => [d.clicks, d.allows, d.blocks]);
    return Math.max(...allValues, 1);
  }, [data]);
  
  // Calculate Y scale with nice round numbers
  const yScale = useMemo(() => {
    const steps = 5;
    const stepValue = Math.ceil(maxValue / steps);
    return Array.from({ length: steps + 1 }, (_, i) => i * stepValue);
  }, [maxValue]);
  
  // Convert value to Y coordinate
  const valueToY = (value: number) => {
    return topPad + chartHeight - (value / maxValue) * chartHeight;
  };
  
  // Convert index to X coordinate
  const indexToX = (index: number) => {
    return yAxisWidth + (index * pointWidth) + (pointWidth / 2);
  };
  
  // Format labels
  const labels = useMemo(() => 
    data.map(d => (d.time.length > maxLabelChars ? `${d.time.slice(0, maxLabelChars)}…` : d.time)), 
    [data, maxLabelChars]
  );
  
  // Generate path for a line
  const generatePath = (values: number[]) => {
    if (values.length === 0) return '';
    
    let path = `M ${indexToX(0)} ${valueToY(values[0])}`;
    for (let i = 1; i < values.length; i++) {
      path += ` L ${indexToX(i)} ${valueToY(values[i])}`;
    }
    return path;
  };
  
  const clicksPath = generatePath(data.map(d => d.clicks));
  const allowsPath = generatePath(data.map(d => d.allows));
  const blocksPath = generatePath(data.map(d => d.blocks));
  
  return (
    <View style={{ width: '100%' }}>
      {/* Legend */}
      <View className="flex-row justify-center items-center mb-2 space-x-4">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: LINE_COLORS.clicks }} />
          <RNText className="text-xs text-gray-700">Clicks</RNText>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: LINE_COLORS.allows }} />
          <RNText className="text-xs text-gray-700">Allows</RNText>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: LINE_COLORS.blocks }} />
          <RNText className="text-xs text-gray-700">Blocks</RNText>
        </View>
      </View>
      
      {/* Chart */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator 
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <Svg width={chartWidth + yAxisWidth + rightPad} height={height}>
          {/* Y Axis Labels */}
          {showYAxis && yScale.map((value, i) => {
            const y = valueToY(value);
            return (
              <React.Fragment key={`y-${i}`}>
                <SvgText
                  x={yAxisWidth - 8}
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="end"
                >
                  {value}
                </SvgText>
                {showGrid && (
                  <Line
                    x1={yAxisWidth}
                    y1={y}
                    x2={chartWidth + yAxisWidth}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                )}
              </React.Fragment>
            );
          })}
          
          {/* Grid lines (vertical) */}
          {showGrid && data.map((_, i) => {
            const x = indexToX(i);
            return (
              <Line
                key={`grid-v-${i}`}
                x1={x}
                y1={topPad}
                x2={x}
                y2={topPad + chartHeight}
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Draw lines */}
          <Path
            d={clicksPath}
            stroke={LINE_COLORS.clicks}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={allowsPath}
            stroke={LINE_COLORS.allows}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={blocksPath}
            stroke={LINE_COLORS.blocks}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Draw points and handle touches */}
          {data.map((d, i) => {
            const x = indexToX(i);
            const isSelected = selectedIndex === i;
            
            return (
              <React.Fragment key={`points-${i}`}>
                {/* Invisible touch area */}
                <Rect
                  x={x - pointWidth / 2}
                  y={topPad}
                  width={pointWidth}
                  height={chartHeight}
                  fill="transparent"
                  onPressIn={() => setSelectedIndex(i)}
                  onPressOut={() => setSelectedIndex(null)}
                />
                
                {/* Points */}
                <Circle
                  cx={x}
                  cy={valueToY(d.clicks)}
                  r={isSelected ? 6 : 4}
                  fill={LINE_COLORS.clicks}
                  stroke="#fff"
                  strokeWidth={isSelected ? 2 : 1}
                />
                <Circle
                  cx={x}
                  cy={valueToY(d.allows)}
                  r={isSelected ? 6 : 4}
                  fill={LINE_COLORS.allows}
                  stroke="#fff"
                  strokeWidth={isSelected ? 2 : 1}
                />
                <Circle
                  cx={x}
                  cy={valueToY(d.blocks)}
                  r={isSelected ? 6 : 4}
                  fill={LINE_COLORS.blocks}
                  stroke="#fff"
                  strokeWidth={isSelected ? 2 : 1}
                />
                
                {/* X Axis Labels */}
                {showXAxis && (
                  <SvgText
                    x={x}
                    y={topPad + chartHeight + (rotateLabels ? 26 : 18)}
                    fill="#6B7280"
                    fontSize="9"
                    textAnchor="middle"
                    transform={rotateLabels ? `rotate(-45 ${x},${topPad + chartHeight + 18})` : undefined}
                  >
                    {labels[i]}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
      
      {/* Selected point info */}
      {selectedIndex !== null && (
        <View className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <RNText className="text-xs font-semibold text-gray-900 mb-2">
            {data[selectedIndex].time}
          </RNText>
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: LINE_COLORS.clicks }} />
              <RNText className="text-xs text-gray-700">
                Clicks: <RNText className="font-semibold">{data[selectedIndex].clicks}</RNText>
              </RNText>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: LINE_COLORS.allows }} />
              <RNText className="text-xs text-gray-700">
                Allows: <RNText className="font-semibold">{data[selectedIndex].allows}</RNText>
              </RNText>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: LINE_COLORS.blocks }} />
              <RNText className="text-xs text-gray-700">
                Blocks: <RNText className="font-semibold">{data[selectedIndex].blocks}</RNText>
              </RNText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
