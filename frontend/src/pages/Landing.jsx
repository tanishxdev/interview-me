import { SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Video, MessageSquare, Star } from "lucide-react";

export default function Landing() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Practice Technical Interviews
              <span className="block text-primary-600">Like Never Before</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Live video calls, real-time chat, collaborative environment — all
              built for realistic mock interviews.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-base px-8 py-4">
                    Get Started Free
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="text-base font-medium text-primary-600 hover:text-primary-700">
                    Sign in →
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to improve
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Video className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Video Calls
              </h3>
              <p className="mt-3 text-base text-gray-600">
                High-quality video powered by Stream.io
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Real-Time Chat
              </h3>
              <p className="mt-3 text-base text-gray-600">
                Communicate naturally during sessions
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Feedback
              </h3>
              <p className="mt-3 text-base text-gray-600">
                Rate and improve with honest reviews
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
