import api from "../services/api.js";

export default function SessionCard({ session, onJoin }) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const handleJoin = async () => {
    try {
      await api.post(`/sessions/${session._id}/join`);
      window.location.href = `/session/${session._id}`;
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to join session. It may be full."
      );
      if (onJoin) onJoin(); // Refresh list if needed
    }
  };

  // Extract initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2">
            {session.problem}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Hosted by {session.host?.name || "Anonymous"}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            difficultyColors[session.difficulty] || "bg-gray-100 text-gray-800"
          }`}
        >
          {session.difficulty.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          {/* Custom Avatar */}
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {getInitials(session.host?.name)}
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {session.host?.name || "Host"}
            </p>
            <p className="text-sm text-gray-500">
              Waiting for a participant...
            </p>
          </div>
        </div>

        <button
          onClick={handleJoin}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition transform hover:scale-105 shadow-md"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}
