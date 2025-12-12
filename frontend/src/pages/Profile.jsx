import { useUser } from "@clerk/clerk-react";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <div className="card">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user?.firstName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.fullName || "User"}
            </h2>
            <p className="text-gray-600">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600">
              You're a valued member of Interview.me! Practice interviews,
              improve your skills, and help others do the same.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stats</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary-600">12</p>
                <p className="text-gray-600">Sessions Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">4.8</p>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">5</p>
                <p className="text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
