"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Cpu, FileText, Map, BarChart2, Calendar, BookOpen } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

// Define types for DashboardCard props
type DashboardCardProps = {
  icon: React.ElementType;
  title: string;
  value: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: IconComponent, title, value }) => {
  return (
    <Card className="w-full bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-6 flex items-center">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-[#2563EB] rounded-full mr-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
          <IconComponent size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#2563EB] mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Image src="/prep2prologo.svg" alt="PREP2PRO Logo" width={120} height={120} />
            <h1 className="ml-3 text-2xl font-bold text-[#2563EB]">PREP2PRO</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Welcome to Your Dashboard</h2>

        {/* Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Interview Simulation Card */}
          <Link href='/interview' className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-[#2563EB] rounded-full mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                <Cpu size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#2563EB] mb-2 group-hover:text-blue-700 transition-colors duration-300">Master Your Interviews</h3>
              <p className="text-gray-600">Experience AI-powered mock interviews tailored to your skill level and desired role.</p>
            </div>
          </Link>

          {/* Resume Evaluation Card */}
          <Link href="/resume" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-[#2563EB] rounded-full mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                <FileText size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#2563EB] mb-2 group-hover:text-blue-700 transition-colors duration-300">Polish Your Resume</h3>
              <p className="text-gray-600">Get expert feedback on your resume to stand out from the competition.</p>
            </div>
          </Link>

          {/* Roadmaps Card */}
          <Link href="/roadmap" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-[#2563EB] rounded-full mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                <Map size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#2563EB] mb-2 group-hover:text-blue-700 transition-colors duration-300">Chart Your Path</h3>
              <p className="text-gray-600">Explore curated learning roadmaps to guide your tech career journey.</p>
            </div>
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <DashboardCard
            icon={BarChart2}
            title="Interview Performance"
            value="85%"
          />
          <DashboardCard
            icon={FileText}
            title="Resume Score"
            value="92/100"
          />
          <DashboardCard
            icon={Calendar}
            title="Interviews Attended"
            value="2"
          />
          <DashboardCard
            icon={BookOpen}
            title="Study Hours This Week"
            value="12.5"
          />
        </div>

        {/* Recent Activity */}
        <Card className="w-full bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#2563EB]">Recent Activity</h2>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-700">
              <span className="w-32 text-sm font-medium">2 hours ago</span>
              <span>Completed Python coding challenge</span>
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-32 text-sm font-medium">Yesterday</span>
              <span>Updated resume with new project</span>
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-32 text-sm font-medium">2 days ago</span>
              <span>Practiced system design interview</span>
            </li>
          </ul>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; 2023 PREP2PRO, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

