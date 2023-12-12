import { Link } from "react-router-dom"

type Props = {
  infoText: string,
  linkText: string,
  linkHref: string
}

export function RedirectBlock({infoText, linkText, linkHref}: Props) {
  return (
    <div className="flex flex-col text-sm">
      <div>{infoText}</div>
      <Link to={linkHref} className="text-blue-800 hover:text-blue-600 active:text-blue-400">{linkText}</Link>
    </div>
  )
}