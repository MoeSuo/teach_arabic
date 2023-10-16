//the purpose of this file is to get and store the Providers data

import { SessionProvider } from "next-auth/react"

 function Provider({children}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
export default Provider
