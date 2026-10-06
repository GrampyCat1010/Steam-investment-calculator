const prices = (value) => ({ Steam: value, Skinport: value, CSFloat: value, "Buff.163": value });

const inventoryData = {
  steam_id: "",
  total_items: 0,
  items: []
};

export default inventoryData;

export const mapSteamInventory = (records) => {
  const wearNames = {
    fn: "Factory New",
    mw: "Minimal Wear",
    ft: "Field-Tested",
    ww: "Well-Worn",
    bs: "Battle-Scarred"
  };

  return records.map((record, index) => {
    const usdPrice = Number(record.pricelatest || record.pricereal || 0);
    const itemName = record.markethashname || record.marketname || "Unknown item";
    const [type = "Item"] = itemName.split(" | ");

    return {
      asset_id: record.assetid || record.id || String(index),
      name: itemName,
      type,
      rarity: record.rarity || "Base Grade",
      wear: wearNames[record.wear] || record.wear || "",
      float: record.float?.floatvalue == null ? "—" : Number(record.float.floatvalue).toFixed(4),
      image: record.image,
      marketable: Boolean(record.marketable),
      tradable: Boolean(record.tradable),
      change: Number(record.winloss || 0),
      steamUrl: record.steamurl,
      prices: prices(usdPrice)
    };
  });
};
