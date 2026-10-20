import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On utilise le port 5000 pour tes tests locaux sur ton PC HP ProBook
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

// 🚀 VERSION BLINDÉE POUR TON COMPTEUR PC & APP MOBILE TECNO
app.post('/publish-product', async (req, res) => {
    try {
        console.log("\n📥 ALERTE : Commande reçue en direct du smartphone Tecno !");
        
        // On renvoie un vrai lien JSON propre pour simuler la réussite de PayDunya
        res.status(200).json({ 
            success: true, 
            redirect_url: "https://jula-web.onrender.com"
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
        
        // Ici, le serveur enregistre en base. L'APK mobile écoutera cette table en direct pour vibrer !
        return res.status(200).json({ success: true, message: "Notification propulsée avec succès sur le réseau !" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 📢 9. GESTIONNAIRE DE CAMPAGNES PUBLICITAIRES (AVEC DOUBLE TÉLÉVERSEMENT IMAGE)
app.post('/admin/create-ad', upload.any(), async (req, res) => {
    try {
        const { title, vendedor_id } = req.body;
        let finalAdUrl = 'https://unsplash.com';

        if (req.files && req.files.length > 0) {
            try {
                const targetFile = req.files[0];
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Moteur Local Jula branché avec succès !`);
  console.log(`📡 En écoute sur le Port : ${PORT}`);
  console.log(`=================================================\n`);
});
