import Exception from "./GeneralException";

class ForbiddenException extends Exception{
    constructor(message: string){
        super(message, 403);
    };
}

export default ForbiddenException;