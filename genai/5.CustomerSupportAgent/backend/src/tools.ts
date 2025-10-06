import { tool } from "@langchain/core/tools";
import z from "zod";

const allCoupons = [
    {
        coupon: "GET10",
        description: "10% off on everything"
    },
    {
        coupon: "ICICI20",
        description: "10% off on everything for ICICI Credit Cards"
    },
    {
        coupon: "SBI30",
        description: "30% off on everything for SBI Credit Cards"
    },
]
const GetCoupons = () => {
    return allCoupons
}
export const GetCouponsTool = tool(
    //@ts-ignore
    async ({ query }) => {
        // async () => {
        const coupons = GetCoupons()
        return coupons;
    },
    {
        name: "GetCoupons",
        description: "Shares all the coupons",
        schema: z.object({
            query: z.string().describe("The query to use to search all the coupons"),
        }),
    }
);