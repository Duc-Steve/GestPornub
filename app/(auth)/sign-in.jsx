import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  const submit = async () => {
    // Vérifier si les champs email et mot de passe sont remplis
    if (form.email === "" || form.password === "") {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return; // Arrêter l'exécution si les champs ne sont pas remplis
    }
  
    setSubmitting(true); // Activer l'indicateur de soumission
  
    try {
      // Tentative de connexion avec l'email et le mot de passe
      await signIn(form.email, form.password);
      
      // Récupérer les informations de l'utilisateur connecté
      const result = await getCurrentUser();
      
      // Mettre à jour l'état de l'utilisateur et définir comme connecté
      setUser(result);
      setIsLogged(true);
  
      // Afficher un message de succès et rediriger vers la page d'accueil
      Alert.alert("Succès", "Utilisateur connecté avec succès");
      router.replace("/home");
    } catch (error) {
      // En cas d'erreur, afficher une alerte avec le message d'erreur
      Alert.alert("Erreur", error.message);
    } finally {
      setSubmitting(false); // Désactiver l'indicateur de soumission après l'opération
    }
  };
  

  return (
    <SafeAreaView style={styles.container} className="h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="relative mt-5 mb-5">
            <Text className="text-3xl text-white font-bold text-center">
            Connexion à{"\n"}
              <Text style={styles.text} className="text-200">GestPornub</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[276px] h-[115px] absolute -bottom-5 -right-8"
              resizeMode="contain"
            />
          </View>

          <FormField
            title="Adresse mail"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Mot de passe"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Inscription"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Pas de compte ?
            </Text>
            <Link
              href="/sign-up" style={styles.text2}
              className="text-lg font-psemibold"
            >
              Inscription
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D254A', // la couleur de fond (bg-primary)
  },
  text: {
    color: "#DFB892",

  },
  text2: {
    color: "#fff",

  },
});

export default SignIn;
