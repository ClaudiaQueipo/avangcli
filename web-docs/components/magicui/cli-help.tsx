"use client"

import { cn } from "@/lib/utils"

interface CLIHelpProps {
  className?: string
}

export const CLIHelp = ({ className }: CLIHelpProps) => {
  const helpContent = `<span class="text-cyan-400">$ avangcli --help</span>
<span class="text-white">Usage: avangcli &lt;command&gt; [options]</span>

<span class="text-lime-400 font-bold">Commands:</span>
  <span class="text-white font-mono">avangcli init [project-name]</span>   <span class="text-gray-400">Initialize a new Next.js project with optional
                                 configurations</span>
  <span class="text-white font-mono">avangcli config</span>                <span class="text-gray-400">Regenerate avangclirc.json based on current
                                 project configuration</span>
  <span class="text-white font-mono">avangcli generate</span>              <span class="text-gray-400">Generate TypeScript clients from OpenAPI
                                 specifications</span>
  <span class="text-white font-mono">avangcli module &lt;module-name&gt;</span>  <span class="text-gray-400">Generate a new module in an existing Next.js
                                 application</span>
  <span class="text-white font-mono">avangcli ui-library [library]</span>  <span class="text-gray-400">Add a UI component library to your Next.js
                                 project</span>

<span class="text-lime-400 font-bold">Options:</span>
  <span class="text-white font-mono">-h, --help</span>     <span class="text-gray-400">Show help</span>                                             <span class="text-gray-400">[boolean]</span>
  <span class="text-white font-mono">-v, --version</span>  <span class="text-gray-400">Show version number</span>                                   <span class="text-gray-400">[boolean]</span>

<span class="text-gray-400">For more information, visit: </span><span class="text-cyan-400 underline">https://github.com/ClaudiaQueipo/avangcli</span>`

  return (
    <div
      className={cn(
        "text-sm leading-relaxed font-mono whitespace-pre text-left p-6 bg-black/50 rounded-lg border border-gray-800",
        className
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: helpContent }} />
    </div>
  )
}
