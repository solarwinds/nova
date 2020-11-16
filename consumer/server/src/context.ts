import { Response } from "express";

export interface Context {
    user?: any;
    response: Response;
}
