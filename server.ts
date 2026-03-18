import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Menu Data
  const menuData = [
    {
      id: "carrot-cake-01",
      name: "Heritage Carrot Cake",
      price: 3800,
      description: "A moist, spiced carrot cake layered with velvety cream cheese frosting and toasted walnuts.",
      modelUrl: "https://pub-0f2db2459b794af9a9ce4bdd6a8ba29a.r2.dev/carrot_cake_1k-v1.glb",
      category: "Food",
      ingredients: ["Carrots", "Walnuts", "Cream Cheese", "Cinnamon", "Nutmeg"],
      allergies: ["Gluten", "Dairy", "Nuts"],
      nutrition: { calories: 420, protein: "5g", fat: "22g" },
      history: "Our recipe dates back to the early 20th century, emphasizing the natural sweetness of heritage carrots and a perfect balance of warming spices.",
      translations: {
        en: { name: "Heritage Carrot Cake", description: "A moist, spiced carrot cake layered with velvety cream cheese frosting and toasted walnuts.", category: "Food", ingredients: ["Carrots", "Walnuts", "Cream Cheese", "Cinnamon", "Nutmeg"], allergies: ["Gluten", "Dairy", "Nuts"], history: "Our recipe dates back to the early 20th century." },
        am: { name: "Գազարով Տորթ", description: "Խոնավ, համեմված գազարով տորթ՝ թավշյա կրեմ-պանրով և բոված ընկույզով:", category: "Սնունդ", ingredients: ["Գազար", "Ընկույզ", "Կրեմ-պանիր", "Դարչին", "Մշկընկույզ"], allergies: ["Գլյուտեն", "Կաթնամթերք", "Ընկուզեղեն"], history: "Մեր բաղադրատոմսը սկիզբ է առնում 20-րդ դարի սկզբից:" },
        ru: { name: "Морковный торт", description: "Влажный пряный морковный торт с бархатистым кремом из сливочного сыра и обжаренными грецкими орехами.", category: "Еда", ingredients: ["Морковь", "Грецкие орехи", "Сливочный сыр", "Корица", "Мускатный орех"], allergies: ["Глютен", "Молочные продукты", "Орехи"], history: "Наш рецепт восходит к началу 20-го века." },
        tr: { name: "Havuçlu Kek", description: "Kadifemsi krem peynir dolgulu ve kavrulmuş cevizli, nemli ve baharatlı havuçlu kek.", category: "Yemek", ingredients: ["Havuç", "Ceviz", "Krem Peynir", "Tarçın", "Muskat"], allergies: ["Gluten", "Süt Ürünleri", "Kuruyemiş"], history: "Tarifimiz 20. yüzyılın başlarına dayanmaktadır." },
        fa: { name: "کیک هویج اصیل", description: "کیک هویج مرطوب و ادویه‌ای با لایه‌های فراستینگ پنیر خامه‌ای مخملی و گردوی برشته.", category: "غذا", ingredients: ["هویج", "گردو", "پنیر خامه‌ای", "دارچین", "جوز هندی"], allergies: ["گلوتن", "لبنیات", "آجیل"], history: "دستور پخت ما به اوایل قرن بیستم بازمی‌گردد." }
      }
    },
    {
      id: "pomegranate-01",
      name: "Royal Pomegranate",
      price: 2500,
      description: "A perfectly ripe, hand-selected pomegranate from the valleys of Meghri. Bursting with sweet and tart ruby-red seeds.",
      modelUrl: "https://pub-0f2db2459b794af9a9ce4bdd6a8ba29a.r2.dev/food_pomegranate_01_1k-v1.glb",
      category: "Food",
      ingredients: ["Pomegranate"],
      allergies: [],
      nutrition: { calories: 83, protein: "1.7g", fat: "1.2g" },
      history: "Known as the 'fruit of paradise,' the pomegranate has been a symbol of fertility and abundance in Armenian and Persian cultures for millennia.",
      translations: {
        en: { name: "Royal Pomegranate", description: "A perfectly ripe, hand-selected pomegranate from the valleys of Meghri. Bursting with sweet and tart ruby-red seeds.", category: "Food", ingredients: ["Pomegranate"], allergies: [], history: "Known as the 'fruit of paradise,' the pomegranate has been a symbol of fertility and abundance." },
        am: { name: "Արքայական Նուռ", description: "Կատարյալ հասունացած նուռ Մեղրիի հովիտներից: Լի քաղցր և թթվաշ սուտակե հատիկներով:", category: "Սնունդ", ingredients: ["Նուռ"], allergies: [], history: "Հայտնի որպես «դրախտի պտուղ», նուռը հազարամյակներ շարունակ եղել է պտղաբերության խորհրդանիշ:" },
        ru: { name: "Королевский гранат", description: "Идеально спелый, отобранный вручную гранат из долин Мегри. Наполнен сладкими и терпкими рубиново-красными зернами.", category: "Еда", ingredients: ["Гранат"], allergies: [], history: "Известный как «райский фрукт», гранат на протяжении тысячелетий был символом плодородия." },
        tr: { name: "Kraliyet Narı", description: "Meghri vadilerinden özenle seçilmiş, tam olgunlaşmış nar. Tatlı և mayhoş yakut կırmիզիսի տանելերլե դոլու.", category: "Yemek", ingredients: ["Nar"], allergies: [], history: "Cennet meyvesi olarak bilinen nar, binlerce yıldır bereketին sembolü olmuştur." },
        fa: { name: "انار سلطنتی", description: "اناری کاملاً رسیده و دست‌چین شده از دره‌های مغری. سرشار از دانه‌های یاقوتی شیرین و ملس.", category: "غذا", ingredients: ["انار"], allergies: [], history: "انار که به عنوان «میوه بهشتی» شناخته می‌شود، برای هزاره‌ها نماد باروری و فراوانی در فرهنگ‌های ایرانی و ارمنی بوده است." }
      }
    },
    {
      id: "strawberry-cake-01",
      name: "Strawberry Chocolate Dream",
      price: 4500,
      description: "Decadent dark chocolate sponge topped with fresh strawberries and a rich ganache glaze.",
      modelUrl: "https://pub-0f2db2459b794af9a9ce4bdd6a8ba29a.r2.dev/strawberry_chocolate_cake_1k-v1.glb",
      category: "Food",
      ingredients: ["Dark Chocolate", "Strawberries", "Cream", "Cocoa", "Vanilla"],
      allergies: ["Gluten", "Dairy"],
      nutrition: { calories: 480, protein: "6g", fat: "28g" },
      history: "A celebration of the timeless pairing of chocolate and strawberries, crafted with the finest single-origin cocoa.",
      translations: {
        en: { name: "Strawberry Chocolate Dream", description: "Decadent dark chocolate sponge topped with fresh strawberries and a rich ganache glaze.", category: "Food", ingredients: ["Dark Chocolate", "Strawberries", "Cream", "Cocoa", "Vanilla"], allergies: ["Gluten", "Dairy"], history: "A celebration of the timeless pairing of chocolate and strawberries." },
        am: { name: "Ելակով և Շոկոլադով Տորթ", description: "Շոկոլադե բիսկվիթ՝ թարմ ելակով և հարուստ գանաշով:", category: "Սնունդ", ingredients: ["Մուգ շոկոլադ", "Ելակ", "Սերուցք", "Կակաո", "Վանիլ"], allergies: ["Գլյուտեն", "Կաթնամթերք"], history: "Շոկոլադի և ելակի հավերժական համադրության տոն:" },
        ru: { name: "Клубнично-шоколадный сон", description: "Изысканный темный шоколадный бисквит со свежей клубникой и насыщенной глазурью из ганаша.", category: "Еда", ingredients: ["Темный шоколад", "Клубника", "Сливки", "Какао", "Ваниль"], allergies: ["Глютен", "Молочные продукты"], history: "Празднование вечного сочетания шоколада и клубники." },
        tr: { name: "Çilekli Çikolatalı Rüya", description: "Taze چilekler ve zengin ganaj sosu ile kaplanmış nefis bitter çikolatalı kek.", category: "Yemek", ingredients: ["Bitter Çikolata", "Çilek", "Krema", "Kakao", "Vanilya"], allergies: ["Gluten", "Süt Ürünleri"], history: "Çikolata ve چileğin zamansız eşleşmesinin bir kutlaması." },
        fa: { name: "رویای شکلات و توت‌فرنگی", description: "اسفنج شکلاتی تلخ و لذیذ با توت‌فرنگی‌های تازه و روکش گاناش غلیظ.", category: "غذا", ingredients: ["شکلات تلخ", "توت‌فرنگی", "خامه", "کاکائو", "وانیل"], allergies: ["گلوتن", "لبنیات"], history: "جشنی برای ترکیب همیشگی شکلات و توت‌فرنگی." }
      }
    },
    {
      id: "onion-01",
      name: "Sweet Yellow Onion",
      price: 800,
      description: "A premium, large yellow onion known for its mild flavor and crisp texture. Perfect for gourmet cooking.",
      modelUrl: "https://pub-0f2db2459b794af9a9ce4bdd6a8ba29a.r2.dev/yellow_onion_1k-v1.glb",
      category: "Food",
      ingredients: ["Yellow Onion"],
      allergies: [],
      nutrition: { calories: 40, protein: "1.1g", fat: "0.1g" },
      history: "Sourced from organic farms that specialize in heirloom varieties, these onions are prized for their high sugar content and versatility.",
      translations: {
        en: { name: "Sweet Yellow Onion", description: "A premium, large yellow onion known for its mild flavor and crisp texture. Perfect for gourmet cooking.", category: "Food", ingredients: ["Yellow Onion"], allergies: [], history: "Sourced from organic farms that specialize in heirloom varieties." },
        am: { name: "Քաղցր Դեղին Սոխ", description: "Պրեմիում դեղին սոխ՝ հայտնի իր մեղմ համով և խրթխրթան հյուսվածքով:", category: "Սնունդ", ingredients: ["Դեղին սոխ"], allergies: [], history: "Բերված օրգանական ֆերմաներից:" },
        ru: { name: "Сладкий желтый лук", description: "Премиальный крупный желтый лук, известный своим мягким вкусом и хрустящей текстурой.", category: "Еда", ingredients: ["Желтый лук"], allergies: [], history: "Поставляется с органических ферм." },
        tr: { name: "Tatlı Sarı Soğan", description: "Hafif tadı ve gevrek dokusuyla bilinen birinci sınıf büyük sarı soğan.", category: "Yemek", ingredients: ["Sarı Soğan"], allergies: [], history: "Yadigarı çeşitlerde uzmanlaşmış organik çiftliklerden temin edilmiştir." },
        fa: { name: "پیاز زرد شیرین", description: "پیاز زرد بزرگ و ممتاز که به دلیل طعم ملایم و بافت تردش شناخته شده است.", category: "غذا", ingredients: ["پیاز زرد"], allergies: ["گلوتن", "لبنیات", "آجیل"], history: "تهیه شده از مزارع ارگانیک که در گونه‌های اصیل تخصص دارند." }
      }
    },
    {
      id: "espresso-01",
      name: "Artisan Espresso",
      price: 1200,
      description: "A rich, full-bodied espresso with notes of dark chocolate and a velvety crema. Sourced from sustainable highland farms.",
      modelUrl: "https://pub-0f2db2459b794af9a9ce4bdd6a8ba29a.r2.dev/coffee_cup_1k-v1.glb",
      category: "Drink",
      ingredients: ["Arabica Coffee Beans", "Purified Water"],
      allergies: [],
      nutrition: { calories: 2, protein: "0.1g", fat: "0g" },
      history: "Our beans are roasted in small batches to preserve the delicate aromatic oils and ensure a perfect pull every time.",
      translations: {
        en: { name: "Artisan Espresso", description: "A rich, full-bodied espresso with notes of dark chocolate and a velvety crema.", category: "Drink", ingredients: ["Coffee Beans"], allergies: [], history: "Roasted in small batches." },
        am: { name: "Արհեստավարժ Էսպրեսո", description: "Հարուստ, թունդ էսպրեսո՝ մուգ շոկոլադի նոտաներով:", category: "Ըմպելիք", ingredients: ["Սուրճի հատիկներ"], allergies: [], history: "Տապակված փոքր խմբաքանակներով:" },
        ru: { name: "Ремесленный эспрессо", description: "Насыщенный эспрессо с нотками темного шоколада и бархатистой пенкой.", category: "Напитки", ingredients: ["Кофейные зерна"], allergies: [], history: "Обжаривается небольшими партиями." },
        tr: { name: "Zanaatkar Espresso", description: "Bitter çikolata notaları ve kadifemsi kreması ile zengin, dolgun gövdeli bir espresso.", category: "İçecek", ingredients: ["Kahve Çekirdekleri"], allergies: [], history: "Küçük partiler halinde kavrulmuştur." },
        fa: { name: "اسپرسو آرتیزان", description: "یک اسپرسوی غنی و غلیظ با نت‌های شکلات تلخ و کرمای مخملی.", category: "نوشیدنی", ingredients: ["دانه‌های قهوه"], allergies: [], history: "در دسته‌های کوچک برشته شده است." }
      }
    }
  ];

  // Get Menu Data
  app.get("/api/menu", (req, res) => {
    res.json(menuData);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
