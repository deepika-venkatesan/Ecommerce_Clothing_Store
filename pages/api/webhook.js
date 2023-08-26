import { initMongoose } from "@/lib/mongoose";
//localhost:3000/api/webhook
import Order from "@/models/Order";
import {buffer} from 'micro';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req,res){
    await initMongoose();
    const signingSecret = 'whsec_fdc354c66bacdefd99f9f8e6184f2e9dd3706a3a95939c8a90f47311bfaa5c29';
    const payload = await buffer(req);
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(payload, signature, signingSecret);

    if (event?.type === 'checkout.seesion.completed') {
        const metadata = event.data?.object?.metadata;
        const paymentStatus = event.data?.object?.payment_status;
        if (metadata?.orderId && paymentStatus === 'paid') {
            await Order.findByIdAndUpdate(metadata.orderId, { $set: { paid: 1 } });
        }
    }
    

    res.json('ok')

}

