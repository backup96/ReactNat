import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { savedPosts } from "../../lib/appwrite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => savedPosts(user.$id));



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 ">
              <Text className="text-xl text-white font-psemibold">
                Saved videos
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No videos saved"
              subtitle="Add your favorites videos here"
            />
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Bookmark;
