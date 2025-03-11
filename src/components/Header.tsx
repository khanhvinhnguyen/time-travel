import { Button } from "@/components/ui/button"
import { Clock, Github } from "lucide-react"

export function Header() {
  const AlertGithub = () => {
    alert("Feature in development for auto commit")
  }

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Github <Clock className="inline-block" /> Travel</h1>
        <Button onClick={AlertGithub}>
          <Github className="mr-2 h-4 w-4" />
          Login with GitHub
        </Button>
      </div>
    </header>
  )
}

