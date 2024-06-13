import express  from 'express'
import { CreateOrder, CustomerLogIn, CustomerSignUp, CustomerVerify, EditCutomerProfile, GetCustomerProfile, GetOrders, GetOrdersById, RequestOTP } from '../controllers';
import { Authenticate } from '../middlewares';


const Router = express.Router();

/* ---------------------------- Signup / Create Customer ---------------------------- */

Router.post('/signup', CustomerSignUp)


/* ---------------------------- Login ---------------------------- */

Router.post('/login', CustomerLogIn)


Router.use(Authenticate)


/* ---------------------------- Verify Customer Account ---------------------------- */

Router.patch('/verify', CustomerVerify)

/* ---------------------------- OTP / Requesting OTP ---------------------------- */
Router.get('/otp', RequestOTP)

/* ---------------------------- Profile ---------------------------- */
Router.get('/profile', GetCustomerProfile)

/* ----------------------------  ---------------------------- */
Router.patch('/profile', EditCutomerProfile)


// Card section :- 


// Payment section :-

// Order section :-


Router.post('/create-order',CreateOrder)
Router.get('/orders',GetOrders)
Router.get('/order/:id',GetOrdersById)


export { Router as CustomerRoute };