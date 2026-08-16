import { useEffect, useState } from "react";
import usPizzaLogo from "./assets/us-pizza-logo.webp";
import usPizzaHero from "./assets/us-pizza-hero.webp";
import "./App.css";

type MenuItem = { id: string; name: string; description: string; price: number; category: string; image: string; badge?: string };
type CartItem = MenuItem & { cartId: string; specialInstructions: string; quantity: number };
type PaymentMethod = "cash" | "transfer" | "duitnow" | "tng" | "grabpay";
type FulfillmentMethod = "delivery" | "pickup" | null;
type DeliveryAddress = { unit: string; street: string; postcode: string; city: string; state: string };
type Outlet = { name: string; distance: string; address: string; latitude: number; longitude: number };

const outlets: Outlet[] = [
	{ name: "US Pizza Klang", distance: "8.41 km", address: "Jalan Batu Belah", latitude: 3.044, longitude: 101.446 },
	{ name: "US Pizza Central i-City", distance: "14.83 km", address: "Seksyen 7, Shah Alam", latitude: 3.066, longitude: 101.485 },
	{ name: "US Pizza Bandar Baru Klang", distance: "14.99 km", address: "Bandar Bukit Tinggi", latitude: 3.001, longitude: 101.434 },
	{ name: "US Pizza Shah Alam Seksyen 7", distance: "15.40 km", address: "Jalan Plumbum", latitude: 3.075, longitude: 101.492 },
	{ name: "US Pizza USJ 21", distance: "18.05 km", address: "Subang Jaya", latitude: 3.047, longitude: 101.590 },
];

function getDistanceInKilometres(latitude: number, longitude: number, outlet: Outlet) {
	const earthRadius = 6371;
	const latitudeDifference = (outlet.latitude - latitude) * (Math.PI / 180);
	const longitudeDifference = (outlet.longitude - longitude) * (Math.PI / 180);
	const calculation = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(latitude * (Math.PI / 180)) * Math.cos(outlet.latitude * (Math.PI / 180)) * Math.sin(longitudeDifference / 2) ** 2;
	return earthRadius * 2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));
}

const menu: MenuItem[] = [
	{ id: "alaska-fish", name: "Alaska Fish n Chip Pizza", description: "Golden fish fingers, tartar sauce, wedges and US Special Sauce.", price: 32.9, category: "Chef's Best", badge: "Chef's pick", image: "https://uspizza.my/wp-content/uploads/2021/04/Alaska-Fish-n-Chip-Pizza.jpeg" },
	{ id: "smokey-duck", name: "Indiana BBQ Smokey Duck", description: "Smoked duck, BBQ sauce, caramelised onions and pineapple.", price: 34.9, category: "Chef's Best", image: "https://uspizza.my/wp-content/uploads/2021/04/Indiana-BBQ-Smokey-Duck-Pizza.jpeg" },
	{ id: "aloha", name: "Aloha Pizza", description: "Chicken roll, pineapple and an extra layer of double cheese.", price: 25.9, category: "Traditional Pizza", badge: "Popular", image: "https://uspizza.my/wp-content/uploads/2021/04/Aloha-Pizza.jpeg" },
	{ id: "chicken-classic", name: "Chicken Classic", description: "Chicken, mushroom and gooey double cheese on hand-tossed dough.", price: 25.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Chicken-Classic-Pizza.jpeg" },
	{ id: "vegi-lover", name: "Vegi Lover Pizza", description: "A vegetarian favourite with perfectly cooked vegetables and cheese.", price: 24.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Vegi-Lover-Pizza.jpeg" },
	{ id: "italian-way", name: "Italian Way Pizza", description: "Chicken pepperoni, chicken rolls, vegetables and oregano.", price: 30.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Italian-Way-Pizza-Chicken.jpeg" },
	{ id: "sumo-chicken", name: "Sumo Chicken Pizza", description: "Teriyaki chicken, seaweed, Japanese mayo and teriyaki sauce.", price: 31.9, category: "Signature Pizza", badge: "New York meets Tokyo", image: "https://uspizza.my/wp-content/uploads/2021/04/Sumo-Chicken-Pizza.jpeg" },
	{ id: "lasagna", name: "US Lasagna (Chicken)", description: "Layered chicken lasagna with vegetables and melted cheese.", price: 19.9, category: "Pasta & Lasagna", image: "https://uspizza.my/wp-content/uploads/2021/04/US-Lasagna-Chicken.jpeg" },
	{ id: "garlic-twist", name: "Crazi Garlic Twist", description: "Four twists with a deep, savoury garlic finish.", price: 9.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/Crazi-Garlic-Twist.jpeg" },
	{ id: "honey-wings", name: "Florida Honey Wings", description: "Eight juicy wings with a sticky honey kick.", price: 18.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/Florida-Honey-Wings.jpeg" },
	{ id: "iced-tea", name: "American Iced Tea", description: "A refreshing 500ml sweet American iced tea.", price: 5.9, category: "Beverages & Dessert", image: "https://uspizza.my/wp-content/uploads/2021/04/American-Ice-Tea-500ml.jpeg" },
	{ id: "lava-cake", name: "Belgian Dark Chocolate Lava Cake", description: "Warm Belgian dark chocolate with a molten centre.", price: 10.9, category: "Beverages & Dessert", image: "https://uspizza.my/wp-content/uploads/2021/04/Belgians-Dark-Chocolate-Lava-Cake.jpeg" },
	{ id: "x-solo", name: "X-Solo (1 pax)", description: "Regular pizza, Crazi Garlic Twist and American Iced Tea.", price: 25.9, category: "X-Meals", badge: "Save RM 13.30", image: "https://uspizza.my/wp-content/uploads/2023/09/XSOLO1pax85e040.webp" },
	{ id: "x-twin", name: "X-Twin (2 pax)", description: "Regular pizza, Crazi Garlic Twist and two American Iced Teas.", price: 39.9, category: "X-Meals", badge: "Save RM 12.80", image: "https://uspizza.my/wp-content/uploads/2023/09/XTWIN2pax08726d.webp" },
	{ id: "x-large", name: "X-Large (3 pax)", description: "Large pizza, two garlic twists, mushroom soup and 1L iced tea.", price: 59.9, category: "X-Meals", badge: "Save RM 33.00", image: "https://uspizza.my/wp-content/uploads/2023/09/XLARGE3pax81cf8a.webp" },
	{ id: "x-family", name: "X-Family (4-6 pax)", description: "Two regular pizzas, twists, soups and a 1L iced tea.", price: 89.9, category: "X-Meals", badge: "Save RM 43.90", image: "https://uspizza.my/wp-content/uploads/2023/09/XFAMILY46paxc4b3b2.webp" },
	{ id: "x-party", name: "X-Party (6-8 pax)", description: "Two large pizzas, twists, soups and two 1L iced teas.", price: 119.9, category: "X-Meals", badge: "Save RM 64.00", image: "https://uspizza.my/wp-content/uploads/2023/09/XPARTY68paxa71da0.webp" },
	{ id: "san-diego-tempura", name: "San Diego Golden Tempura Pizza", description: "Tempura prawns, crabmeat and Italiano Sauce.", price: 33.9, category: "Chef's Best", image: "https://uspizza.my/wp-content/uploads/2021/04/San-Diego-Golden-Tempura-Pizza.jpeg" },
	{ id: "aloha-deluxe", name: "Aloha Deluxe Pizza", description: "Chicken roll and crabmeat bring sea and land together.", price: 28.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Aloha-Deluxe-Pizza.jpeg" },
	{ id: "bolognese-chicken", name: "Bolognese Pizza (Chicken)", description: "Traditional meat sauce, chicken and vegetables.", price: 27.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Bolognese-Pizza-Chicken.jpeg" },
	{ id: "italian-aloha", name: "Italian Aloha Pizza", description: "Chicken meatloaf, carbonara sauce and pineapple.", price: 27.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Italian-Aloha-Pizza.jpeg" },
	{ id: "italian-aloha-deluxe", name: "Italian Aloha Deluxe Pizza", description: "Chicken meatloaf, crabmeat and carbonara sauce.", price: 29.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Italian-Aloha-Deluxe-Pizza.jpeg" },
	{ id: "spicy-chicken-delite", name: "Spicy Chicken Delite Pizza", description: "Cayenne pepper, chicken, vegetables and pineapple.", price: 27.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Spicy-Chicken-Delite-Pizza.jpeg" },
	{ id: "us-favourite-beef", name: "US Favourite Pizza (Beef)", description: "Beef pepperoni and double cheese.", price: 27.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/US-Favourite-Pizza-Beef.jpeg" },
	{ id: "us-favourite-chicken", name: "US Favourite Pizza (Chicken)", description: "Chicken pepperoni and double cheese.", price: 27.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/US-Favourite-Pizza-Chicken.jpeg" },
	{ id: "spicy-veggie-lover", name: "Spicy Veggie Lover Pizza", description: "Tom yam flavours, mixed vegetables and double cheese.", price: 25.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Spicy-Veggie-Lover-Pizza.jpeg" },
	{ id: "banana-mania", name: "Banana Mania Pizza", description: "Bananas and US honey on a sweet dessert pizza.", price: 22.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Banana-Mania-Pizza.jpeg" },
	{ id: "plain-cheese", name: "Plain Cheese Pizza", description: "US Duncan sauce and gooey double cheese.", price: 20.9, category: "Traditional Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Plain-Cheese-Pizza.jpeg" },
	{ id: "italian-way-beef", name: "Italian Way Pizza (Beef)", description: "Beef pepperoni, chicken rolls, vegetables and oregano.", price: 30.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Italian-Way-Pizza-Beef.jpeg" },
	{ id: "jumbo-deluxe-beef", name: "Jumbo Deluxe Pizza (Beef)", description: "Beef pepperoni, chicken meat and vegetables.", price: 31.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Jumbo-Deluxe-Pizza-Beef.jpeg" },
	{ id: "jumbo-deluxe-chicken", name: "Jumbo Deluxe Pizza (Chicken)", description: "Chicken pepperoni, chicken meat and vegetables.", price: 31.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Jumbo-Deluxe-Pizza-Chicken.jpeg" },
	{ id: "macho-meat-lover-beef", name: "Macho Meat Lover Pizza (Beef)", description: "Beef pepperoni, ground beef, chicken and chicken roll.", price: 32.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Macho-Meat-Lover-Pizza-Beef.jpeg" },
	{ id: "macho-meat-lover-chicken", name: "Macho Meat Lover Pizza (Chicken)", description: "Chicken pepperoni, chunky chicken and chicken rolls.", price: 32.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Macho-Meat-Lover-Pizza-Chicken.jpeg" },
	{ id: "new-yorker-beef", name: "New Yorker Pizza (Beef)", description: "Beef pepperoni, mushroom, chicken rolls and ground beef.", price: 31.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/New-Yorker-Pizza-Beef.jpeg" },
	{ id: "new-yorker-chicken", name: "New Yorker Pizza (Chicken)", description: "Chicken pepperoni, mushroom and chicken rolls.", price: 31.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/New-Yorker-Pizza-Chicken.jpeg" },
	{ id: "sumo-seafood", name: "Sumo Seafood Pizza", description: "Teriyaki tuna, crabmeat, seaweed and Japanese mayo.", price: 32.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Sumo-Seafood-Pizza.jpeg" },
	{ id: "italiano-chicken", name: "Italiano Chicken Pizza", description: "Italiano herb chicken, mushroom and carbonara sauce.", price: 30.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Italiano-Chicken-Pizza.jpeg" },
	{ id: "penang-special", name: "Penang Special Pizza (Ikan Bilis)", description: "Spicy ikan bilis, tuna and vegetables.", price: 30.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Penang-Special-Pizza-Ikan-Bilis-Pizza.jpeg" },
	{ id: "texas-bbq", name: "Texas BBQ Chicken Pizza", description: "BBQ chicken, sauce, onion and pineapple.", price: 30.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Texas-BBQ-Chicken-Pizza.jpeg" },
	{ id: "tom-yam-chicken", name: "Tom Yam Chicken Delite Pizza", description: "Tom yam chicken, mushroom, pineapple and onion.", price: 30.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Tom-Yam-Chicken-Delite-Pizza.jpeg" },
	{ id: "tuna-delite", name: "Tuna Delite Pizza", description: "Tuna, peppers, pineapple, onions and mayonnaise.", price: 30.9, category: "Signature Pizza", image: "https://uspizza.my/wp-content/uploads/2021/04/Tuna-Delite-Pizza.jpeg" },
	{ id: "italiano-spaghetti", name: "Italiano Spaghetti", description: "Chicken with premium chunky concasse sauce.", price: 18.9, category: "Pasta & Lasagna", image: "https://uspizza.my/wp-content/uploads/2021/04/Italiano-Spaghetti.jpeg" },
	{ id: "smokey-duck-carbonara", name: "Smokey Duck & Mushroom Carbonara Pasta", description: "Smoked duck and mushrooms in a creamy carbonara.", price: 21.9, category: "Pasta & Lasagna", image: "https://uspizza.my/wp-content/uploads/2021/04/Smokey-Duck-and-Mushroom-Carbonara-Pasta-e1624514391737.png" },
	{ id: "ocean-carbonara", name: "Spaghetti Ocean Carbonara", description: "Fresh seafood and herbs in a cheesy carbonara.", price: 21.9, category: "Pasta & Lasagna", image: "https://uspizza.my/wp-content/uploads/2021/04/Spaghetti-Ocean-Carbonara.jpeg" },
	{ id: "tuna-chicken-spaghetti", name: "Spaghetti Tuna & Chicken Roll", description: "Tuna and chicken roll in a surf-and-turf pasta.", price: 19.9, category: "Pasta & Lasagna", image: "https://uspizza.my/wp-content/uploads/2021/04/Spaghetting-Tuna-and-Chicken-Roll.jpeg" },
	{ id: "chicken-mushroom-spaghetti", name: "Spaghetti Chicken & Mushroom", description: "Chicken and mushroom with chunky concasse sauce.", price: 19.9, category: "Pasta & Lasagna", image: "https://uspizza.my/wp-content/uploads/2021/04/Spaghetti-Chicken-and-Mushroom.jpeg" },
	{ id: "spaghetti-bolognese", name: "Spaghetti Bolognese", description: "Classic spaghetti with premium chunky concasse sauce.", price: 18.9, category: "Pasta & Lasagna", image: "https://uspizza.my/wp-content/uploads/2021/04/Spaghetti-Bolognese.jpeg" },
	{ id: "new-york-wings", name: "New York Wings (8 pieces)", description: "Eight juicy wings cooked to perfection.", price: 18.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/New-York-Wings.jpeg" },
	{ id: "cinnamon-twist", name: "Cinnamon Twist Bread (4 pieces)", description: "Sweet and savoury cinnamon bread twists.", price: 9.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/Cinnamon-Twist-Bread.jpeg" },
	{ id: "mushroom-soup", name: "Creamy Mushroom Soup", description: "Freshly prepared creamy mushroom soup.", price: 8.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/Creamy-Mushroom-Soup.jpeg" },
	{ id: "tuna-salad", name: "Tuna Salad", description: "Chunky tuna and fresh vegetables.", price: 12.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/Tuna-Salad.jpeg" },
	{ id: "italian-chicken-salad", name: "Italian Grilled Chicken Salad", description: "Italian grilled chicken with fresh vegetables.", price: 13.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/Italian-Grilled-Chicken-Salad.jpeg" },
	{ id: "garden-salad", name: "Fresh Garden Salad", description: "Crisp, fresh vegetables for a healthy side.", price: 10.9, category: "Starters & Sides", image: "https://uspizza.my/wp-content/uploads/2021/04/Fresh-Garden-Salad.jpeg" },
	{ id: "chocolate-milkshake", name: "Chocolate Milkshake", description: "A rich, decadent and creamy chocolate milkshake.", price: 9.9, category: "Beverages & Dessert", image: "https://uspizza.my/wp-content/uploads/2021/04/Chocolate-Milkshake.jpeg" },
	{ id: "iced-tea-lemon-15", name: "American Iced Tea With Lemon (1.5 litre)", description: "Sweet tea with lemon, made to pair with pizza.", price: 9.9, category: "Beverages & Dessert", image: "https://uspizza.my/wp-content/uploads/2021/07/US-Pizza-Malaysia-Menu-American-Iced-Tea-With-Lemon-1.5-Liter.jpg" },
	{ id: "iced-tea-15", name: "American Iced Tea (1.5 litre)", description: "A refreshing 1.5 litre sweet American iced tea.", price: 8.9, category: "Beverages & Dessert", image: "https://uspizza.my/wp-content/uploads/2021/04/American-Ice-Tea-1.5-Litre.jpeg" },
	{ id: "iced-tea-lemon-500", name: "American Iced Tea With Lemon (500ml)", description: "Sweet American iced tea with a lemon finish.", price: 5.9, category: "Beverages & Dessert", image: "https://uspizza.my/wp-content/uploads/2021/07/US-Pizza-Malaysia-Menu-American-Iced-Tea-With-Lemon-500ml.jpg" },
];

const categories = ["All", "X-Meals", "Chef's Best", "Traditional Pizza", "Signature Pizza", "Pasta & Lasagna", "Starters & Sides", "Beverages & Dessert"];
const money = new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" });

function App() {
	const [selectedOutlet, setSelectedOutlet] = useState(0);
	const [outletDistances, setOutletDistances] = useState<number[] | null>(null);
	const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "available" | "unavailable">("idle");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [cart, setCart] = useState<CartItem[]>([]);
	const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>(null);
	const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
	const [customerName, setCustomerName] = useState("");
	const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ unit: "", street: "", postcode: "", city: "", state: "" });
	const [isCartVisible, setIsCartVisible] = useState(false);
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [showThankYou, setShowThankYou] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
	const [itemToConfigure, setItemToConfigure] = useState<MenuItem | null>(null);
	const [specialInstructions, setSpecialInstructions] = useState("");
	const visibleMenu = selectedCategory === "All" ? menu : menu.filter((item) => item.category === selectedCategory);
	const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
	const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
	const serviceFee = subtotal === 0 ? 0 : 2;
	const total = subtotal + serviceFee;
	const displayedOutlets = outlets.map((outlet, index) => ({ outlet, index, calculatedDistance: outletDistances?.[index] })).sort((first, second) => (first.calculatedDistance ?? Number.POSITIVE_INFINITY) - (second.calculatedDistance ?? Number.POSITIVE_INFINITY));

	useEffect(() => {
		function animatePressedButton(event: MouseEvent) {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const button = target.closest("button");
			if (!button || button.disabled) return;
			button.classList.remove("is-pressed");
			void button.offsetWidth;
			button.classList.add("is-pressed");
			window.setTimeout(() => button.classList.remove("is-pressed"), 500);
		}

		document.addEventListener("click", animatePressedButton);
		return () => document.removeEventListener("click", animatePressedButton);
	}, []);

	function openCustomization(item: MenuItem) {
		setItemToConfigure(item);
		setSpecialInstructions("");
	}

	function addConfiguredItem() {
		if (!itemToConfigure) return;
		const itemSpecialInstructions = specialInstructions.trim();
		const cartId = `${itemToConfigure.id}-${itemSpecialInstructions || "standard"}`;
		setCart((currentCart) => {
			const existingItem = currentCart.find((cartItem) => cartItem.cartId === cartId);
			return existingItem ? currentCart.map((cartItem) => cartItem.cartId === cartId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem) : [...currentCart, { ...itemToConfigure, cartId, specialInstructions: itemSpecialInstructions, quantity: 1 }];
		});
		setItemToConfigure(null);
	}

	function updateQuantity(cartId: string, quantity: number) {
		setCart((currentCart) => currentCart.flatMap((item) => quantity > 0 && item.cartId === cartId ? [{ ...item, quantity }] : item.cartId === cartId ? [] : [item]));
	}

	function useCurrentLocation() {
		if (!navigator.geolocation) {
			setLocationStatus("unavailable");
			return;
		}
		setLocationStatus("requesting");
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				const distances = outlets.map((outlet) => getDistanceInKilometres(latitude, longitude, outlet));
				setOutletDistances(distances);
				setSelectedOutlet(distances.indexOf(Math.min(...distances)));
				setLocationStatus("available");
			},
			() => setLocationStatus("unavailable"),
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
		);
	}

	function completeOrder() {
		setCart([]);
		setSelectedPaymentMethod(null);
		setIsCartVisible(true);
		setIsPaymentOpen(false);
		setShowThankYou(true);
	}

	function proceedToCheckout() {
		setIsCustomerDetailsOpen(true);
	}

	function submitCustomerDetails(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsCustomerDetailsOpen(false);
		setSelectedPaymentMethod(null);
		setIsPaymentOpen(true);
	}

	const paymentMethods: { id: PaymentMethod; name: string; detail: string; mark: string }[] = [
		{ id: "cash", name: fulfillmentMethod === "pickup" ? "Cash on pickup" : "Cash on delivery", detail: "Pay when your order is ready.", mark: "RM" },
		{ id: "transfer", name: "Online transfer", detail: "Complete your transfer through your bank app.", mark: "BT" },
		{ id: "duitnow", name: "DuitNow QR", detail: "Scan the QR code with your banking app.", mark: "QR" },
		{ id: "tng", name: "Touch 'n Go eWallet", detail: "Pay securely with your Touch 'n Go eWallet.", mark: "TNG" },
		{ id: "grabpay", name: "GrabPay", detail: "Pay securely with your GrabPay wallet.", mark: "GP" },
	];

	if (isPaymentOpen) return <div className="payment-page">
		<header className="topbar"><a className="brand" href="#top" aria-label="US Pizza home" onClick={() => setIsPaymentOpen(false)}><img src={usPizzaLogo} alt="US Pizza" /></a><button className="back-to-cart" onClick={() => setIsPaymentOpen(false)}>← Back to cart</button></header>
		<main className="payment-main"><section className="payment-content"><div className="payment-intro"><p className="eyebrow">Step 3</p><h1>Choose how to pay.</h1><p>Select a payment method to complete your order from <strong>{outlets[selectedOutlet].name}</strong>.</p></div><div className="payment-layout"><div className="payment-methods" role="radiogroup" aria-label="Payment methods">{paymentMethods.map((method) => <button key={method.id} className={`payment-method ${selectedPaymentMethod === method.id ? "selected" : ""}`} onClick={() => setSelectedPaymentMethod(method.id)} role="radio" aria-checked={selectedPaymentMethod === method.id}><span className="payment-mark">{method.mark}</span><span><strong>{method.name}</strong><small>{method.detail}</small></span><span className="payment-radio" /></button>)}</div><aside className="payment-summary"><p className="eyebrow">Order total</p><strong>{money.format(total)}</strong><p>{itemCount} item{itemCount === 1 ? "" : "s"} from {outlets[selectedOutlet].name}</p><button className="place-order-button" disabled={!selectedPaymentMethod} onClick={completeOrder}>Confirm payment <span>{selectedPaymentMethod ? "→" : "Select a method"}</span></button></aside></div></section></main>
	</div>;

	return <div className={`app-shell ${isCartVisible ? "cart-open" : "cart-closed"}`}>
		<header className="topbar"><a className="brand" href="#top" aria-label="US Pizza home"><img src={usPizzaLogo} alt="US Pizza" /></a></header>
		<main id="top">
			<section className="hero"><div className="hero-copy"><p className="eyebrow">Hand-tossed since 1997</p><h1>Your peak pizza experience starts right here.</h1><p className="hero-text">Choose a nearby outlet, build your order, and check out whenever you are ready.</p><a className="primary-action" href="#menu">Order the menu <span>→</span></a></div><div className="hero-image"><img src={usPizzaHero} alt="US Pizza pepperoni pizza with a cheesy slice" /></div></section>
			<section className="fulfillment-section" aria-labelledby="fulfillment-title"><div><p className="eyebrow">Step 1</p><h2 id="fulfillment-title">How would you like your pizza?</h2></div><div className="fulfillment-options"><button className={`fulfillment-option ${fulfillmentMethod === "delivery" ? "selected" : ""}`} onClick={() => setFulfillmentMethod("delivery")}><span className="fulfillment-mark">D</span><span><strong>Delivery</strong><small>Bring your order to your address.</small></span><span className="outlet-radio" /></button><button className={`fulfillment-option ${fulfillmentMethod === "pickup" ? "selected" : ""}`} onClick={() => setFulfillmentMethod("pickup")}><span className="fulfillment-mark">P</span><span><strong>Pickup</strong><small>Collect it from your selected outlet.</small></span><span className="outlet-radio" /></button></div></section>
			<section className="outlet-section" aria-labelledby="outlet-title"><div><p className="eyebrow">Step 2</p><h2 id="outlet-title">Choose your outlet</h2><button className="location-button" onClick={useCurrentLocation} disabled={locationStatus === "requesting"}>{locationStatus === "requesting" ? "Finding nearby outlets..." : "Use my current location"}</button>{locationStatus === "available" && <small className="location-status">Outlets are sorted by estimated straight-line distance.</small>}{locationStatus === "unavailable" && <small className="location-status">Location was unavailable. You can still choose an outlet.</small>}</div><div className="outlet-list">{displayedOutlets.map(({ outlet, index, calculatedDistance }) => <button key={outlet.name} className={`outlet-option ${selectedOutlet === index ? "selected" : ""}`} onClick={() => setSelectedOutlet(index)}><span className="outlet-radio" /><span><strong>{outlet.name}</strong><small>{outlet.address}</small></span>{calculatedDistance !== undefined && <b>{calculatedDistance.toFixed(1)} km</b>}</button>)}</div></section>
			<section className="menu-section" id="menu" aria-labelledby="menu-title"><div className="menu-heading"><div><p className="eyebrow">Step 3</p><h2 id="menu-title">Build your table.</h2></div><p>{visibleMenu.length} favourites ready for your order</p></div><div className="category-tabs" aria-label="Menu categories">{categories.map((category) => <button key={category} className={selectedCategory === category ? "active" : ""} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div><div className="menu-grid">{visibleMenu.map((item) => <article className="menu-item" key={item.id}><div className="food-image"><img src={item.image} alt="" />{item.badge && <span>{item.badge}</span>}</div><div className="item-detail"><p className="item-category">{item.category}</p><h3>{item.name}</h3><p>{item.description}</p><div className="item-footer"><strong>{money.format(item.price)}</strong><button onClick={() => openCustomization(item)} aria-label={`Customize ${item.name}`}>+</button></div></div></article>)}</div></section>
		</main>
		{isCartVisible ? <aside className="cart-island" aria-label="Your order"><div className="cart-head"><div><p className="eyebrow">Your order</p><h2>Cart <small>{itemCount}</small></h2></div><button className="close-cart-button" onClick={() => setIsCartVisible(false)} aria-label="Minimize cart">x</button></div><p className="cart-outlet">{fulfillmentMethod === "delivery" ? "Delivery from" : "Pickup from"} <strong>{outlets[selectedOutlet].name}</strong></p>{cart.length === 0 ? <div className="empty-cart"><b>Your cart is empty.</b><p>Pick a favourite from the menu to get started.</p></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.cartId}><img src={item.image} alt="" /><div><h3>{item.name}</h3><p>{money.format(item.price)}</p>{item.specialInstructions && <small className="cart-preferences">Note: {item.specialInstructions}</small>}<div className="quantity-control"><button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} aria-label={`Remove one ${item.name}`}>-</button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} aria-label={`Add one ${item.name}`}>+</button></div></div><strong>{money.format(item.price * item.quantity)}</strong></div>)}</div><div className="order-total"><p><span>Subtotal</span><b>{money.format(subtotal)}</b></p><p><span>Service fee</span><b>{money.format(serviceFee)}</b></p><p className="grand-total"><span>Total</span><b>{money.format(total)}</b></p></div><button className="checkout-button" disabled={!fulfillmentMethod} onClick={proceedToCheckout}>{fulfillmentMethod ? "Continue to payment" : "Choose delivery or pickup"}<span>{money.format(total)}</span></button></>}</aside> : <button className="reopen-cart-button" onClick={() => setIsCartVisible(true)} aria-label={`Open cart with ${itemCount} items`}><span aria-hidden="true">🛒</span><b>{itemCount}</b></button>}
		<a className="crawler-knowledge-link" href="/botpress-knowledge.html">US Pizza chatbot knowledge base</a>
		{showThankYou && <div className="thank-you-layer" role="dialog" aria-modal="true" aria-labelledby="thank-you-title"><section className="thank-you-panel"><button className="thank-you-close" onClick={() => setShowThankYou(false)} aria-label="Close confirmation">x</button><span className="thank-you-mark">+</span><p className="eyebrow">Order confirmed</p><h2 id="thank-you-title">Thanks for buying pizza from us!</h2><p>Your order is estimated to be ready in 10-15 minutes.</p></section></div>}
		{isCustomerDetailsOpen && <div className="address-layer" role="dialog" aria-modal="true" aria-labelledby="customer-details-title"><section className="address-panel"><button className="close-button" onClick={() => setIsCustomerDetailsOpen(false)} aria-label="Close customer details form">x</button><p className="eyebrow">{fulfillmentMethod === "delivery" ? "Delivery details" : "Pickup details"}</p><h2 id="customer-details-title">{fulfillmentMethod === "delivery" ? "Where should we bring it?" : "Who is collecting the order?"}</h2><p>{fulfillmentMethod === "delivery" ? "Enter your name and full address before continuing to payment." : "Enter the name for your pickup order before continuing to payment."}</p><form onSubmit={submitCustomerDetails}><label>Your name<input required autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} /></label>{fulfillmentMethod === "delivery" && <><label>Unit, house, or building<input required value={deliveryAddress.unit} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, unit: event.target.value })} /></label><label>Street address<input required value={deliveryAddress.street} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, street: event.target.value })} /></label><div className="address-grid"><label>Postcode<input required inputMode="numeric" value={deliveryAddress.postcode} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, postcode: event.target.value })} /></label><label>City<input required value={deliveryAddress.city} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, city: event.target.value })} /></label></div><label>State<input required value={deliveryAddress.state} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, state: event.target.value })} /></label></>}<button type="submit">Continue to payment <span>→</span></button></form></section></div>}
		{itemToConfigure && <div className="customization-layer" role="dialog" aria-modal="true" aria-labelledby="customization-title"><button className="customization-backdrop" aria-label="Cancel item customization" onClick={() => setItemToConfigure(null)} /><section className="customization-panel"><button className="close-button" onClick={() => setItemToConfigure(null)} aria-label="Close customization">x</button><div className="customization-item"><img src={itemToConfigure.image} alt="" /><div><p className="eyebrow">Add to your order</p><h2 id="customization-title">{itemToConfigure.name}</h2><p>{money.format(itemToConfigure.price)}</p></div></div><label className="instructions-label" htmlFor="special-instructions">Special instructions or dietary restrictions<textarea id="special-instructions" value={specialInstructions} onChange={(event) => setSpecialInstructions(event.target.value)} placeholder="Tell us about allergies, dietary needs, or other requests." maxLength={120} /></label><div className="customization-actions"><button className="cancel-button" onClick={() => setItemToConfigure(null)}>Cancel</button><button className="confirm-button" onClick={addConfiguredItem}>Add to cart <span>{money.format(itemToConfigure.price)}</span></button></div></section></div>}
	</div>;
}

export default App;
