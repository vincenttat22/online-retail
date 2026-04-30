import type { Product, Bundle } from './types'

export const PRODUCTS: Product[] = [
  { id: 1,  zh: '手工红糖姜茶',     en: 'Handcrafted Ginger Sugar',  cat: 'SNACKS',  price: 38,  unit: '/盒', desc: '古法熬制 · 暖身驱寒 · 12小袋装', disc: 15, badge: '周销冠' },
  { id: 2,  zh: '植物精华洁面慕斯', en: 'Botanical Cleansing Foam',  cat: 'BEAUTY_HEALTH', price: 89,  unit: '/瓶', desc: '氨基酸温和配方 150ml',             disc: 0,  badge: '新品' },
  { id: 3,  zh: '环保牛皮购物袋 10入', en: 'Kraft Shopping Bags ×10', cat: 'HOUSEHOLD', price: 45,  unit: '/包', desc: '加厚耐用 · 可循环使用',            disc: 15 },
  { id: 4,  zh: '四川藤椒鸡丝',     en: 'Sichuan Pepper Chicken',   cat: 'MEAT_SEAFOOD',  price: 32,  unit: '/袋', desc: '麻辣鲜香 · 真空锁鲜',             disc: 20, badge: '热卖' },
  { id: 5,  zh: '苦荞茶礼盒',       en: 'Tartary Buckwheat Tea',    cat: 'SNACKS',  price: 68,  unit: '/盒', desc: '凉山黑苦荞 · 250g礼盒',           disc: 0 },
  { id: 6,  zh: '竹纤维抽纸 5包',   en: 'Bamboo Tissue ×5',         cat: 'HOUSEHOLD',  price: 42,  unit: '/提', desc: '无漂白 · 原浆本色',               disc: 10 },
  { id: 7,  zh: '玻尿酸保湿精华',   en: 'Hyaluronic Serum',         cat: 'BEAUTY_HEALTH', price: 128, unit: '/瓶', desc: '五重玻尿酸 · 30ml',               disc: 25, badge: '会员价' },
  { id: 8,  zh: '奶香瓜子 大包装',  en: 'Milky Sunflower Seeds',    cat: 'SNACKS',  price: 24,  unit: '/袋', desc: '原香奶味 · 500g',                 disc: 0 },
  { id: 9,  zh: '亚麻洗碗布 6条',   en: 'Linen Dish Cloths ×6',     cat: 'HOUSEHOLD',  price: 29,  unit: '/组', desc: '吸水快干 · 不沾油',               disc: 0,  badge: '新品' },
  { id: 10, zh: '山茶花润唇膏',     en: 'Camellia Lip Balm',        cat: 'BEAUTY_HEALTH', price: 52,  unit: '/支', desc: '天然滋养 · 4.5g',                 disc: 15 },
  { id: 11, zh: '低钠竹盐',         en: 'Low-Sodium Bamboo Salt',   cat: 'HOUSEHOLD',  price: 36,  unit: '/罐', desc: '九次焙烧 · 380g',                 disc: 0 },
]

export const BUNDLES: Bundle[] = [
  { id: 'b1', zh: '家居清洁焕新组', en: 'Home Refresh Bundle',   items: [3, 6, 9, 11],  price: 128, orig: 152, tag: '四件超值', theme: 'HOUSEHOLD' },
  { id: 'b2', zh: '办公室解馋套装', en: 'Desk Snack Box',        items: [1, 4, 5, 8],   price: 138, orig: 162, tag: '四味组合', theme: 'SNACKS' },
  { id: 'b3', zh: '清晨护肤仪式',   en: 'Morning Ritual Set',   items: [2, 7, 10],     price: 228, orig: 269, tag: '会员专享', theme: 'BEAUTY_HEALTH', member: true },
]
