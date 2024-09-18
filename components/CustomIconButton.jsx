import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomIconButton = ({
  handlePress,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] 
                    justify-center items-center ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <View className="pt-2">
        <Image source={icons.plus} className="w-5 h-5" resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
};

export default CustomIconButton;
