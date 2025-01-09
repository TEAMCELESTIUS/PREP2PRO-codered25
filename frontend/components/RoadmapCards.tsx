'use client'

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ArrowRight } from 'lucide-react'

const roadmap = [
  {
    title: 'DataScience Development',
    description: 'Master HTML, CSS, JavaScript, and modern frontend frameworks',
    path: '/roadmap/datascience',
    color: 'bg-blue-100 hover:bg-blue-200',
  },
  {
    title: 'Software Development',
    description: 'Learn server-side programming, databases, and API development',
    path: '/roadmap/softwaredev',
    color: 'bg-green-100 hover:bg-green-200',
  },
  {
    title: 'Full Stack Development',
    description: 'Combine frontend and backend skills to become a versatile developer',
    path: '/roadmap/fullstack',
    color: 'bg-blue-100 hover:bg-blue-200',
  },
]

export default function RoadmapCards() {
  const router = useRouter()

  const handleCardClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {roadmap.map((item, index) => (
        <Card 
          key={index} 
          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${item.color}`}
          onClick={() => handleCardClick(item.path)}
        >
          <CardHeader>
            <CardTitle className="text-2xl">{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
