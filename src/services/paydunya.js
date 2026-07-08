// src/services/paydunya.js
import axios from 'axios';

// ⚠️ Configuration de vos clés API fournies par PayDunya
const PAYDUNYA_MASTER_KEY = '3BbJvWLA-kDkP-2pQd-iJTG-RvRYn4P0rz59';
const PAYDUNYA_PUBLIC_KEY = 'test_public_XdRo949A3Mj9a3egh9FPhRHH8SL';
const PAYDUNYA_PRIVATE_KEY = 'test_private_ituJXMxjqqNWrFp9jobrAo7bYRB';
const PAYDUNYA_TOKEN = '1ptJsIrfqjIG5LWrru1o';

// Mode de test (sandbox) ou de production (live)
const IS_PRODUCTION = false; 
const BASE_URL = IS_PRODUCTION 
  ? 'https://paydunya.com' 
  : 'https://paydunya.com';

/**
 * Initialise une session de paiement sur PayDunya et génère une URL de facture
 * @param {number} totalAmount - Le montant total de la commande en FCFA
 * @param {Array} items - La liste des articles contenus dans le panier Jula
 * @returns {Promise<string>} - L'URL sécurisée de paiement PayDunya
 */
export const initializePaydunyaPayment = async (totalAmount, items) => {
  try {
    // 1. Préparation de l'en-tête sécurisé exigé par l'API PayDunya
    const headers = {
      'Content-Type': 'application/json',
      'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
      'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
      'PAYDUNYA-PUBLIC-KEY': PAYDUNYA_PUBLIC_KEY,
      'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
    };

    // 2. Structuration des données de la facture
    const invoiceData = {
      invoice: {
        total_amount: totalAmount,
        description: "Règlement de votre commande sur Jula App",
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }))
      },
      store: {
        name: "Jula E-commerce",
        tagline: "Le commerce à portée de main",
        postal_address: "Abidjan, Côte d'Ivoire",
        phone: "+2250000000000",
        website_url: "https://jula-shop.com"
      },
      // Liens de redirection après la transaction
      actions: {
        cancel_url: "jula://payment/cancel",
        return_url: "jula://payment/success"
      }
    };

    // 3. Envoi de la requête à l'API PayDunya pour créer la facture
    const response = await axios.post(`${BASE_URL}/checkout-invoice/create`, invoiceData, { headers });

    if (response.data && response.data.response_code === '00') {
      // Renvoie l'URL vers laquelle rediriger l'utilisateur pour qu'il choisisse son Mobile Money
      return response.data.response_text; 
    } else {
      throw new Error(response.data.response_text || "Échec de l'initialisation de la facture.");
    }

  } catch (error) {
    console.error("Erreur PayDunya:", error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Vérifie l'état réel d'un paiement à partir du token de la facture
 * @param {string} invoiceToken - Le jeton unique de la transaction
 * @returns {Promise<boolean>} - Vrai si le paiement a été honoré avec succès
 */
export const checkPaymentStatus = async (invoiceToken) => {
  try {
    const headers = {
      'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
      'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
      'PAYDUNYA-PUBLIC-KEY': PAYDUNYA_PUBLIC_KEY,
      'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
    };

    const response = await axios.get(`${BASE_URL}/checkout-invoice/confirm/${invoiceToken}`, { headers });

    if (response.data && response.data.status === 'completed') {
      return true;
    }
    return false;

  } catch (error) {
    console.error("Erreur vérification PayDunya:", error.message);
    return false;
  }
};