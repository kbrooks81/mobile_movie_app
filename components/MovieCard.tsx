import CircleScore from '@/components/CircleScore'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity className="relative overflow-visible w-[30%]" activeOpacity={0.9}>
            <View className="overflow-hidden rounded-lg">
                <Image 
                    source={{ uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://placehold.co/600x400/1a1a1a/ffffff.png' }}
                    className="w-full h-52 rounded-lg"
                    resizeMode='cover'
                />
            </View>

            <CircleScore
                value={(vote_average ?? 0) * 10} // TMDB 0–10 → %
                size={40}
                strokeWidth={4}
                className="absolute bottom-14 -left-2" // tweak to taste
            />

            <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>

            <View className='flex-row items-center justify-between'>
                <Text className='text-xs text-light-300 font-medium mt-1'>{release_date?.split('-')[0]}</Text>

                {/* <Text className='text-xs text-light-300 font-medium uppercase'>Movie</Text> */}
            </View>
        </TouchableOpacity>
    </Link>
  )
}

export default MovieCard