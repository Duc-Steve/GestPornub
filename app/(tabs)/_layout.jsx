import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs 
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            position: "absolute",
            bottom: 20,
            justifyContent: "center",
            alignSelf: "center",
            height: 65,
            marginHorizontal: 20,
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingBottom: 8,
            borderRadius: 40,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: "#0D254A",
            borderTopColor: "#0D254A",
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#999",
          tabBarActiveTintColor: "#f26d7d",
        }}
        
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Acceuil",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Acceuil"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reception"
          options={{
            title: "Réception",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Réception"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Ajouter",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Ajouter"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D254A', // la couleur de fond (bg-primary)
  },
  text: {
    color: "#DFB892",

  },
});

export default TabLayout;
