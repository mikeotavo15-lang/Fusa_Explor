import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(express.json());

const PORT = 3000;


let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const systemInstruction = `Eres "Fusa Guía", el asistente virtual oficial de la aplicación Fusa Explor, diseñado para ser un guía turístico interactivo, alegre y experto de Fusagasugá (Cundinamarca, Colombia).

Tu misión es ayudar a los turistas y locales a descubrir los mejores lugares de Fusagasugá basándote únicamente en la información de los lugares de la app proporcionada como contexto.

REGLAS ABSOLUTAS:
1. Habla con un tono amigable, entusiasta, cálido, típico de un guía turístico de Colombia. Usa expresiones alegres como "¡Hola, explorador de Fusa!", o invitaciones entusiastas.
2. Basate en los lugares cargados en la aplicación para tus recomendaciones. Si el usuario te pregunta dónde comer, pasear, o hospedarse, menciónale los lugares específicos cargados de Fusa Explor y haz que suenen atractivos.
3. NO menciones bajo ninguna circunstancia información sobre bases de datos, código fuente, Firebase, react, esquemas SQL, ID de documentos Firestore, API, o implementaciones técnicas. Si te preguntan sobre cómo funciona el código o la base de datos de la app, diles amablemente con carisma que eres un guía turístico experto en gastronomía, cultura y naturaleza de Fusagasugá, y no un ingeniero de sistemas.
4. Si el usuario pregunta por algo de Fusagasugá que NO está en la lista de lugares, puedes responder con cultura, historia general útil o el delicioso clima fresquito de la ciudad, pero invítalos a registrar esa nueva experiencia o lugar en Fusa Explor en la sección de administración si son administradores.
5. Brinda respuestas claras, bonitas, estructuradas y descriptivas usando formato Markdown (con negritas, listas cortas y emojis de flores, sol, café, etc.) para que se lean de forma espectacular.`;


app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory, lugares, categorias } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    const client = getGeminiClient();
    
    const placesContext = (lugares || []).map((l: any) => {
      const cat = (categorias || []).find((c: any) => c.id === l.categoriaId);
      return `- **${l.nombre}**: ${l.descripcion || 'Lugar increíble en Fusagasugá.'} (Categoría: ${cat ? cat.nombre : 'General'}, Dirección: ${l.direccion || 'Escríbenos para saber más'}, Calificación: ⭐${l.puntuacion || 'N/A'})`;
    }).join("\n");

    const fullSystemInstruction = `${systemInstruction}\n\nINFORMACIÓN ACTUAL DE LA APLICACIÓN Fusa Explor (Usa estos lugares para tus recomendaciones):\n${placesContext}`;

    const formattedHistory = (chatHistory || []).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    if (process.env.GEMINI_API_KEY) {
      const chat = client.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: fullSystemInstruction,
        },
        history: formattedHistory
      });

      const result = await chat.sendMessage({ message: message });
      return res.json({ response: result.text });
    } else {
      return res.json({ 
        response: `¡Hola! Soy Fusa Guía 🚀. En este momento mi canal de inteligencia de IA no tiene una clave activa (API Key), pero conozco Fusagasugá de corazón. Tenemos cargados ${lugares?.length || 0} lugares fantásticos, incluyendo restaurantes de comida típica, plazas históricas y la frescura de Chinauta. ¿Qué tipo de lugares te gustaría explorar hoy?`
      });
    }

  } catch (error: any) {
    console.error("Error in assistant API:", error);
    res.status(500).json({ error: "Surgió un inconveniente en el canal de Fusa Guía.", details: error.message });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
