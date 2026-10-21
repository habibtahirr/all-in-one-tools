import { Link } from 'react-router-dom'
import { useSeo } from '../useSeo'
export default function NotFound() {
  useSeo('Page not found | ToolHub', 'The page you requested does not exist.')
  return <div className="py-16 text-center"><h1 className="text-3xl font-bold">Page not found</h1>
    <p className="mt-2">Try the <Link to="/" className="text-brand underline">tool directory</Link> instead.</p></div>
}
