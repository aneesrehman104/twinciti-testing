import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AddCard from './AddCard';

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC__STRIPE_KEY}`);

export default function StripeWrapper({ setCallApiAgain }) {
    return (
        <Elements stripe={stripePromise}>
            <AddCard setCallApiAgain={setCallApiAgain} />
        </Elements>
    );
}
