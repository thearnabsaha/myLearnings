import { tool } from "@langchain/core/tools";
import z from "zod";
import { embedder, pdfLoader, PdfSpiltter } from "./dataExtractor";

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
    async () => {
        const coupons = GetCoupons()
        return coupons;
    },
    {
        name: "GetCoupons",
        description: "Shares all the coupons",
    }
);

const GetData = async (question: string) => {
    const doc = await pdfLoader("../Arnab_CV_1.pdf")
    const spilitDoc = await PdfSpiltter(doc)
    const dbData = await embedder(spilitDoc)
    const relevantChunks = await dbData.similaritySearch(question as string, 3);
    const context = relevantChunks.map((chunk) => chunk.pageContent).join('\n\n');
    const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer:`;
    return userQuery
}
export const GetDataTool = tool(
    //@ts-ignore
    async ({ query }) => {
        const meet = await GetData(query)
        return meet;
    },
    {
        name: "updateCalenderEventTool",
        description: "Update meetings in calender",
        schema: z.object({
            query: z.string().describe("Starting of the meeting"),
        }),
    }
);