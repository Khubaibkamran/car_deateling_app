import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { PlusFilledIcon, SearchIcon, StarSolidIcon } from '../../components/extraIcons';
import FadeIn from '../../components/FadeIn';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { SERVICE_CATEGORIES, ServiceItem, SERVICES } from '../../data/services';

const NAV_HEIGHT = 100;

function ServiceCard({ service, onAdd }: { service: ServiceItem; onAdd: () => void }) {
  return (
    <View style={styles.card}>
      <Image source={service.image} style={styles.thumb} resizeMode="cover" />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>
          <View style={styles.rating}>
            <StarSolidIcon />
            <Text style={styles.ratingText}>{service.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        <Text style={styles.price}>
          <Text style={styles.from}>from</Text> ${service.from.toFixed(2)}
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.add, pressed && styles.addPressed]}
        onPress={onAdd}
        hitSlop={8}
        accessibilityLabel={`Book ${service.name}`}
      >
        <PlusFilledIcon />
      </Pressable>
    </View>
  );
}

type Props = {
  onBookService?: (service: ServiceItem) => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  /** Unread notifications shown on the bell. */
  notifications?: number;
};

// Main tab: browse, search and filter the service catalogue.
export default function ServicesScreen({ onBookService, onMenuPress, onNotificationsPress, notifications }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof SERVICE_CATEGORIES)[number]>('All Services');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter(
      (s) =>
        (category === 'All Services' || s.category === category) &&
        (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
    );
  }, [query, category]);

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <FadeIn delay={150} style={styles.searchWrap}>
        <View style={styles.search}>
          <SearchIcon />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search services...."
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.primary}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={12} accessibilityLabel="Clear search">
              <Text style={styles.clear}>✕</Text>
            </Pressable>
          )}
        </View>
      </FadeIn>

      <FadeIn delay={250} style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {SERVICE_CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </FadeIn>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {results.length === 0 ? (
          <FadeIn style={styles.empty}>
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptyText}>Try a different search or category.</Text>
          </FadeIn>
        ) : (
          // Keyed by the filter so the cards animate in again whenever the results change.
          results.map((s, i) => (
            <FadeIn key={`${category}-${query}-${s.id}`} delay={i * 70} distance={24}>
              <ServiceCard service={s} onAdd={() => onBookService?.(s)} />
            </FadeIn>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  searchWrap: { marginTop: 50, marginHorizontal: 24 },
  search: {
    height: 56,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 21,
  },
  searchInput: { flex: 1, height: '100%', padding: 0, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  clear: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  chipsWrap: { marginTop: 16 },
  chips: { paddingHorizontal: 24, gap: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  chipTextActive: { color: colors.background },
  list: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: NAV_HEIGHT + 24, gap: 16 },
  card: {
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
  },
  thumb: { position: 'absolute', left: 12, top: 12, width: 76, height: 76, borderRadius: 8, backgroundColor: '#D9D9D9' },
  info: { position: 'absolute', left: 100, top: 12, right: 65, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flexShrink: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 20,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: colors.indigo,
  },
  ratingText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.text },
  description: { fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 15, color: colors.textSecondary },
  price: { marginTop: 2, fontFamily: 'Poppins_500Medium', fontSize: 14, letterSpacing: 0.24, color: colors.text },
  from: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.textSecondary },
  add: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  addPressed: { backgroundColor: 'rgba(255,138,0,0.2)', transform: [{ scale: 0.94 }] },
  empty: { alignItems: 'center', gap: 4, paddingTop: 60 },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
});
