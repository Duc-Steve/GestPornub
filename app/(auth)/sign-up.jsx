import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";

import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  
  const submit = async () => {
    // Vérifier si tous les champs sont remplis
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;  // Sortir de la fonction si les champs ne sont pas remplis
    }
  
    setSubmitting(true);  // Activer l'indicateur de soumission
    try {
      // Appeler la fonction de création de l'utilisateur avec les informations du formulaire
      const result = await createUser(form.email, form.password, form.username);
      
      // Si la création réussit, définir l'utilisateur et mettre à jour l'état de connexion
      setUser(result);
      setIsLogged(true);
  
      // Rediriger vers la page d'accueil après connexion réussie
      router.replace("/home");
    } catch (error) {
      // Afficher une alerte en cas d'erreur
      Alert.alert("Erreur", error.message);
    } finally {
      setSubmitting(false);  // Désactiver l'indicateur de soumission après l'opération
    }
  };
  

  return (
    <SafeAreaView style={styles.container}  className="h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="relative mt-5 mb-5">
            <Text className="text-3xl text-white font-bold text-center">
             Création du compte {"\n"}
              <Text style={styles.text} className="text-200">GestPornub</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[246px] h-[115px] absolute -bottom-5 -right-8"
              resizeMode="contain"
            />
          </View>

          <FormField
            title="Nom d'utilisateur"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

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
            title="Je créais mon compte"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              J'en ai déjà un compte?
            </Text>
            <Link
              href="/sign-in" style={styles.text2}
              className="text-lg font-psemibold"
            >
              Connexion
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

export default SignUp;
