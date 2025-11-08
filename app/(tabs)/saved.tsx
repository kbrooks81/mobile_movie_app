// app/(tabs)/saved.tsx
import SavedMovieCard from "@/components/SavedMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { listSaved } from "@/services/saved";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Saved() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  async function refresh() {
    setLoading(true);
    const res = await listSaved({ limit: 24, sort: "recent" });
    const r = res.rows ?? [];
    setRows(r);
    setHasMore(r.length >= 24);
    setCursor(r.at(-1)?.$id);
    setLoading(false);
  }

  async function loadMore() {
    if (!hasMore || loading) return;
    setLoading(true);
    const res = await listSaved({ limit: 24, cursorAfter: cursor });
    const more = res.rows ?? [];
    setRows((prev) => [...prev, ...more]);
    setHasMore(more.length >= 24);
    setCursor(more.at(-1)?.$id ?? cursor);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  const handleRemoved = (rowId: string) => {
    setRows((prev) => prev.filter((x) => x.$id !== rowId));
  };

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [])
  );

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      {loading && rows.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "center", gap: 16, marginVertical: 16 }}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 100, paddingHorizontal: 20 }}
          renderItem={({ item }) => <SavedMovieCard row={item} onRemoved={handleRemoved} />}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          ListHeaderComponent={<Text className="text-2xl text-white font-bold mt-8">Saved Movies</Text>}
          ListEmptyComponent={<Text className="text-center text-light-200 mt-20">No saved movies yet.</Text>}
        />
      )}
    </View>
  );
}
