export default function ItemCard({ item }) {

    return (

        <div className="inventory-card">

            <img
                src={item.icon_url}
                alt={item.name}
            />

            <div>

                <h3>{item.name}</h3>

                <p>{item.type}</p>

            </div>

        </div>

    );

}