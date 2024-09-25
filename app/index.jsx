import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.container} className="h-full">
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            className="w-[180px] h-[134px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Plusieurs plaisir sexuel{"\n"}
              Un foyer eparnouie{" "}
              <Text style={styles.text} className="text-200">GestPornub</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[196px] h-[115px] absolute -bottom-5 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Apprenez à bien mougou c'est très important pour la vie de votre foyer!!!
            
          </Text>

          <CustomButton
            title="J'aime mon moi !!!"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D254A', // la couleur de fond (bg-primary)
  },
  text: {
    color: "#DFB892",

  }
});

export default Welcome;
