import Exception from "./GeneralException";

class UnauthorizedException extends Exception{
    constructor(message: string){
        super(message, 500);
    };
}

export default UnauthorizedException;