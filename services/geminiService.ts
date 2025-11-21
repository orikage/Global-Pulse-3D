import { GoogleGenAI } from "@google/genai";
import { NewsItem, NewsCategory } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const fetchGlobalNews = async (): Promise<NewsItem[]> => {
  try {
    // Request Japanese output
    const prompt = `
      過去24時間以内に発生した世界の重要なニュースイベントを12件見つけてください。
      北米、ヨーロッパ、アジア、アフリカ、南米、オセアニアなど、多様な地域を網羅してください。
      
      結果はMarkdownのコードブロック内にJSON配列として厳密に出力してください。
      各オブジェクトには以下のフィールドを含めてください：
      - title: 短い見出し（日本語, 最大20文字）。
      - summary: 2文程度の要約（日本語）。
      - category: "Politics", "Technology", "Business", "Science", "Sports", "Entertainment", "General" のいずれか。
      - locationName: 都市名または国名（日本語）。
      - coordinates: おおよその場所を表す "lat" (数値) と "lon" (数値) を持つオブジェクト。
      
      座標(coordinates)は必ず数値型で出力し、文字列にしないでください。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) return getFallbackNews();

    // Extract JSON from code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    let jsonData: any[] = [];

    if (jsonMatch && jsonMatch[1]) {
      try {
        jsonData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
        return getFallbackNews();
      }
    } else {
      try {
        jsonData = JSON.parse(text);
      } catch (e) {
        return getFallbackNews();
      }
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const newsItems: NewsItem[] = jsonData.map((item: any, index: number) => {
        let sourceUrl = "";
        if (groundingChunks && groundingChunks.length > 0) {
            const chunk = groundingChunks[index % groundingChunks.length];
            if (chunk.web?.uri) {
                sourceUrl = chunk.web.uri;
            }
        }

        // Ensure coordinates are valid numbers
        let lat = Number(item.coordinates?.lat);
        let lon = Number(item.coordinates?.lon);

        if (isNaN(lat)) lat = 0;
        if (isNaN(lon)) lon = 0;

        return {
            id: generateId(),
            title: item.title || "不明なイベント",
            summary: item.summary || "詳細情報はありません。",
            category: (item.category as NewsCategory) || NewsCategory.GENERAL,
            locationName: item.locationName || "不明な場所",
            coordinates: { lat, lon },
            url: sourceUrl,
            timestamp: new Date().toISOString()
        };
    });

    return newsItems;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackNews();
  }
};

// Fallback data in Japanese
const getFallbackNews = (): NewsItem[] => [
  {
    id: "1",
    title: "世界AIサミット開催決定",
    summary: "東京で世界のリーダーが集まり、AI規制の未来について議論を行うことが決定しました。",
    category: NewsCategory.TECH,
    locationName: "東京, 日本",
    coordinates: { lat: 35.6762, lon: 139.6503 },
    timestamp: new Date().toISOString()
  },
  {
    id: "2",
    title: "アマゾン保護区の新設",
    summary: "生物多様性を保護するため、ブラジルに新たな保護地域が設立されました。",
    category: NewsCategory.SCIENCE,
    locationName: "マナウス, ブラジル",
    coordinates: { lat: -3.1190, lon: -60.0217 },
    timestamp: new Date().toISOString()
  },
  {
    id: "3",
    title: "欧州市場が最高値更新",
    summary: "新しい経済政策の発表を受け、主要指数が過去最高値を記録しました。",
    category: NewsCategory.BUSINESS,
    locationName: "フランクフルト, ドイツ",
    coordinates: { lat: 50.1109, lon: 8.6821 },
    timestamp: new Date().toISOString()
  },
   {
    id: "4",
    title: "新宇宙望遠鏡の画像を公開",
    summary: "NASAが遠方の銀河を捉えた息をのむような高解像度画像を公開しました。",
    category: NewsCategory.SCIENCE,
    locationName: "ワシントンD.C., アメリカ",
    coordinates: { lat: 38.9072, lon: -77.0369 },
    timestamp: new Date().toISOString()
  }
];