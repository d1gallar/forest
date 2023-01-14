import express from 'express';
import products from './products.routes';
import carts from './carts.routes';
import users from './user.routes';
import addresses from './address.routes';
import auth from './auth.routes';
import order from './order.routes';
import stripe from './stripe.routes';
import refund from './refund.routes';
import like from './like.routes';

export const routes = express.Router();

routes.use('/products', products);
routes.use('/cart', carts);
routes.use('/user', users);
routes.use('/address', addresses);
routes.use('/auth', auth);
routes.use('/order', order);
routes.use('/stripe', stripe);
routes.use('/refund', refund);
routes.use('/like', like);