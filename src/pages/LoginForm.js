import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm = ({ navigation }) => {
    const [formData, setFormData] = useState({
        email: "nykantorandri@gmail.com",
        password: "123",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/rest/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            await AsyncStorage.setItem("token", response.data.token);
            await AsyncStorage.setItem("email", response.data.email);

            if (response.data.role === "USER_ACHETEUR") {
                navigation.navigate("Payment");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("Une erreur est survenue lors de la connexion.");
            }
        }
    };

    return (
        <ImageBackground source={require("../../assets/background-login.jpeg")}
            style={styles.background}
            blurRadius={5}>
            <View style={styles.container}>

                <Image source={require("../../assets/logo.jpeg")} style={styles.logo} />
                <Text style={styles.title}>Kolekta</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    keyboardType="email-address"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Mot de passe"
                        secureTextEntry={!showPassword}
                        value={formData.password}
                        onChangeText={(text) => handleInputChange("password", text)}
                    />
                    <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                        <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>SE CONNECTER</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: "center", // Centre l'image horizontalement
        borderRadius: 10,
        marginBottom: 20,
    },
    container: {
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        margin: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1, // Prend tout l'espace disponible
        paddingVertical: 10,
    },
    eyeIcon: {
        marginLeft: 10,
    },
    error: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default LoginForm;
