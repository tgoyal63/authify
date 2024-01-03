import { Customer } from "@/types/common";

declare global {
    namespace Express {
        interface Request {
            customer: Customer;
        }
    }
}
