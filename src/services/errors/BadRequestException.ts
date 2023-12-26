import Exception from "./GeneralException";

class BadRequestException extends Exception{
    constructor(message: string){
        super(message, 400);
    };
}

export default BadRequestException;