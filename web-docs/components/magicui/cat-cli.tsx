'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

const catFrames = {
  loading: [
    { head: '╭˄───────˄╮', face: '│  ◐ܫ◐   │', chin: '─────────' },
    { head: '╭─˄─────˄─╮', face: '│  ◓ܫ◓   │', chin: '─────────' },
    { head: '╭──˄───˄──╮', face: '│  ◑ܫ◑   │', chin: '─────────' },
    { head: '╭─˄─────˄─╮', face: '│  ◒ܫ◒   │', chin: '─────────' },
  ],
  success: [
    { head: '╭˄───────˄╮', face: '│  ^ܫ^    │', chin: '─────────' },
  ],
  idle: [
    { head: '╭˄───────˄╮', face: '│  ≽ܫ≼    │', chin: '─────────' },
  ],
};

type CatState = keyof typeof catFrames; 

interface CLIPhase {
    text: string;
    state: CatState;
    duration: number | null;
    line2: string;
}

const cliSequence: CLIPhase[] = [
  { text: "Running openapi-generator-cli...", state: 'loading', duration: 2000, line2: "this may take a moment ⏳" },
  { text: "Generating TypeScript interfaces...", state: 'loading', duration: 1500, line2: "Adding data models and API services" },
  { text: "Adding Zod validation schemas...", state: 'loading', duration: 1500, line2: "Your data safety is our priority 🛡️" },
  { text: "Cleaning up temporary files...", state: 'loading', duration: 800, line2: "Almost done grooming! 🧹" },
  { text: "✔ All done! Your TypeScript client", state: 'success', duration: null, line2: "is ready! 🐱" },
];


const renderBubble = (lines: string[], state: CatState, className?: string) => {
  const getVisualLength = (str: string) => {
    return [...str].reduce((len, char) => len + (char.charCodeAt(0) > 0x1000 ? 2 : 1), 0);
  };

  const visualLengths = lines.map(getVisualLength);
  const maxVisualLength = Math.max(...visualLengths, 35);
  const totalWidth = maxVisualLength + 4; 

  const connectorPos = 4;
  const top = '╭' + '─'.repeat(totalWidth - 2) + '╮';
  const leftPart = '─'.repeat(connectorPos);
  const rightPart = '─'.repeat(totalWidth - 2 - connectorPos - 1);
  const bottom = '╰' + leftPart + 'ᨆ' + rightPart + '╯';
  
  const textClassName = state === 'success' ? 'text-white font-bold' : 'text-white font-normal';

  return (
    <div className={cn("text-cyan-400 mb-1", className)}>
      <div>{top}</div>
      {lines.map((line, index) => {
        const visualLength = visualLengths[index];
        const padding = Math.max(0, totalWidth - 3 - visualLength); 
        
        return (
          <div key={index} className="flex">
            <span>│ </span>
            <span className={textClassName}>{line}</span>
            <span className="whitespace-pre">{' '.repeat(padding)}</span>
            <span>│</span>
          </div>
        );
      })}
      <div>{bottom}</div>
    </div>
  );
};

const renderHelpContent = (className?: string) => {
  const helpLines = [
    "Meow! I'm here to help! Here's the",
    "documentation:                    "
  ];

  const content = `
  
  <span class="text-white font-bold">  COMMAND USAGE</span>

  <span class="text-lime-400">  ➜</span>  avancli
      Launches the interactive setup wizard (with me! 🐱)

  <span class="text-lime-400">  ➜</span>  avancli &lt;backend-file&gt; &lt;output-dir&gt;
      Direct mode for scripts and automation

  <span class="text-white font-bold">  ARGUMENTS</span>

  <span class="text-white font-mono">  backend-file</span>    Path to your FastAPI main.py
  <span class="text-white font-mono">  output-dir</span>      Where to save the TS files

  <span class="text-white font-bold">  EXAMPLES</span>

  <span class="text-gray-400">$ avancli ./main.py ./src/api</span>
  <span class="text-gray-400">$ avancli ../backend/app.py ./frontend/src/generated</span>

  <span class="text-white font-bold">  FLAGS</span>

  <span class="text-white font-mono">  --help, -h</span>      Show this dashboard
  <span class="text-white font-mono">  --version, -v</span>   Show current version

  <span class="text-white font-bold">  OUTPUT STRUCTURE</span>

  <span class="text-white font-mono">  generated/</span>
  <span class="text-gray-400">  ├── models/</span>       TypeScript interfaces
  <span class="text-gray-400">  ├── apis/</span>         API service classes
  <span class="text-gray-400">  ├── schemas/</span>      Zod validation schemas
  <span class="text-gray-400">  ├── runtime.ts</span>    Configuration & base classes
  <span class="text-gray-400">  └── index.ts</span>      Main barrel export
  `;

  const catFrame = catFrames.idle[0];
  const renderedCat = (
    <div className="text-lime-400 font-bold ml-1">
      <div>{catFrame.head}</div>
      <div>{catFrame.face}</div>
      <div>╰{catFrame.chin}╯</div>
    </div>
  );

  return (
    <div className={cn("text-sm leading-tight font-mono whitespace-pre text-left pt-2", className)}>
        <div className="flex flex-col items-start">
            {renderBubble(helpLines, 'idle')}
            {renderedCat}
        </div>
        
        <div 
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: content.replace(/\n\s\s/g, '<br/>') }} 
        />
    </div>
  )
}

interface CatCLIProps {
    mode: 'cli' | 'help';
    className?: string;
}

export const CatCLI = ({ mode, className }: CatCLIProps) => {
  if (mode === 'help') {
    return renderHelpContent(className);
  }

  const [frameIndex, setFrameIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => prev + 1);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentPhase = cliSequence[phaseIndex];
    if (!currentPhase || !currentPhase.duration) return; 

    const timeout = setTimeout(() => {
      setPhaseIndex((prev) => prev + 1);
    }, currentPhase.duration);

    return () => clearTimeout(timeout);
  }, [phaseIndex]);

  const currentPhase = cliSequence[phaseIndex];
  
  if (!currentPhase) return null;

  const frames = catFrames[currentPhase.state];
  const currentFrame = frames[frameIndex % frames.length];
  
  const bubbleLines = currentPhase.line2 
    ? [currentPhase.text, currentPhase.line2] 
    : [currentPhase.text];

  const renderSuccessDetails = useMemo(() => {
      if (currentPhase.state !== 'success') return null;
      
      const fileStructure = `
◇ 📦 <span class="text-lime-400">Generated Files</span> ────────────────╮
│                                     │
│  <span class="text-white font-mono">models/</span>   → TypeScript interfaces  │
│  <span class="text-white font-mono">apis/</span>     → API service classes    │
│  <span class="text-white font-mono">schemas/</span>  → Zod validation         │
│  <span class="text-white font-mono">runtime.ts</span> → Configuration         │
│  <span class="text-white font-mono">index.ts</span>   → Barrel exports        │
│                                     │
├─────────────────────────────────────╯
│
└ <span class="text-lime-400">✨ All done!</span> Import from: "frontend\\src\\generated"
      `;

      return (
          <div 
            className="mt-6 text-gray-400" 
            dangerouslySetInnerHTML={{ __html: fileStructure }} 
          />
      );

  }, [currentPhase.state]);

  return (
    <div className={cn("text-sm leading-tight font-mono whitespace-pre text-left", className)}>
        {renderBubble(bubbleLines, currentPhase.state)}

        <div className="text-lime-400 font-bold ml-1">
            <div>{currentFrame.head}</div>
            <div>{currentFrame.face}</div>
            <div className="text-lime-400">
                ╰{currentFrame.chin}╯
            </div>
        </div>

        {renderSuccessDetails}
    </div>
  );
};