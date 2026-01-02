/**
 * TopNav Component
 * Navigation bar with authentication and theme toggle
 */

import { Link, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import Button from "../common/Button";
import useDarkMode from "../../hooks/useDarkMode";
import { ROUTES } from "../../utils/constants";

const TopNav = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { isDarkMode, toggleTheme } = useDarkMode();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={isSignedIn ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="flex items-center space-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
              <span className="text-lg font-bold text-white">IM</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Interview Me
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Auth Actions */}
            {isSignedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.SESSIONS)}
                >
                  Sessions
                </Button>
                <UserButton
                  afterSignOutUrl={ROUTES.HOME}
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.SIGN_IN)}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.SIGN_UP)}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
