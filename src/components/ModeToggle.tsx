"use client";
import * as React from 'react';
import {MoonIcon, SunIcon} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

type ButtonVariantType = {
  variant?: "ghost" | "outline" | "default" | "destructive" | "secondary" | "link" | null | undefined
}

const ModeToggle = ({variant}:ButtonVariantType) => {
  const {theme,setTheme} = useTheme();
  return (
    <Button 
    variant = {variant || 'outline'}
    size='icon'
    onClick={() => setTheme(theme === 'dark'?'light':'dark')}
    >
      <SunIcon className='h-[1.2rem] w-[1.2rem] inline-block  dark:hidden'/>
      <MoonIcon className='h-[1.2rem] w-[1.2rem] hidden dark:inline-block'/>
      <span className='sr-only'>Toggle theme</span>
      </Button>
  )
}

export default ModeToggle