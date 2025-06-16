import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu, Divider, Provider, Button, IconButton } from "react-native-paper";

const Header = () => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [personne, setPersonne] = useState({
        id: '',
        nom: '',
        prenom: '',
        contact: '',
        localisation: '',
        codePostal: '',
        role: { id: '', nom: '' },
        utilisateur: { id: '', email: '', password: '', isAdmin: '', pseudo: '' },
        typeProduction: ''
    });

    useEffect(() => {
        const checkTokenAndFetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    navigation.navigate("Login");
                    return;
                }

                const response = await axios.get("http://localhost:8080/panier/count", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setPersonne(response.data.data[1]);
                }
            } catch (error) {
                console.error("Error fetching cart count:", error);
            }
        };

        checkTokenAndFetchData();
    }, []);


    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:8080/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (response.status === 200) {
                AsyncStorage.clear();
                navigation.navigate("Login");
            } else {
                console.error("Logout failed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Provider>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
                    <Text style={styles.appName}>Kolekta</Text>
                </View>

                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton
                                icon="account-circle"
                                size={30}
                                color="black"
                                onPress={openMenu}
                            />
                        </View>
                    }
                    contentStyle={{ top: -80 }}
                    anchorPosition="top"
                >
                    <Menu.Item title={`${personne.prenom} ${personne.nom}`} />
                    {/* <Divider /> */}
                    <Menu.Item title="Déconnexion" onPress={handleLogout} />
                </Menu>

            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    appName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    commande: {
        flex: 1,
        alignItems: 'center',
    },
    commandeText: {
        color: '#fff',
        fontSize: 16,
    },
    // profile: {
    //     alignItems: 'flex-end',
    // },
    // profileText: {
    //     fontSize: 16,
    // },
    // roleText: {
    //     color: '#ccc',
    //     fontSize: 12,
    // },
    // logout: {
    //     paddingHorizontal: 10,
    // },
    // logoutText: {
    //     color: '#ff4444',
    //     fontSize: 14,
    // },
});

export default Header;
