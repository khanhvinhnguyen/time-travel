"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Code, Copy, Check } from "lucide-react"

interface CodeDialogProps {
  selectedDates: string[]
}

export function CodeDialog({ selectedDates }: CodeDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  const generateBashScript = () => {
    const formattedDates = selectedDates.map((date) => date)

    return `#!/bin/bash

# Check and create README.md file if it does not exist
if [ ! -f README.md ]; then
  echo "# GitHub Time Travel" > README.md
  echo "This repository was created using the GitHub Time Travel tool" >> README.md
fi

# Initialize repo if not already exists
# git init

# Set up Git user
git config user.name "username"
git config user.email "email@example.com"

# List of commit dates selected from dateRangePicker
dates=(${formattedDates.map((date) => `"${date}"`).join(" ")})

# Loop through each date and create commit
for date in "\${dates[@]}"; do
  echo "Commit for $date" >> README.md
  git add README.md
  GIT_COMMITTER_DATE="$date 12:00:00" git commit --date="$date 12:00:00" -m "Commit on $date"
done

# Push commit to GitHub (replace <your-repo-url> with your repo link)
git branch -M main
git push -u origin main
`
  }

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.textContent || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Code className="mr-2 h-4 w-4" />
          Generate Code
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bash Script for Selected Dates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md relative">
            <div className="overflow-x-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2 z-10"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <pre ref={codeRef} className="text-sm">{generateBashScript()}</pre>
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            <h3 className="font-medium">Instructions:</h3>
            
            <div className="space-y-2">
              <h4 className="font-medium">1. Create a new GitHub repository</h4>
              <p>Go to GitHub and create a new repository.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Clone repository</h4>
              <p>Use command: <code>git clone &lt;your-repo-url&gt;</code></p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. Create run.sh file</h4>
              <p>Create a new file named run.sh and copy the above code into it.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 border rounded-lg p-4">
                <h4 className="font-medium">macOS/Linux</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open Terminal</li>
                  <li>Navigate to repository: 
                    <code className="block mt-1 bg-muted p-1 rounded">cd path/to/your/repo</code>
                  </li>
                  <li>Make file executable: 
                    <code className="block mt-1 bg-muted p-1 rounded">chmod +x run.sh</code>
                  </li>
                  <li>Run script: 
                    <code className="block mt-1 bg-muted p-1 rounded">./run.sh</code>
                  </li>
                </ol>
              </div>
              
              <div className="space-y-2 border rounded-lg p-4">
                <h4 className="font-medium">Windows</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Install Git Bash (if not installed)</li>
                  <li>Open Git Bash</li>
                  <li>Navigate to repository: 
                    <code className="block mt-1 bg-muted p-1 rounded">cd path/to/your/repo</code>
                  </li>
                  <li>Run script: 
                    <code className="block mt-1 bg-muted p-1 rounded">bash run.sh</code>
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">5. Verify results</h4>
              <p>After the script completes, visit your GitHub repository to see the generated commit history.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

