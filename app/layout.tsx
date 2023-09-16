import './globals.css'
import { Nunito } from 'next/font/google'
import Navbar from './components/Navbar/Navbar'
import RegisterModal from './components/Modals/RegisterModal'
import { Toaster } from 'react-hot-toast'
import ToasterProvider from './providers/ToasterProvider'
import LoginModal from './components/Modals/LoginModal'
import ClientOnly from './components/ClientOnly'
import getCurrentUser from './actions/getCurrentUser'
import RentModal from './components/Modals/RentModal'
import SearchModal from './components/Modals/SearchModal'

export const metadata = {
  title: 'Bienvenue sur BnbAir !',
  description: 'Site de réservation | unkn0w_ind',
}

const font = Nunito({
  subsets: ["latin"]
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser(); // Récupérer l'user connecter

  return (
    <html lang="fr">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RentModal />
          <SearchModal />
          <RegisterModal />
          <LoginModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className='pb-20 pt-28'>
          {children}
        </div>
      </body>
    </html>
  )
}
