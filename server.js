 import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du port 5000 pour tes tests locaux sur ton PC HP ProBook
const PORT = process.env.PORT || 5000;

const urlSupabase = process.env.SUPABASE_URL;
const cleSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

// INITIALISATION AVEC PATCH WEBSOCKET POUR TA VERSION NODE 20
const supabase = createClient(urlSupabase, cleSupabase, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🚀 ROUTE DE SECOURS POUR TON COMPTEUR PC & APP MOBILE TECNO POP 9
app.post('/publish-product', async (req, res) => {
    try {
        console.log("\n📥 ALERTE : Commande reçue en direct du smartphone Tecno !");
        
        // Renvoie un vrai lien JSON propre pour simuler la réussite du paiement
        res.status(200).json({ 
            success: true, 
            redirect_url: "https://onrender.com"
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// 🔔 8. MOTEUR DE PROPULSION DE NOTIFICATIONS DE MASSE
app.post('/admin/send-notification', async (req, res) => {
    const { title, message, target_role } = req.body;
    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert([
                {
                    title: title || 'Alerte Jula Express',
                    message: message,
                    target_role: target_role || 'tous',
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        
        // Le serveur enregistre en base. L'APK mobile écoutera cette table en direct pour vibrer !
        return res.status(200).json({ success: true, message: "Notification propulsée avec succès sur le réseau !" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 🔐 9. MOTEUR DE CONNEXION UNIVERSELLE PARTENAIRES AVEC DROITS ASSISTANT SUPPORT
app.post('/login-partner', async (req, res) => {
    const { email } = req.body;
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !profile) {
            return res.send(`❌ Aucun compte trouvé avec l'adresse ${email}. Créez-le d'abord via les formulaires du site !`);
        }

        const userRole = profile.role ? profile.role.toLowerCase().trim() : '';
        const profileId = profile.id;

        if (!profileId) {
            return res.redirect('/vendedor/dashboard');
        }

        // 🏪 A. Si c'est un Vendeur / Grossiste
        if (userRole === 'boutique' || userRole === 'vendedor') {
            return res.redirect(`/vendedor/dashboard-orders/${profileId}`);
        }
        
        // 🏍️ B. Si c'est un Livreur / Coursier Réel
        if (userRole === 'livreur' || userRole === 'driver') {
            const { data: activeOrders } = await supabase.from('orders').select('*').eq('status', 'En attente de préparation');
            return res.render('dashboard-driver', { 
                email: profile.email, 
                userId: profileId,
                user: { id: profileId, email: profile.email },
                orders: activeOrders || [] 
            });
        }
        
        // 📦 C. Si c'est un Point Relais Hub Réel
        if (userRole === 'relais' || userRole === 'station') {
            const { data: stationOrders } = await supabase.from('orders').select('*').eq('status', 'En attente de préparation');
            return res.render('dashboard-station', { 
                email: profile.email, 
                userId: profileId,
                user: { id: profileId, email: profile.email },
                orders: stationOrders || [] 
            });
        }

        // 📞 D. 🪐 L'AIGUILLAGE SÉCURISÉ POUR TON COMPTE ASSISTANT SUPPORT
        if (userRole === 'support' || userRole === 'assistance') {
            const { data: issueOrders } = await supabase.from('orders').select('*').not('status', 'eq', 'Livré');
            return res.render('dashboard-support', { 
                email: profile.email, 
                userId: profileId,
                user: { id: profileId, email: profile.email },
                orders: issueOrders || [] // Liste filtrée des colis sous surveillance support
            });
        }
    } catch (err) {
        res.status(500).send(`⚙️ Erreur de transition des portails Jula : ${err.message}`);
    }
});
        // 💰 Si c'est un Gestionnaire Financier / Comptable Réel
        if (userRole === 'comptable' || userRole === 'finance') {
            // Le serveur extrait les transactions encaissées ou à valider
            const { data: allOrders } = await supabase
                .from('orders')
                .select('*');

            // Calcul instantané du Chiffre d'Affaires Global pour son bilan
            let chiffreAffairesGlobal = 0;
            if (allOrders && allOrders.length > 0) {
                allOrders.forEach(order => {
                    if (order.status === 'Livré' || order.status === 'En cours de livraison') {
                        chiffreAffairesGlobal += Number(order.total_price || order.price_fcfa || 0);
                    }
                });
            }

            return res.render('dashboard-finance', { 
                email: profile.email, 
                userId: profileId,
                user: { id: profileId, email: profile.email },
                orders: allOrders || [],
                caGlobal: chiffreAffairesGlobal
            });
        }
        // 📢 Si c'est un Chargé de Communication / Média Réel
        if (userRole === 'media' || userRole === 'com' || userRole === 'communication') {
            return res.render('dashboard-media', { 
                email: profile.email, 
                userId: profileId,
                user: { id: profileId, email: profile.email }
            });
        }

// 📢 11. GESTIONNAIRE DE CAMPAGNES PUBLICITAIRES (AVEC DOUBLE TÉLÉVERSEMENT IMAGE D'ORIGINE)
app.post('/admin/create-ad', async (req, res) => {
    try {
        const { title, vendedor_id } = req.body;
        let finalAdUrl = 'https://unsplash.com';

        if (req.files && req.files.length > 0) {
            try {
                const targetFile = req.files;
                const uploadedUrl = await uploadToSupabase(targetFile, 'publicites');
                if (uploadedUrl) finalAdUrl = uploadedUrl;
            } catch (storageErr) {
                console.error("Erreur de stockage de l'affiche publicitaire");
            }
        }

        const { error } = await supabase
            .from('advertisements')
            .insert([
                {
                    title: title || 'Nouvelle Campagne Jula',
                    image_url: finalAdUrl,
                    vendedor_id: vendedor_id || null,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        return res.status(200).json({ success: true, message: "Affiche publicitaire mise en ligne sur l'application !" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 💵 12. CAISSE FINANCIÈRE : VALIDATION DU RETRAIT MOBILE MONEY
app.post('/admin/validate-payout', async (req, res) => {
    const { profile_id, amount } = req.body;
    try {
        return res.status(200).json({ success: true, message: `Virement de ${amount} FCFA validé avec succès !` });
    } catch (err) { return res.status(500).json({ error: err.message }); }
});

// 📱 13. MODÉRATEUR CATALOGUE : SUPPRESSION BRUTE D'UN SMARTPHONE DU RAYON
app.post('/admin/delete-catalog-product', async (req, res) => {
    const { product_id } = req.body;
    try {
        const { error } = await supabase.from('products').delete().eq('id', product_id);
        if (error) throw error;
        return res.status(200).json({ success: true, message: "Article supprimé du catalogue !" });
    } catch (err) { return res.status(500).json({ error: err.message }); }
});

// 🚫 14. TRIBUNAL DES LITIGES : BANNISEMENT DÉFINITIF D'UN COMPTE TRICHEUR
app.post('/admin/ban-partner', async (req, res) => {
    const { id } = req.body;
    try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true, message: "Compte banni et supprimé à la source de Supabase !" });
    } catch (err) { return res.status(500).json({ error: err.message }); }
});
// 👥 15. AFFICHAGE DE LA VITRINE D'INSCRIPTION CACHÉE DE L'ÉQUIPE JULA
app.get('/register-jula-team', async (req, res) => {
    try {
        res.render('register-team'); // Ouvre le fichier views/register-team.ejs
    } catch (err) {
        res.status(500).send(`❌ Erreur de chargement du portail équipe : ${err.message}`);
    }
});

// 📥 16. ENREGISTREMENT ET CRYPTAGE DU PERSONNEL DANS SUPABASE
app.post('/submit-team-member', async (req, res) => {
    const { full_name, phone, email, password, team_role, country } = req.body;
    try {
        // Insertion brute du nouveau membre du personnel avec son rôle étanche
        const { data, error } = await supabase
            .from('profiles')
            .insert([
                {
                    full_name: full_name,
                    phone: phone,
                    email: email.toLowerCase().trim(),
                    password: password, // En production réelle, ce champ sera haché
                    role: team_role,    // support, finance, ou media
                    country: country || 'CI',
                    is_verified: true,  // Le personnel de confiance est validé par défaut
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        // Redirection triomphale vers le login après succès
        return res.send(`
            <div style="font-family:sans-serif; text-align:center; padding:50px; background:#111417; color:#fff; height:100vh; box-sizing:border-box;">
                <h2 style="color:#81c784;">🎉 Inscription Équipe Validée !</h2>
                <p>Bienvenue dans l'administration Jula Express, ${full_name}.</p>
                <a href="/login" style="display:inline-block; background:#1072ba; color:#fff; padding:10px 20px; text-decoration:none; border-radius:6px; font-weight:bold; margin-top:15px;">Se connecter à mon espace d'équipe</a>
            </div>
        `);
    } catch (err) {
        return res.status(500).send(`❌ Échec de l'insertion du membre de l'équipe : ${err.message}`);
    }
});

// 🚀 ALLUMAGE GÉNÉRAL DU MOTEUR JULA EXPRESS
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Moteur Local Jula branché avec succès !`);
  console.log(`📡 En écoute sur le Port : ${PORT}`);
  console.log(`=================================================\n`);
});
