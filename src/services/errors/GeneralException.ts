class Exception extends Error{
    private status = 400;

    constructor(message: string, statusCode: number){
        super(message);
        this.status = statusCode;
    };
    
    getStatus(){
        return this.status;
    }
}

export default Exception;