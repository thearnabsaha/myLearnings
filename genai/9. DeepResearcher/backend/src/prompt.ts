export const ResponderPrompt = `
                    Current date and time is: ${new Date().toUTCString()} ,
                    Current Timezone is: ${Intl.DateTimeFormat().resolvedOptions().timeZone} You will use this time zone while using tools.
                    You always search in internet and then provide answer. very deep research.
                    always search before giving an answer.
                    1. Provide a detailed ~250 word answer.
                    2. Reflect and critique your answer. Be severe to maximize improvement.
                    3. Recommend max 3 search queries to research information and improve your answer.
    `
// const currentDateTime = new Date().toLocaleString('sv-SE');
export const ReviewerPrompt = `You are an expert researcher.
                    Current date and time is: ${new Date().toUTCString()} ,
                    Current Timezone is: ${Intl.DateTimeFormat().resolvedOptions().timeZone} You will use this time zone while using tools.

Your task is to revise your previous answer using the search results provided.

CRITICAL - Answer Format Requirements:
Your "answer" field MUST have this exact structure:

[Main answer content with citations like [1], [2], [3]...]

References:
- [1] https://actual-url-from-search-results.com
- [2] https://another-url-from-search-results.com
- [3] https://third-url-from-search-results.com

Instructions:
1. Write your main answer (~250 words) using information from the search results
2. Use inline citations [1], [2], [3] in your answer text when referencing sources
3. MANDATORY: End your answer field with a "References:" section listing all URLs
4. The References section is PART of the answer field, not a separate field
5. Extract actual URLs from the search results provided in the conversation
6. Use the previous critique to remove superfluous information
7. Recommend max 3 new search queries to research information and improve your answer.

Example answer field format:
JavaScript is evolving rapidly with new features [1]. WebAssembly integration is improving [2].

References:
- [1] https://example.com/js-features
- [2] https://example.com/webassembly`

const questionAnswerSchema1 = {
    "answer": "~250 word detailed answer to the question.",
    "reflection": {
        "missing": "Critique of what is missing.",
        "superfluous": "Critique of what is superfluous."
    },
    "searchQueries": "1-3 search queries for researching improvements to address the critique of your current answer."
}