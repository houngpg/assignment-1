import {
    Controller,
    Get,
    Path,
    Route,
    SuccessResponse,
} from "tsoa";


@Route("hello")
export class HelloController extends Controller {
    // /**
    //  * Returns a greeting message.
    //  * @param name The name to greet.
    //  * @returns A greeting message.
    //  */
    @Get("{name}")
    @SuccessResponse("200", "Success")
    public async getGreeting(name: string): Promise<string> {
        return `Hello, ${name}!`;
    }
}