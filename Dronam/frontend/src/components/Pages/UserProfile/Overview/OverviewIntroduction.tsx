import { Button, Card, Stack } from 'react-bootstrap'
import { useAuthContext } from '@/common/context'

const OverviewIntroduction = () => {
  const { user } = useAuthContext()

  return (
    <>
      <Card.Title className="fw-semibold mb-4">Login Details</Card.Title>
      <dl className="dl-horizontal mb-5">
        <dt>Full Name:</dt>
        <dd>{user?.name || 'Not Available'}</dd>
        <dt>Email Address:</dt>
        <dd>{user?.email || 'Not Available'}</dd>
        <dt>User ID:</dt>
        <dd>{user?.id || 'Not Available'}</dd>
        <dt>Role:</dt>
        <dd>{user?.role || 'Not Available'}</dd>
        <dt>Login Status:</dt>
        <dd>
          <span className="badge bg-success">Authenticated</span>
        </dd>
        <dt>Token Status:</dt>
        <dd>
          <span className="badge bg-info">
            {user?.token ? 'Valid Token' : 'No Token'}
          </span>
        </dd>
        <dt className="mb-0">Last Login:</dt>
        <dd className="mb-0">{new Date().toLocaleString()}</dd>
      </dl>
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <Button
          variant=""
          size="sm"
          className="btn-icon rounded text-white"
          style={{ background: '#3b5998' }}
        >
          <i className="fi fi-brands-facebook"></i>
        </Button>
        <Button
          variant=""
          size="sm"
          className="btn-icon rounded text-white"
          style={{ background: '#1da1f2' }}
        >
          <i className="fi fi-brands-twitter"></i>
        </Button>
        <Button
          variant=""
          size="sm"
          className="btn-icon rounded text-white"
          style={{ background: '#0e76a8' }}
        >
          <i className="fi fi-brands-linkedin"></i>
        </Button>
        <Button
          variant=""
          size="sm"
          className="btn-icon rounded text-white"
          style={{ background: '#c4302b' }}
        >
          <i className="fi fi-brands-youtube"></i>
        </Button>
        <Button
          variant=""
          size="sm"
          className="btn-icon rounded text-white"
          style={{ background: '#333333' }}
        >
          <i className="fi fi-brands-github"></i>
        </Button>
      </Stack>
    </>
  )
}

export default OverviewIntroduction
