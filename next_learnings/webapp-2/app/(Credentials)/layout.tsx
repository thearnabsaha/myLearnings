import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=' text-center my-5'>
        <h1>Welcome to Credentials Page</h1>
        {children}
    </div>
  )
}

export default layout