import Exception from "./GeneralException";

class UnauthorizedException extends Exception{
    constructor(message: string){
        super(message, 401);
    };
}

export default UnauthorizedException;