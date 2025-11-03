import StatPill from "@/components/StatPill"
import { icons } from "@/constants/icons"
import { extractUSCertification, fetchMovieDetails, fetchMovieReleaseInfo } from "@/services/api"
import useFetch from '@/services/useFetch'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

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
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  const { data: movieReleaseInfo } = useFetch(() => fetchMovieReleaseInfo(id as string));

  const rating = movieReleaseInfo ? extractUSCertification(movieReleaseInfo) : null;

  const budgetText = movie && movie.budget != null
    ? `$${(movie.budget / 1_000_000).toFixed(1)} million`
    : 'N/A';

  const revenueText = movie && movie.revenue != null
    ? `$${(movie.revenue / 1_000_000).toFixed(1)} million`
    : 'N/A';

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} className="w-full h-[550px]" resizeMode="stretch"/>
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
              variant="trend"
              value={Math.round(movie?.popularity ?? 0)}
            />
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />

          <MovieInfo label="Status" value={movie?.status} />

          <View className="mt-2">
            <Text className="text-light-300 text-xs">Genres</Text>

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

          <MovieInfo label="Production Companies" value={movie?.production_companies?.map((company: any) => company.name).join(' ・ ') || 'N/A'} />
        </View>
      </ScrollView>

      <TouchableOpacity 
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3 flex flex-row items-center justify-center z-50 shadow-lg active:opacity-90"
        onPress={router.back}
      >
        <Image 
          source={icons.arrow} 
          className="size-5 mr-2 rotate-180" 
          tintColor={"#fff"} 
        />
        <Text className="text-white font-bold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetails