import { authApi, useAuthContext } from '@/common'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function useLogin() {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const { isAuthenticated, saveSession } = useAuthContext()

  const redirectUrl = useMemo(
    () => (location.state && location.state.from ? location.state.from.pathname : '/'),
    [location.state],
  )

  const login = async (
    event: React.FormEvent<HTMLFormElement>,
    { email, password }: { email: string; password: string },
  ) => {
    event.preventDefault()
    setLoading(true)

    try {
      const res: any = await authApi.login({ email, password })

      setLoading(false)
      toast.success('Login successful!')

      setTimeout(() => {
        if (res.token) {
          saveSession({ ...(res.user ?? {}), token: res.token })
          navigate(redirectUrl)
        }
      }, 1500)
    } catch (error) {
      setLoading(false)
      toast.error('Invalid email or password!')
    }
  }

  return { loading, login, redirectUrl, isAuthenticated }
}
