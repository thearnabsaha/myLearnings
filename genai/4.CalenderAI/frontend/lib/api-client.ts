// lib/api-client.ts
import { getSession } from "next-auth/react"
import axios from "axios"

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
})

apiClient.interceptors.request.use(async (config) => {
    const session = await getSession()

    if (session) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
    }

    return config
})

export default apiClient