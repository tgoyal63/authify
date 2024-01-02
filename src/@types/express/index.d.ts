import { Customer } from "../../middlewares/auth.middleware";

declare global {
    namespace Express {
        interface Request {
            customer: Customer;
        }
    }
}
