import { Flame, Star } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

type StatPillProps = {
    value: string | number | undefined;
    variant?: 'trend' | 'star';
    leftSlot?: React.ReactNode;
    className?: string;
}

const StatPill = ({ value, variant = 'trend', leftSlot, className = '' }: StatPillProps) => {
    const Icon = variant === 'trend' ? Flame : variant === 'star' ? Star : null;

    return (
      <View className={`flex-row items-center gap-2 px-2 py-1 rounded-lg bg-dark-100 flex-none ${className}`}>
        {leftSlot ? leftSlot : Icon ? <Icon size={16} color="#CFC8FF" /> : null }
        <Text className="text-light-100 text-sm font-semibold">{value}</Text>
      </View>  
    )
}

export default StatPill