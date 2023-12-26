import Exception from "./GeneralException";

class ConflictException extends Exception{
    constructor(message: string){
        super(message, 409);
    };
}

export default ConflictException;