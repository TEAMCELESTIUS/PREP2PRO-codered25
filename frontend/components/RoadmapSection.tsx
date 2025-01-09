import { Gauge, BookOpen, Code, ClipboardCheck, Trophy } from 'lucide-react'

const roadmapSteps = [
  { step: 'Assess', description: 'Evaluate your current skills and identify areas for improvement.', icon: Gauge },
  { step: 'Learn', description: 'Acquire new knowledge and skills through our comprehensive curriculum.', icon: BookOpen },
  { step: 'Practice', description: 'Apply your learning through hands-on projects and coding challenges.', icon: Code },
  { step: 'Review', description: 'Get feedback on your work and refine your understanding.', icon: ClipboardCheck },
  { step: 'Excel', description: 'Stand out in interviews and land your dream tech job.', icon: Trophy },
]

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Your Path to Success</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Follow our proven roadmap to land your dream tech job.
          </p>
        </div>

        <div className="mt-20">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              {roadmapSteps.map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className="relative w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto z-10">
                    <span className="text-white font-semibold">{index + 1}</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-900 bg-white px-2 relative z-10">{step.step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {roadmapSteps.map((item) => (
            <div key={item.step} className="flex flex-col items-center">
              <div className="w-24 h-24 mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                <item.icon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{item.step}</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

