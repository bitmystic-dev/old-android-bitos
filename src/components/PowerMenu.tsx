import { useEffect, useRef, useState } from "react";

import {
  Power,
  Maximize2,
  Minimize2,
  LogOut,
  RefreshCw,
  Moon,
} from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "@/contexts/AuthContext";

import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
} from "@/lib/fullscreen";

import { getVersion } from "@/lib/version";

export function PowerMenu() {
  const [open, setOpen] = useState(false);

  const [fs, setFs] = useState(false);

  const [version, setVersion] =
    useState("loading...");

  const ref = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { signOut } = useAuth();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onFs = () => {
      setFs(isFullscreen());
    };

    getVersion().then(setVersion);

    document.addEventListener("click", onClick);

    document.addEventListener(
      "fullscreenchange",
      onFs
    );

    return () => {
      document.removeEventListener(
        "click",
        onClick
      );

      document.removeEventListener(
        "fullscreenchange",
        onFs
      );
    };
  }, []);

  // GLOBAL MENU CONTROL
  useEffect(() => {
    const closeSelf = () => {
      setOpen(false);
    };

    window.addEventListener(
      "bitos-close-menus",
      closeSelf
    );

    return () => {
      window.removeEventListener(
        "bitos-close-menus",
        closeSelf
      );
    };
  }, []);

  const toggleMenu = () => {
    window.dispatchEvent(
      new CustomEvent("bitos-close-menus")
    );

    setTimeout(() => {
      setOpen((v) => !v);
    }, 0);
  };

  const Item = ({
    icon: Icon,
    label,
    onClick,
    danger,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    danger?: boolean;
  }) => (
    <button
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-left transition-colors duration-150 ${
        danger
          ? "hover:bg-destructive hover:text-destructive-foreground"
          : "hover:bg-secondary"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />

      <span>{label}</span>
    </button>
  );

  return (
    <div
      className="relative overflow-visible z-[99999]"
      ref={ref}
    >
      <button
        onClick={toggleMenu}
        className="bitos-btn !px-2"
        aria-label="Power menu"
        title="Power"
      >
        <Power className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bitos-window p-2 z-[999999] shadow-2xl origin-top-right animate-in fade-in slide-in-from-top-2 overflow-visible">
          <div className="bitos-titlebar -mx-2 -mt-2 mb-2 text-xs">
            power.sys
          </div>

          <div className="space-y-0.5">
            {fs ? (
              <Item
                icon={Minimize2}
                label="Exit Fullscreen"
                onClick={exitFullscreen}
              />
            ) : (
              <Item
                icon={Maximize2}
                label="Enter Fullscreen"
                onClick={enterFullscreen}
              />
            )}

            <Item
              icon={RefreshCw}
              label="Reload BitOS"
              onClick={() =>
                window.location.reload()
              }
            />

            <div className="my-1 h-px bg-border" />

            <Item
              icon={Moon}
              label="Lock (Sign Out)"
              onClick={() => {
                signOut();

                navigate({
                  to: "/login",
                });
              }}
            />

            <Item
              icon={LogOut}
              label="Power Off"
              danger
              onClick={() => {
                try {
                  exitFullscreen();
                } catch {}

                try {
                  window.open("", "_self");
                  window.close();
                } catch {}

                setTimeout(() => {
                  navigate({
                    to: "/powered-off",
                  });
                }, 120);
              }}
            />
          </div>

          <div className="mt-2 px-2 py-1 text-[10px] font-mono opacity-60 border-t border-border pt-2">
            BitOS {version}
          </div>
        </div>
      )}
    </div>
  );
}
