import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import reviewsRouter from "./reviews";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import contactRouter from "./contact";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(reviewsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(contactRouter);
router.use(adminRouter);

export default router;
