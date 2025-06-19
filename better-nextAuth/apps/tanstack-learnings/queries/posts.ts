import axios from 'axios';
type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};
export const getPosts = async ():Promise<Post[]> => {
    const res=await axios.get('https://jsonplaceholder.typicode.com/posts') 
    if(res.status!==200)throw new Error("Failed to posts")
    return res.data
};
export const getPost = async (id:number):Promise<Post> => {
    const res=await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`) 
    if(res.status!==200)throw new Error("Failed to posts")
    return res.data
};