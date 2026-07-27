// Потом эта переменная не будет использоваться, заменится на ответ от backend.

const inventoryData = {
    ok: true,
    profile_url: "https://steamcommunity.com/id/smokingkillsu/inventory/#730",
    steam_id: "76561198292140510",
    app_id: 730,
    total_items: 2,
    items: [
        {
            asset_id: "123456789",
            class_id: "987654321",
            name: "AK-47 | Redline",
            type: "Rifle",
            marketable: true,
            icon_url: "https://community.akamai.steamstatic.com/economy/image/..."
        },
        {
            asset_id: "234567890",
            class_id: "876543210",
            name: "USP-S | Cortex",
            type: "Pistol",
            marketable: false,
            icon_url: "https://community.akamai.steamstatic.com/economy/image/..."
        }
    ]
};

export default inventoryData;