// Короткий помощник делает структуру цен одинаковой для каждой карточки.
// Названия ключей совпадают с названиями площадок в интерфейсе.
const prices = (Steam, Skinport, CSFloat, buff) => ({ Steam, Skinport, CSFloat, "Buff.163": buff });

// Временный формат ответа инвентаря. В дальнейшем его должен возвращать backend после запроса к Steam API и сервисам с ценами.
const inventoryData = {
  profile_url: "https://steamcommunity.com/id/smokingkillsu/inventory/#730", steam_id: "76561198292140510", total_items: 6,
  items: [
    {asset_id:"1",name:"AK-47 | Redline",type:"Rifle",rarity:"Classified",wear:"Field-Tested",float:"0.2471",marketable:true,change:4.8,prices:prices(37.49,34.18,35.21,32.94)},
    {asset_id:"2",name:"USP-S | Cortex",type:"Pistol",rarity:"Classified",wear:"Minimal Wear",float:"0.1023",marketable:true,change:2.1,prices:prices(14.76,13.48,13.91,12.86)},
    {asset_id:"3",name:"AWP | Neo-Noir",type:"Sniper Rifle",rarity:"Covert",wear:"Field-Tested",float:"0.2831",marketable:false,change:-1.4,prices:prices(29.84,27.55,28.12,26.47)},
    {asset_id:"4",name:"M4A1-S | Decimator",type:"Rifle",rarity:"Classified",wear:"Minimal Wear",float:"0.0912",marketable:true,change:6.2,prices:prices(20.31,18.77,19.04,17.98)},
    {asset_id:"5",name:"Desert Eagle | Light Rail",type:"Pistol",rarity:"Restricted",wear:"Factory New",float:"0.0438",marketable:true,change:0.7,prices:prices(4.62,4.15,4.21,3.96)},
    {asset_id:"6",name:"Glock-18 | Clear Polymer",type:"Pistol",rarity:"Mil-Spec Grade",wear:"Field-Tested",float:"0.1742",marketable:true,change:-0.3,prices:prices(2.19,1.94,2.02,1.82)}
  ]
};

export default inventoryData;
