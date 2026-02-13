import { StateSchema, MessagesValue } from "@langchain/langgraph";
export const MessagesState = new StateSchema({
    messages: MessagesValue,
});
