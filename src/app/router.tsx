import { createBrowserRouter } from 'react-router'

import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { AboutPage } from '../pages/AboutPage'
import { AccountPage } from '../pages/AccountPage'
import { AdminDevPanelPage } from '../pages/AdminDevPanelPage'
import { AuthorsPage } from '../pages/AuthorsPage'
import { ExplorePage } from '../pages/ExplorePage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RegisterPage } from '../pages/RegisterPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { MyQuotesPage } from '../pages/MyQuotesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'explore',
        element: <ExplorePage />,
      },
      {
        path: 'authors',
        element: <AuthorsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
  path: 'favorites',
  element: (
    <ProtectedRoute>
      <FavoritesPage />
    </ProtectedRoute>
  ),
},
    {
      path: 'my-quotes',
      element: (
        <ProtectedRoute>
          <MyQuotesPage />
        </ProtectedRoute>
      ),
    },
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/dev-panel',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDevPanelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])