'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'
import { Cpu, Globe, Lock } from 'lucide-react'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('sign-in')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/3 bottom-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Welcome to Prep2Pro</CardTitle>
          <CardDescription className="text-gray-600">Secure access to your tech world</CardDescription>
          <div className="flex justify-center space-x-4 mt-4">
            <Cpu className="text-blue-600" size={24} />
            <Globe className="text-purple-600" size={24} />
            <Lock className="text-indigo-600" size={24} />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <SignInForm />
            </TabsContent>
            <TabsContent value="sign-up">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

