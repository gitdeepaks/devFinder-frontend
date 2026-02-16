import { toast } from "@pheralb/toast";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../utils/contstants";

const PLANS = [
	{
		name: "Silver",
		price: "₹500",
		period: "per month",
		amount: 5000,
		membershipType: "SILVER",
		description: "Great to get started and explore the network.",
		features: [
			"Chat with other people",
			"100 connection requests per month",
			"Basic profile visibility",
			"Limited search filters",
			"Standard support",
		],
		highlight: false,
		badge: "Starter",
	},
	{
		name: "Gold",
		price: "₹1000",
		period: "per month",
		amount: 10000,
		membershipType: "GOLD",
		description: "Perfect balance of visibility and features.",
		features: [
			"Everything in Silver",
			"Priority profile visibility",
			"Advanced search filters",
			"500 connection requests per month",
			"Priority support",
		],
		highlight: true,
		badge: "Most popular",
	},
	{
		name: "Platinum",
		price: "₹1500",
		period: "per month",
		amount: 15000,
		membershipType: "PLATINUM",
		description: "Maximize your reach with premium visibility.",
		features: [
			"Everything in Gold",
			"Top profile visibility",
			"All search filters unlocked",
			"1000 connection requests per month",
			"Dedicated premium support",
		],
		highlight: false,
		badge: "For power users",
	},
];

const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 10;

export const Premium = () => {
	const [isPremium, setIsPremium] = useState(false);
	const [isCheckingPremium, setIsCheckingPremium] = useState(true);
	const [creatingOrderFor, setCreatingOrderFor] = useState(null);

	const checkPremiumStatus = useCallback(async () => {
		try {
			const res = await axios.get(`${BASE_URL}/premium/verify`, {
				withCredentials: true,
				validateStatus: (status) => status === 200 || status === 401,
			});
			return res.status === 200;
		} catch {
			return false;
		}
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const premium = await checkPremiumStatus();
				if (!cancelled) setIsPremium(premium);
			} catch {
				if (!cancelled) setIsPremium(false);
			} finally {
				if (!cancelled) setIsCheckingPremium(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [checkPremiumStatus]);

	const handleChoosePlan = async (plan) => {
		try {
			if (!window.Razorpay) {
				toast.error({
					text: "Payment gateway not loaded",
					description: "Please refresh the page and try again.",
				});
				return;
			}

			setCreatingOrderFor(plan.name);
			const response = await axios.post(
				`${BASE_URL}/payment/create`,
				{
					amount: plan.amount,
					membershipType: plan.membershipType,
				},
				{ withCredentials: true },
			);

			const orderData = response.data?.data || response.data;
			const { amount, orderId, notes, currency } = orderData;

			const keyId =
				orderData.keyId ||
				response.data?.keyId ||
				response.data?.razorpayKeyId ||
				import.meta.env.VITE_RAZORPAY_KEY_ID;

			if (!keyId) {
				toast.error({
					text: "Payment configuration error",
					description: "Razorpay key not configured. Please contact support.",
				});
				return;
			}

			if (!orderId || !amount) {
				toast.error({
					text: "Invalid order data",
					description: "Order details are missing.",
				});
				return;
			}

			const handlePaymentSuccess = async () => {
				toast.success({
					text: "Payment successful",
					description: "Activating your premium membership…",
				});
				for (let i = 0; i < POLL_ATTEMPTS; i++) {
					await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
					const premium = await checkPremiumStatus();
					if (premium) {
						setIsPremium(true);
						toast.success({
							text: "Welcome to Premium",
							description: "Your membership is now active.",
						});
						return;
					}
				}
				toast.info({
					text: "Payment received",
					description:
						"Your premium will be active shortly. Refresh the page in a moment.",
				});
			};

			const options = {
				key: keyId,
				amount,
				currency: currency || "INR",
				name: "DevFinder",
				description: `Premium ${plan.name} Membership`,
				order_id: orderId,
				prefill: {
					name:
						notes?.firstName && notes?.lastName
							? `${notes.firstName} ${notes.lastName}`
							: "",
					email: notes?.emailId || "",
					contact: notes?.phoneNumber || "",
				},
				theme: { color: "#272822" },
				handler: handlePaymentSuccess,
				modal: {
					ondismiss: () => {},
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.on("payment.failed", (payload) => {
				toast.error({
					text: "Payment failed",
					description: payload.error?.description || "Please try again.",
				});
			});
			razorpay.open();

			toast.success({
				text: "Complete your payment",
				description: "Use the checkout window to finish.",
			});
		} catch (error) {
			toast.error({
				text: "Failed to create order",
				description: error.response?.data?.message || "Please try again later.",
			});
		} finally {
			setCreatingOrderFor(null);
		}
	};

	if (isCheckingPremium) {
		return (
			<section className="min-h-[calc(100vh-4rem)] bg-base-100 flex items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<span className="loading loading-spinner loading-lg text-primary" />
					<p className="text-sm text-base-content/70">Checking membership…</p>
				</div>
			</section>
		);
	}

	if (isPremium) {
		return (
			<section className="min-h-[calc(100vh-4rem)] bg-base-100">
				<div className="max-w-2xl mx-auto px-4 py-16 text-center">
					<div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10">
						<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
							<svg
								className="h-7 w-7"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<title>Checkmark</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h2 className="text-2xl font-semibold text-base-content mb-2">
							You're a Premium member
						</h2>
						<p className="text-base-content/70">
							You have full access to premium features. Enjoy better visibility
							and support.
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="min-h-[calc(100vh-4rem)] bg-base-100">
			<div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
				<div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
					<p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
						Premium access
					</p>
					<h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-base-content mb-3">
						Premium Membership Plans
					</h2>
					<p className="text-sm sm:text-base text-base-content/70">
						Unlock better visibility, advanced filters, and priority support on
						DevFinder. Choose the plan that matches your goals.
					</p>
				</div>

				<div className="grid gap-6 sm:gap-8 md:grid-cols-3">
					{PLANS.map((plan) => (
						<div
							key={plan.name}
							className={`relative flex flex-col rounded-2xl border bg-base-200/70 p-6 sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
								plan.highlight
									? "border-primary/70 shadow-primary/10 bg-base-100"
									: "border-base-300/70"
							}`}
						>
							{plan.highlight && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-content shadow-lg">
										{plan.badge}
									</span>
								</div>
							)}

							<div className="mb-4">
								<h3 className="text-xl font-semibold text-base-content">
									{plan.name}
								</h3>
								<p className="mt-1 text-xs sm:text-sm text-base-content/70">
									{plan.description}
								</p>
							</div>

							<div className="mb-5 flex items-baseline gap-1">
								<span className="text-3xl sm:text-4xl font-semibold text-base-content">
									{plan.price}
								</span>
								<span className="text-xs sm:text-sm text-base-content/60">
									{plan.period}
								</span>
							</div>

							<ul className="mb-6 space-y-2 text-xs sm:text-sm text-base-content/80">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-2">
										<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
										<span>{feature}</span>
									</li>
								))}
							</ul>

							<button
								type="button"
								className={`mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
									plan.highlight
										? "bg-primary text-primary-content hover:bg-primary/90"
										: "bg-base-300/80 text-base-content hover:bg-base-300"
								}`}
								onClick={() => handleChoosePlan(plan)}
								disabled={creatingOrderFor !== null}
							>
								{creatingOrderFor === plan.name ? (
									<span className="inline-flex items-center gap-2">
										<span className="loading loading-spinner loading-sm" />
										Opening checkout…
									</span>
								) : (
									`Choose ${plan.name}`
								)}
							</button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
