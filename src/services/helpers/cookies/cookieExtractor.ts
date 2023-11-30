import { Request } from "express";

const coookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.signedCookies) {
      token = req.signedCookies['access_token'];
    }
    return token;
}

export default coookieExtractor