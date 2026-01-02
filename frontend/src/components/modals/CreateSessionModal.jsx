/**
 * CreateSessionModal Component
 * Modal form for creating new interview sessions
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import Button from "../common/Button";
import useUIStore from "../../store/ui.store";
import useSessionStore from "../../store/session.store";
import { createSession } from "../../services/session.service";
import { DIFFICULTY_LEVELS, ROUTES } from "../../utils/constants";

const CreateSessionModal = () => {
  const navigate = useNavigate();
  const {
    isCreateSessionModalOpen,
    closeCreateSessionModal,
    showNotification,
  } = useUIStore();
  const { addSession } = useSessionStore();

  const [formData, setFormData] = useState({
    problem: "",
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.problem.trim().length < 10) {
      setError("Problem description must be at least 10 characters");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create session via API
      const newSession = await createSession(formData);

      // Add to store
      addSession(newSession);

      // Show success notification
      showNotification("success", "Session created successfully!");

      // Close modal
      closeCreateSessionModal();

      // Navigate to session room
      navigate(ROUTES.SESSION_ROOM.replace(":id", newSession._id));

      // Reset form
      setFormData({
        problem: "",
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
      });
    } catch (err) {
      setError(err.message || "Failed to create session");
      showNotification("error", err.message || "Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      closeCreateSessionModal();
      setFormData({
        problem: "",
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
      });
      setError("");
    }
  };

  return (
    <Modal
      isOpen={isCreateSessionModalOpen}
      onClose={handleClose}
      title="Create Interview Session"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Problem Input */}
        <div>
          <label
            htmlFor="problem"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Problem Description
          </label>
          <textarea
            id="problem"
            name="problem"
            rows={4}
            value={formData.problem}
            onChange={handleChange}
            placeholder="e.g., Implement a function to reverse a linked list"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            required
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Minimum 10 characters
          </p>
        </div>

        {/* Difficulty Select */}
        <div>
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Difficulty Level
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            required
          >
            <option value={DIFFICULTY_LEVELS.EASY}>Easy</option>
            <option value={DIFFICULTY_LEVELS.MEDIUM}>Medium</option>
            <option value={DIFFICULTY_LEVELS.HARD}>Hard</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSessionModal;
