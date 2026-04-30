import express from "express";
import {createResturant , updateResturant ,updateOrders ,updateStatus ,getResturant , getResturantOrder ,getSingleResturant, searchResturant} from '../controller/resturant.controller.ts'
import upload from "../middlewares/multer.ts";
import {isAuthenticated} from '../middlewares/isAuthenticated.ts'

const router = express.Router();

router.route('/register').post(isAuthenticated,upload.single('file'), createResturant);
router.route('/single').get(isAuthenticated,getResturant);
router.route('/update').put(isAuthenticated,upload.single('file'), updateResturant);
router.route('/order').get(isAuthenticated, getResturantOrder);
router.route('/order/:orderId/status').put(isAuthenticated, updateStatus);
router.route('/search').get( searchResturant);
router.route('/:storeId').get(isAuthenticated,getSingleResturant);

export default router