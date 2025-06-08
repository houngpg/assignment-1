import Router from "koa-router";

import { createOrUpdateBookStock, findBookOnShelf } from "../controllers/warehouse";

const router = new Router();

router.post("/", async (ctx) => {

    const shelfData: any = ctx.request.body;

    if (!shelfData || !shelfData.shelf || !shelfData.bookId || !shelfData.numberOfBooks) {
        ctx.status = 400;
    }

    try {
        await createOrUpdateBookStock(shelfData.bookId, shelfData.numberOfBooks, shelfData.shelf);
        ctx.status = 201;

    } catch (error) {
        console.error("error in /warehouse route:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error" };
    }

});

router.get("/:bookId", async (ctx) => {
    const bookId = ctx.params.bookId;

    if (!bookId) {
        ctx.status = 400;
    }

    try {
        const bookOnShelf = await findBookOnShelf(bookId);
        ctx.status = 200;
        ctx.body = bookOnShelf;

    } catch (error) {
        console.error("error in /warehouse/:bookId route:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error" };
    }

})



export default router;