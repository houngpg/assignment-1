import { Controller, Get, Path, Route, Request, Post, Body, Put } from "tsoa";
import { type Request as KoaRequest } from 'koa'

import { createOrUpdateBookStock, findBookOnShelf, fulfillOrder } from '../controllers/warehouse'; // Import the controller function to get all orders
import { BookID } from '../constants/bookTypes';
const srcPrefix = 'src.routes';

@Route('warehouse')
export class WarehouseRoutes extends Controller {
    @Get("{bookId}")
    public async getBookOnShelf(bookId: BookID, @Request() request: KoaRequest) {
        const ctx = request.ctx;
        if (!bookId) {
            ctx.status = 400;
        }

        try {
            const bookOnShelf = await findBookOnShelf(bookId);
            ctx.status = 200;
            ctx.body = bookOnShelf;
            return ctx.body;

        } catch (error) {
            console.error("error in /warehouse/:bookId route:", error);
            ctx.status = 500;
            ctx.body = { error: "Internal Server Error" };
        }
    }

    @Post()
    public async createOrUpdateBookStock(
        @Body() requestBody: { shelf: string; bookId: BookID; numberOfBooks: number },
        @Request() request: KoaRequest) {
        const ctx = request.ctx;
        const shelfData: any = requestBody;

        if (!shelfData || !shelfData.shelf || !shelfData.bookId || !shelfData.numberOfBooks) {
            ctx.status = 400;
        }

        try {
            await createOrUpdateBookStock(shelfData.bookId, shelfData.numberOfBooks, shelfData.shelf);
            ctx.status = 201;
            return ctx.status;

        } catch (error) {
            console.error("error in /warehouse route:", error);
            ctx.status = 500;
            ctx.body = { error: "Internal Server Error" };
        }
    }

    @Put('/fulfill/{orderId}')
    public async fulfillOrder(
        @Path() orderId: string,
        @Body() requestBody: { bookId: BookID; quantity: number },
        @Request() request: KoaRequest) {
        const ctx = request.ctx;
        const id = orderId;
        const fulfillBody: any = requestBody;

        if (!id) {
            ctx.status = 400;
        }
        if (!fulfillBody || fulfillBody.length === 0) {
            ctx.status = 400;
        }


        try {
            await fulfillOrder(fulfillBody, id);


            ctx.status = 204;
            return ctx.status;
        } catch (error) {
            console.error("Error message: ", error)
            ctx.status = 500
            ctx.body = { error: "Internal Server Error" };
        }
    }

}