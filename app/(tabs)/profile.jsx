import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserPosts, logoutUser } from "../../lib/appwrite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";

import { router } from 'expo-router'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  console.log(user);

  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  const logOut = async () => {
    await logoutUser()
    setUser(null)
    setIsLoggedIn(false)

    router.replace('/sing-in')
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                className="w-[375px] items-end mb-10"
                onPress={logOut}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image
                  source={{ uri: user?.useravatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>

              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titelStyles="text-lg"
              />

              <View className="mt-5 flex-row">
                <InfoBox
                  title={posts.length || 0}
                  subtitle="Posts"
                  containerStyles="mr-10"
                  titelStyles="text-xl"
                />
                <InfoBox
                  title="1.2k"
                  subtitle="Followers"
                  titelStyles="text-xl"
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No videos found"
              subtitle="No videos found for this search query"
            />
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Profile;
