import Link from 'next/link'

export default function FullstackRoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Full Stack Development Roadmap</h1>
      <p className="mb-4">Here are the steps to become a full stack developer:</p>
      <object
        type="image/svg+xml"
        data="/FULLSTACK_final.svg"
        className="mt-6 w-full h-auto"
      >
        Your browser does not support SVG
      </object>
      <Link href="/roadmap" className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Back to Roadmaps
      </Link>
    </div>
  )
}