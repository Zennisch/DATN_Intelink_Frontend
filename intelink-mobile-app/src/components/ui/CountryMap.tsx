import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, View, ActivityIndicator, Text, ScrollView } from 'react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import geoData from '../../assets/data/countries.geojson.json';

type StatisticsData = { name: string; clicks: number; percentage?: number };

type GeoFeature = {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: any };
  id?: string | number;
};

type GeoJSON = { type: 'FeatureCollection'; features: GeoFeature[] };

const countryCodeMapping: Record<string, string> = {
  UK: 'GB',
  VN: 'VN',
};

function equirectangular([lon, lat]: [number, number], width: number, height: number) {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

function buildPathForPolygon(coords: number[][][], width: number, height: number) {
  // coords: [ [ [lon,lat], [lon,lat], ... ] , [hole], ... ]
  let d = '';
  coords.forEach((ring) => {
    ring.forEach((pt, i) => {
      const [x, y] = equirectangular([pt[0], pt[1]], width, height);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    d += ' Z';
  });
  return d;
}

function quantizeColor(value: number, min: number, max: number, palette: string[]) {
  if (max <= min) return palette[0];
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const idx = Math.min(palette.length - 1, Math.floor(t * palette.length));
  return palette[idx];
}

export function CountryMap({ data, title = 'Visitors by Country', width, height }: { data: StatisticsData[]; title?: string; width?: number; height?: number }) {
  const screenWidth = Dimensions.get('window').width;
  const containerPad = 24;
  // Target width is capped and respects screen width; we'll allow horizontal scroll if needed
  const targetW = width ?? 720;
  const containerW = Math.max(280, screenWidth - containerPad);
  const W = Math.min(targetW, containerW);
  const H = height ?? Math.round((Math.max(W, containerW)) * 0.5);

  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    try {
      // Load GeoJSON data from local file
      const g = geoData as GeoJSON;
      if (mounted) { 
        setGeo(g); 
        setLoading(false); 
      }
    } catch (e: any) {
      if (mounted) { 
        setError(e.message || 'Failed to load map'); 
        setLoading(false); 
      }
    }
    console.log('CountryMap mounted, loading geo data');
    return () => { mounted = false; };
  }, []);

  const clicksByIso2 = useMemo(() => {
    const map = new Map<string, number>();
    (data || []).forEach(item => {
      const raw = (item.name || '').toUpperCase().trim();
      const code = countryCodeMapping[raw] || raw;
      if (!code) return;
      map.set(code, (map.get(code) || 0) + (item.clicks || 0));
    });
    // Ensure VN has at least 1 to match web behavior
    if (!map.has('VN')) map.set('VN', 1);
    else if ((map.get('VN') || 0) === 0) map.set('VN', 1);
    return map;
  }, [data]);

  const values = Array.from(clicksByIso2.values());
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const palette = ['#E8F5E9','#C8E6C9','#A5D6A7','#81C784','#66BB6A','#4CAF50','#43A047','#388E3C','#2E7D32','#1B5E20'];

  if (!data || data.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 border border-gray-200">
        <Text className="text-base font-semibold text-gray-900 mb-2">{title}</Text>
        <Text className="text-gray-500">No country data to display</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="bg-white rounded-lg p-4 border border-gray-200 items-center justify-center" style={{ height: H }}>
        <ActivityIndicator />
        <Text className="text-gray-500 mt-2">Loading map…</Text>
      </View>
    );
  }

  if (error || !geo) {
    return (
      <View className="bg-white rounded-lg p-4 border border-gray-200">
        <Text className="text-base font-semibold text-gray-900 mb-2">{title}</Text>
        <Text className="text-red-600">Error loading map: {error || 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg p-4 border border-gray-200">
      <Text className="text-base font-semibold text-gray-900 mb-2">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Svg width={Math.max(W, targetW)} height={H}>
        {geo.features.map((f, idx) => {
          const props = f.properties || {};
          const iso2 = (props['ISO3166-1-Alpha-2'] || props['ISO_A2'] || props['iso_a2'] || '').toString().toUpperCase();
          const clicks = clicksByIso2.get(iso2) || 0;
          const fill = clicks > 0 ? quantizeColor(clicks, min, max, palette) : '#F0F2F5';
          const geom = f.geometry;
          if (!geom) return null;
          if (geom.type === 'Polygon') {
            const d = buildPathForPolygon(geom.coordinates as number[][][], W, H);
            return <Path key={idx} d={d} fill={fill} stroke="#fff" strokeWidth={0.5} />
          } else if (geom.type === 'MultiPolygon') {
            return (geom.coordinates as number[][][][]).map((poly, i) => {
              const d = buildPathForPolygon(poly as unknown as number[][][], W, H);
              return <Path key={`${idx}-${i}`} d={d} fill={fill} stroke="#fff" strokeWidth={0.5} />
            });
          }
          return null;
        })}
        {/* Legend */}
        <Rect x={8} y={H - 28} width={Math.max(60, W - 16)} height={20} fill="#ffffffAA" rx={6} />
        {palette.map((c, i) => (
          <Rect key={i} x={16 + i * 18} y={H - 24} width={14} height={12} fill={c} stroke="#e5e7eb" />
        ))}
        <SvgText x={16 + palette.length * 18 + 6} y={H - 14} fill="#374151" fontSize="10">{`Min: ${min}  Max: ${max}`}</SvgText>
      </Svg>
      </ScrollView>
    </View>
  );
}
