import z from "zod";

const reflectionSchema = z.object({
    missing: z.string().describe('Critique of what is missing.'),
    superfluous: z.string().describe('Critique of what is superfluous'),
});

export const questionAnswerSchema = z.object({
    answer: z.string().describe('~250 word detailed answer to the question.'),
    reflection: reflectionSchema,
    searchQueries: z
        .array(z.string())
        .describe(
            '1-3 search queries for researching improvements to address the critique of your current answer.'
        ),
});

export type QuestionAnswer = z.infer<typeof questionAnswerSchema>;

const questionAnswerSchema1 = {
    "answer": "~250 word detailed answer to the question.",
    "reflection": {
        "missing": "Critique of what is missing.",
        "superfluous": "Critique of what is superfluous."
    },
    "searchQueries":"1-3 search queries for researching improvements to address the critique of your current answer."
}