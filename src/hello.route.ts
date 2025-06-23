import {
    Controller,
    Get,
    Path,
    Route,
} from "tsoa";


@Route("hello")
export class HelloController extends Controller {
    // /**
    //  * Returns a greeting message.
    //  * @param name The name to greet.
    //  * @returns A greeting message.
    //  */
    @Get("{name}")
    public async getGreeting(@Path() name: string): Promise<string> {
        return `Hello, ${name}!`;
    }
}