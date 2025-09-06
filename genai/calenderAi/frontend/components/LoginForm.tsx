'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false
        });

        if (result?.error) {
            console.error('Login failed:', result.error);
        } else {
            window.location.href = '/dashboard';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Sign In
            </button>
            <button
                type="button"
                onClick={() => signIn('google')}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
                Sign in with Google
            </button>
        </form>
    );
}