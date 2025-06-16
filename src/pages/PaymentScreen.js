import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { ScrollView } from "react-native";

export default function PaymentScreen() {
  const [transID, setTransID] = useState("");
  const [adresse, setAdresse] = useState("");
  const [personne, setPersonne] = useState([]);
  const [total, setTotal] = useState(0);
  const [tva, setTva] = useState(0);
  const [ttc, setTtc] = useState(0);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("token : ", token);
        if (!token) {
          navigation.navigate("Login");
          return;
        }
        const response = await axios.get("http://localhost:8080/panier/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("data 0 : ", response.data.data[0]);
        const rawTempOrders = response.data.data[0];
        const produitPhotos = response.data.data[1];
        setPersonne(response.data.data[3]);
        setTotal(response.data.data[4]);
        setTva(response.data.data[5]);
        setTtc(response.data.data[6]);

        const transformedOrders = rawTempOrders.map((order) => {
          // const photo = produitPhotos[order.id] || {};

          return {
            id_produit: order.id,
            nom_produit: order.nom,
            prix_produit: order.prix,
            quantite: order.quantite,
            total: order.total,
            id_vendeur: order.id_vendeur,
            nom_vendeur: order.nom_vendeur,
            prenom_vendeur: order.prenom_vendeur,
            pseudo_vendeur: order.pseudo_vendeur,
            email_vendeur: order.email_vendeur,
            contact_vendeur: order.contact_vendeur,
          };
        });

        console.log("transformed Orders : ", transformedOrders);

        setOrders(transformedOrders);

      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigation.navigate("ErrorScreen", { code: 403 });
        } else {
          setError(error.message);
        }
      }
    };

    fetchOrders();
  }, [refresh]);

  // const handlePayment = () => {
  //   if (!transID.trim() || !adresse.trim()) {
  //     alert("Veuillez entrer la référence de paiement et l'adresse.");
  //     return;
  //   }
  //   console.log("Référence de paiement (transID):", transID);
  // };

  const handlePaiement = async (e) => {
    e.preventDefault();
    if (!transID.trim() || !adresse.trim()) {
      alert("Veuillez entrer la référence de paiement et l'adresse.");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("token : ", token);

      const response = await axios.post("http://localhost:8080/panier/save-commande-mobile",
        {},
        {
          params: {
            adresse_livraison: adresse,
            reference: transID
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      if (response.status === 200) {
        alert("Votre commande a été envoyé avec succès");
        setAdresse("");
        setTransID("");
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scrollContent}>
        <Text style={styles.labelAdresse}>Adresse de livraison</Text>
        <TextInput
          style={styles.inputAdresse}
          placeholder="Entrez l'adresse de livraison"
          value={adresse}
          onChangeText={setAdresse}
        />
        <Text style={styles.labelPanier}>Détails du Panier</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Produit</Text>
            <Text style={styles.tableHeaderCell}>P U (Ar)</Text>
            <Text style={styles.tableHeaderCell}>Quantité</Text>
            <Text style={styles.tableHeaderCell}>Total (Ar)</Text>
          </View>

          {orders.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.productName}>{order.nom_produit}</Text>
                <Text style={styles.sellerName}>{order.prenom_vendeur} {order.nom_vendeur}</Text>
              </View>
              <Text style={styles.tableCell}>{order.prix_produit?.toLocaleString("fr-FR")}</Text>
              <Text style={styles.tableCell}>{order.quantite?.toLocaleString("fr-FR")}</Text>
              <Text style={styles.tableCell}>{order.total?.toLocaleString("fr-FR")}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <Text>Sous-total : {total.toLocaleString("fr-FR")} Ar</Text>
          <Text>TVA : {tva.toLocaleString("fr-FR")} Ar</Text>
          <Text>Total TTC : {ttc.toLocaleString("fr-FR")} Ar</Text>
        </View>
        <Text style={styles.labelReference}>Référence de paiement</Text>
        <TextInput
          style={styles.inputReference}
          placeholder="Entrez la référence de paiement"
          value={transID}
          onChangeText={setTransID}
        />
      </ScrollView>
      <Button title="Confirmer le paiement" onPress={handlePaiement} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    marginTop: 115
  },
  labelReference: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
  },
  labelAdresse: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
  },
  labelPanier: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
  },
  inputReference: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  inputAdresse: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  orderItem: {
    padding: 15,
    backgroundColor: "#e6e6e6",
    borderRadius: 5,
    marginBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totals: {
    marginTop: 20,
    alignItems: "flex-end",
    display: "flex",
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  sellerName: {
    color: 'blue',
  }
});

