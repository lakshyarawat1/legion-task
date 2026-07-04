import React from 'react'
import Navbar from './(components)/Navbar/page'
import Sidebar from './(components)/Sidebar/page'

const DashboardWrapper = ({ children }: { children:React.ReactNode }) => {
  return (
      <div className='flex min-h-screen w-full bg-background text-foreground'>
          <Sidebar />
          <main className='flex w-full flex-col bg-background md:pl-64'>
              <Navbar />
              {children}
          </main>
    </div>
  )
}

export default DashboardWrapper