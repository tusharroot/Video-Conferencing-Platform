import React from 'react'
import withAuth from '../utils/withAuth'

function Home() {
  return (
    <div>
      Home Componet
    </div>
  )
}

export default withAuth(Home);
