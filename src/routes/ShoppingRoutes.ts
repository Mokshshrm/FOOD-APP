import express, { Request, Response } from "express";
import { GetFoodAvaibility, GetFoodsIn30Min, GetTopRestaurants, RestaurantsById, SearchFoods } from '../controllers';

const Router = express.Router()

/* -------------------- Food Availability --------------------- */
Router.get('/:pincode', GetFoodAvaibility)



/* -------------------- Top Restaurants --------------------- */
Router.get('/top-restaurants/:pincode', GetTopRestaurants)


/* -------------------- Foods Available in 30 Minutes --------------------- */
Router.get('/foods-in-30-min/:pincode', GetFoodsIn30Min)



/* -------------------- Search Foods --------------------- */
Router.get('/search/:pincode', SearchFoods)



/* -------------------- Find Restaurants By Id --------------------- */
Router.get('/restaurant/:id', RestaurantsById)






export { Router as ShppingRoute };

