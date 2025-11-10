import StatPill from "@/components/StatPill"
import { icons } from "@/constants/icons"
import { extractUSCertification, fetchMovieDetails, fetchMovieReleaseInfo } from "@/services/api"
import { deleteSaved, getByMovieId, saveMovie } from "@/services/saved"
import useFetch from '@/services/useFetch'
import { Feather, Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from 'expo-router'
import { Flame } from "lucide-react-native"
import React from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface MovieInfoProps {
  label: string;
  value?: string | number | null | React.ReactNode;
  children?: React.ReactNode;
}

const MovieInfo = ({ label, value, children }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">
      {label}
    </Text>
    {children ?? (
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || 'N/A'}
      </Text>
    )}
  </View>
)

const MovieDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const movieId = Number(id);

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  const { data: movieReleaseInfo } = useFetch(() => fetchMovieReleaseInfo(id as string));

  const rating = movieReleaseInfo ? extractUSCertification(movieReleaseInfo) : null;

  const [isSaved, setIsSaved] = React.useState(false);
  const [rowId, setRowId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // On mount, check saved state
  React.useEffect(() => {
    let mounted = true;
    getByMovieId(movieId).then((row) => {
      if (!mounted) return;
      setIsSaved(!!row);
      setRowId(row?.$id ?? null);
    });
    return () => { mounted = false; };
  }, [movieId]);

  const onToggleSave = async () => {
    if (!movieId) return;
    if (saving) return;
    setSaving(true);

    try {
      if (!isSaved) {
        const created = await saveMovie({
          id: movieId,
          title: movie?.title,
          poster_path: movie?.poster_path,
          vote_average: movie?.vote_average,
          popularity: movie?.popularity,
          release_date: movie?.release_date,
          genre_ids: movie?.genres?.map(genre => genre.id) ?? [],
        });
        setIsSaved(true);
        setRowId(created.$id);
      } else if (rowId) {
        await deleteSaved(rowId);
        setIsSaved(false);
        setRowId(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const budgetText = movie && movie.budget != null
    ? `$${(movie.budget / 1_000_000).toFixed(1)} million`
    : 'N/A';

  const revenueText = movie && movie.revenue != null
    ? `$${(movie.revenue / 1_000_000).toFixed(1)} million`
    : 'N/A';

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="relative">
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} className="w-full h-[550px]" resizeMode="stretch"/>
          <TouchableOpacity 
            className="absolute top-12 left-5 rounded-full bg-black/70 items-center justify-center z-50 shadow-md shadow-black/40 active:opacity-80"
            onPress={router.back}
          >
            <Ionicons name="arrow-back-circle-outline" size={40} color={"white"}/>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onToggleSave}
            disabled={saving}
            hitSlop={{ top:10, right: 10, bottom: 10, left: 10 }}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "Unsave movie" : "Save movie"}
            accessibilityState={{ selected : isSaved }}
            className="absolute top-12 right-5 rounded-full items-center justify-center z-50 shadow-md shadow-black/40 active:opacity-80"
          >
            {saving ? (
              <ActivityIndicator />
            ) : (
              <Feather
                name={isSaved ? "bookmark" : "bookmark"}
                size={50}
                color={isSaved ? "#ab8bff" : "#ffffff"} 
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white text-bold text-xl">{movie?.title}</Text>

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">{movie?.release_date?.split('-')[0]}</Text>
            <Text className="text-light-200 text-sm">・</Text>

            <Text className="text-light-200 text-sm">{rating ?? 'N/A'}</Text>

            <Text className="text-light-200 text-sm">・</Text>
            <Text className="text-light-200 text-sm">{movie?.runtime} mins</Text>
          </View>

          <View className="flex-row items-center gap-2 mt-2">
            <StatPill
              leftSlot={<Image source={icons.star} className="size-4" />}
              value={`${Math.round(movie?.vote_average ?? 0)}/10`}
            />

            <StatPill
              variant="star"
              value={movie?.vote_count ?? 0}
            />

            <StatPill 
              leftSlot={<Flame size={16} color="#CFC8FF" />}
              value={Math.round(movie?.popularity ?? 0)}
            />
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />

          <MovieInfo label="Status" value={movie?.status} />

          <View className="mt-2">
            <Text className="text-light-200 font-normal text-sm">Genres</Text>

            <View className="flex-row flex gap-2 mt-1">
              {movie?.genres?.length ? (
                movie.genres.map((g: { id: number; name: string }) => (
                  <View
                    key={g.id}
                    className="px-3 py-1 rounded-md bg-dark-100 flex-none"
                  >
                    <Text className="text-light-100 text-sm font-semibold">
                      {g.name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-light-200 text-sm">N/A</Text>
              )}
            </View>
          </View>

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo label="Budget" value={budgetText} />
            <MovieInfo label="Revenue" value={revenueText} />
          </View>

          <MovieInfo label="Countries" value={movie?.production_countries?.map((country: any) => country.name).join(' ・ ') || 'N/A'} />

          <MovieInfo label="Tagline" value={movie?.tagline} />

          <MovieInfo label="Production Companies" value={movie?.production_companies?.map((company: any) => company.name).join(' ・ ') || 'N/A'} />
        </View>
      </ScrollView>
    </View>
  )
}

export default MovieDetails