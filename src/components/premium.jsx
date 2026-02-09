import { toast } from '@pheralb/toast';
import axios from 'axios';
import { BASE_URL } from '../utils/contstants';

export const Premium = () => {
  const plans = [
    {
      name: 'Silver',
      price: '₹500',
      period: 'per month',
      amount: 5000, // Amount in INR for API (as per API doc: SILVER - ₹5,000)
      membershipType: 'SILVER',
      description: 'Great to get started and explore the network.',
      features: [
        'Chat with other people',
        '100 connections requests per month',
        'Basic profile visibility',
        'Limited search filters',
        'Standard support',
      ],
      highlight: false,
      badge: 'Starter',
    },
    {
      name: 'Gold',
      price: '₹1000',
      period: 'per month',
      amount: 10000, // Amount in INR for API (as per API doc: GOLD - ₹10,000)
      membershipType: 'GOLD',
      description: 'Perfect balance of visibility and features.',
      features: [
        'Priority profile visibility',
        'Advanced search filters',
        'Priority support',
        'Chat with other people',
        '500 connections requests per month',
        'Basic profile visibility',
        'Limited search filters',
        'Standard support',
      ],
      highlight: true,
      badge: 'Most popular',
    },
    {
      name: 'Platinum',
      price: '₹1500',
      period: 'per month',
      amount: 15000, // Amount in INR for API (as per API doc: PLATINUM - ₹15,000)
      membershipType: 'PLATINUM',
      description: 'Maximize your reach with premium visibility.',
      features: [
        'Top profile visibility',
        'All search filters unlocked',
        'Dedicated premium support',
        'Chat with other people',
        '1000 connections requests per month',
        'Basic profile visibility',
        'Limited search filters',
        'Standard support',
      ],
      highlight: false,
      badge: 'For power users',
    },
  ];

  const handleChoosePlan = async (plan) => {
    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error({
          text: 'Payment gateway not loaded',
          description: 'Please refresh the page and try again.',
        });
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/payment/create`,
        {
          amount: plan.amount,
          membershipType: plan.membershipType,
        },
        { withCredentials: true }
      );

      // According to API doc, response structure is: { message, data: { orderId, amount, currency, notes, ... } }
      console.log('API Response:', response.data);
      const orderData = response.data?.data || response.data;
      console.log('Order Data:', orderData);
      const { amount, orderId, notes, currency } = orderData;

      // Get Razorpay key from response, env, or constants
      // The API might return keyId, or it should be in environment variables
      const keyId =
        orderData.keyId || response.data?.keyId || response.data?.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!keyId) {
        console.error('Razorpay key not found. Check API response or VITE_RAZORPAY_KEY_ID env variable.');
        toast.error({
          text: 'Payment configuration error',
          description: 'Razorpay key not configured. Please contact support.',
        });
        return;
      }

      if (!orderId || !amount) {
        toast.error({
          text: 'Invalid order data',
          description: 'Order details are missing.',
        });
        return;
      }

      const options = {
        key: keyId,
        amount: amount, // Amount is already in paise from API
        currency: currency || 'INR',
        name: 'DevFinder',
        description: `Premium ${plan.name} Membership`,
        order_id: orderId,
        prefill: {
          name: notes?.firstName && notes?.lastName ? `${notes.firstName} ${notes.lastName}` : '',
          email: notes?.emailId || '',
          contact: notes?.phoneNumber || '',
        },
        theme: {
          color: '#272822',
        },
        handler: (response) => {
          // Payment success callback
          console.log('Payment successful:', response);
          toast.success({
            text: 'Payment successful!',
            description: 'Your premium membership is now active.',
          });
          // You might want to redirect or refresh user data here
        },
        modal: {
          ondismiss: () => {
            // User closed the payment modal
            console.log('Payment modal closed');
          },
        },
      };

      console.log('Razorpay Options:', options);

      // Create Razorpay instance
      const razorpay = new window.Razorpay(options);

      // Add error handler
      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed:', response);
        toast.error({
          text: 'Payment failed',
          description: response.error?.description || 'Please try again.',
        });
      });

      // Open Razorpay checkout
      razorpay.open();

      // Show success toast for order creation (not payment)
      toast.success({
        text: 'Order created successfully',
        description: 'Please complete the payment.',
      });
    } catch (error) {
      console.error('Error creating payment order:', error);
      toast.error({
        text: 'Failed to create order',
        description: error.response?.data?.message || 'Please try again later.',
      });
    }
  };

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
            Unlock better visibility, advanced filters, and priority support on DevFinder. Choose the plan that matches
            your goals.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-base-200/70 p-6 sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                plan.highlight ? 'border-primary/70 shadow-primary/10 bg-base-100' : 'border-base-300/70'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-content shadow-lg">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-base-content">{plan.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-base-content/70">{plan.description}</p>
              </div>

              <div className="mb-5 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-semibold text-base-content">{plan.price}</span>
                <span className="text-xs sm:text-sm text-base-content/60">{plan.period}</span>
              </div>

              <ul className="mb-6 space-y-2 text-xs sm:text-sm text-base-content/80">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-primary text-primary-content hover:bg-primary/90'
                    : 'bg-base-300/80 text-base-content hover:bg-base-300'
                }`}
                onClick={() => handleChoosePlan(plan)}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
