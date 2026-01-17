import React, { useEffect, useMemo, useRef, useState } from "react";

function MentorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10 text-white/90"
      fill="none"
    >
      <path
        d="M8 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 6.5c2.8-2.9 12.2-2.9 16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

function InternIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10 text-white/90"
      fill="none"
    >
      <path
        d="M6 8l6-3 6 3-6 3-6-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 10v5.5c0 .8.4 1.5 1.1 1.9 1.5.9 3.2 1.4 4.9 1.4s3.4-.5 4.9-1.4c.7-.4 1.1-1.1 1.1-1.9V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 9v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

// PUBLIC_INTERFACE
export default function LoginPage() {
  const [activeRole, setActiveRole] = useState(null); // "mentor" | "intern" | null
  const popupRef = useRef(null);

  const roleCopy = useMemo(() => {
    if (activeRole === "mentor") return 'Continue as Mentor';
    if (activeRole === "intern") return 'Continue as Intern';
    return "";
  }, [activeRole]);

  // Click outside popup resets to original two-card layout
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!activeRole) return;
      const popupEl = popupRef.current;
      if (!popupEl) return;
      if (!popupEl.contains(e.target)) {
        setActiveRole(null);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [activeRole]);

  const baseCard =
    "relative w-full rounded-3xl border border-white/20 bg-white/10 backdrop-blur-glass shadow-glass " +
    "px-7 py-8 text-left text-white transition-[transform,opacity,filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
    "hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40";

  const Card = ({ role, title, icon }) => {
    const isActive = activeRole === role;
    const otherActive = activeRole && activeRole !== role;

    // When mentor clicked, intern slides right->left and fades out.
    // When intern clicked, mentor slides left->right and fades out.
    const exitTransform =
      role === "intern"
        ? "-translate-x-10" // intern exits left
        : "translate-x-10"; // mentor exits right

    return (
      <button
        type="button"
        onClick={() => setActiveRole(role)}
        aria-label={`Select ${title} role`}
        className={[
          baseCard,
          "animate-fadeUp",
          isActive ? "scale-[1.01]" : "",
          otherActive ? `opacity-0 ${exitTransform} blur-[1px]` : "opacity-100 translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            {icon}
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">{title}</div>
            <div className="mt-1 text-sm text-white/70">
              {role === "mentor"
                ? "Guide progress and review logs"
                : "Track learning and daily updates"}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70" />
      </button>
    );
  };

  return (
    <div className="min-h-screen w-full bg-t3-teal-800">
      {/* subtle background accents */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-black/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-14">
        <div className="w-full">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              T3 Log
            </h1>
            <p className="mt-3 text-sm text-white/75 sm:text-base">
              Choose your role to continue.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
            <div className="relative">
              <Card role="mentor" title="Mentor" icon={<MentorIcon />} />
            </div>

            <div className="relative">
              {activeRole === "mentor" ? (
                <div
                  ref={popupRef}
                  className="h-full animate-popIn rounded-3xl border border-white/20 bg-white/10 px-7 py-8 text-white shadow-glass backdrop-blur-glass"
                  role="dialog"
                  aria-label="Mentor login panel"
                >
                  <div className="text-xl font-semibold">{roleCopy}</div>
                  <p className="mt-2 text-sm text-white/75">
                    Sign in to access mentoring tools and review intern updates.
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-t3-teal-900 shadow-sm transition duration-300 hover:bg-white/90 active:scale-[0.99]"
                      aria-label="Google Sign-In (placeholder)"
                    >
                      Continue with Google
                    </button>
                    <p className="mt-3 text-xs text-white/60">
                      Google authentication is not implemented yet (UI only).
                    </p>
                  </div>
                </div>
              ) : (
                <Card role="intern" title="Intern" icon={<InternIcon />} />
              )}
            </div>

            {/* When intern is selected, show popup in the left empty space */}
            {activeRole === "intern" && (
              <div className="sm:col-span-2">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div
                    ref={popupRef}
                    className="h-full animate-popIn rounded-3xl border border-white/20 bg-white/10 px-7 py-8 text-white shadow-glass backdrop-blur-glass"
                    role="dialog"
                    aria-label="Intern login panel"
                  >
                    <div className="text-xl font-semibold">{roleCopy}</div>
                    <p className="mt-2 text-sm text-white/75">
                      Sign in to track your learning and submit daily logs.
                    </p>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-t3-teal-900 shadow-sm transition duration-300 hover:bg-white/90 active:scale-[0.99]"
                        aria-label="Google Sign-In (placeholder)"
                      >
                        Continue with Google
                      </button>
                      <p className="mt-3 text-xs text-white/60">
                        Google authentication is not implemented yet (UI only).
                      </p>
                    </div>
                  </div>

                  {/* placeholder to keep grid balance on desktop */}
                  <div className="hidden sm:block" />
                </div>
              </div>
            )}
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center text-xs text-white/60">
            Click outside the popup to reset the role selection.
          </div>
        </div>
      </main>
    </div>
  );
}
