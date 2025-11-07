// components/SavedMovieCard.tsx
import { deleteSaved } from "@/services/saved";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type SavedRow = {
  $id: string;
  movie_id: number;
  title?: string;
  poster_url?: string;
  vote_average?: number;
  release_date?: string;
};

type Props = {
  row: SavedRow;
  // called after a successful remove so the parent can update its list
  onRemoved?: (rowId: string) => void;
};

export default function SavedMovieCard({ row, onRemoved }: Props) {
  const poster = row.poster_url || undefined;

  const onRemove = async (e: any) => {
    e.preventDefault(); // don’t trigger the Link
    await deleteSaved(row.$id);
    onRemoved?.(row.$id);
  };

  return (
    <Link href={`/movies/${row.movie_id}`} asChild>
      <TouchableOpacity activeOpacity={0.9} className="relative w-[30%]">
        <View className="rounded-xl overflow-hidden">
          <Image
            source={poster ? { uri: poster } : undefined}
            className="w-full h-56"
            resizeMode="cover"
          />
        </View>

        {/* tiny “unsave” button */}
        <TouchableOpacity
          onPress={onRemove}
          className="absolute top-1.5 right-1.5 bg-black/60 rounded-full px-2 py-1"
        >
          <Text className="text-white text-xs">Remove</Text>
        </TouchableOpacity>

        {/* title (optional) */}
        {row.title ? (
          <Text numberOfLines={1} className="text-white mt-2 text-xs">
            {row.title}
          </Text>
        ) : null}
      </TouchableOpacity>
    </Link>
  );
}
