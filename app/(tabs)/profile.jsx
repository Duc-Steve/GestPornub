import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox, VideoCard } from "../../components";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView style={styles.container} className="h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Pas de vidéo"
            subtitle="Vous pouvez enregistrer une vidéo"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Publications"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="J'aime"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D254A', // la couleur de fond (bg-primary)
    paddingBottom: 55
  },
  text: {
    color: "#DFB892",

  }
});

export default Profile;
