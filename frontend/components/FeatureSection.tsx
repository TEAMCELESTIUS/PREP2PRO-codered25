import { Cpu, MessageSquare, Clock, Code2, FileText, PenTool, Map, BookOpen } from 'lucide-react'


// Define types for FeatureCard props
type FeatureCardProps = {
  icon: React.ElementType; // React component passed as the icon
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: IconComponent, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white">
          <IconComponent className="h-6 w-6" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

// Define types for SectionCard props
type SectionCardProps = {
  title: string;
  children: React.ReactNode; // Accepts any valid React children
  columns?: number; // Default to 4
};

const SectionCard: React.FC<SectionCardProps> = ({ title, children, columns = 4 }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h3>
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}
    >
      {children}
    </div>
  </div>
);

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900">Supercharge Your Interview Prep</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Our cutting-edge features are designed to give you the edge in tech interviews.
          </p>
        </div>

        <SectionCard title="AI-Integrated Interview Simulation">
          <FeatureCard
            icon={Cpu}
            title="AI-Powered Interviews"
            description="Experience realistic interviews with our advanced AI technology."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Technical Follow-ups"
            description="Get challenged with specific and technical follow-up questions."
          />
          <FeatureCard
            icon={Clock}
            title="Proctored Sessions"
            description="Practice under timed, proctored conditions for real-world pressure."
          />
          <FeatureCard
            icon={Code2}
            title="Integrated Code Editor"
            description="Solve coding challenges directly within the interview interface."
          />
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard title="Resume Evaluation" columns={2}>
            <FeatureCard
              icon={FileText}
              title="ATS Score"
              description="Get your resume scored by Applicant Tracking Systems (ATS)."
            />
            <FeatureCard
              icon={PenTool}
              title="Suggestions & Improvements"
              description="Receive tailored advice to enhance your resume's impact."
            />
          </SectionCard>

          <SectionCard title="Personalized Roadmaps" columns={2}>
            <FeatureCard
              icon={Map}
              title="Domain-Based Roadmaps"
              description="Follow curated learning paths for your specific tech domain."
            />
            <FeatureCard
              icon={BookOpen}
              title=" Resources"
              description="Access a rich library of text articles and video tutorials."
            />
          </SectionCard>
        </div>
      </div>
    </section>
  )
}






