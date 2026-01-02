/**
 * Landing Page
 * Marketing page for unauthenticated users
 */

import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon, 
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import TopNav from '../components/layout/TopNav';
import Footer from '../components/layout/Footer';
import { ROUTES } from '../utils/constants';

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: VideoCameraIcon,
      title: 'Live Video Sessions',
      description: 'Practice interviews with peers in real-time video sessions powered by Stream SDK.',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Chat',
      description: 'Communicate seamlessly with integrated chat functionality during sessions.',
    },
    {
      icon: ClockIcon,
      title: 'Flexible Scheduling',
      description: 'Create or join sessions anytime. Track your progress with session history.',
    },
  ];

  const benefits = [
    'Practice with real interview problems',
    'Get comfortable with video interviews',
    'Build confidence before the big day',
    'Learn from peer feedback',
    'Track your improvement over time',
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-900">
      <TopNav />

      {/* Hero Section */}
      <section className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Title */}
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl lg:text-7xl">
              Practice Interviews,
              <br />
              <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Build Confidence
              </span>
            </h1>

            {/* Hero Description */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Join live mock interview sessions with peers. Practice coding problems, 
              behavioral questions, and system design in a realistic environment.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-4">
              {isSignedIn ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(ROUTES.SIGN_UP)}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(ROUTES.SIGN_IN)}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-12 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
              Why Choose Interview Me?
            </h2>
            <div className="mx-auto max-w-2xl">
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="mr-3 mt-1 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;