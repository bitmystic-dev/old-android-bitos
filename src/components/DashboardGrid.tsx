import { useAuth } from "@/contexts/AuthContext";
import { ClockWidget } from "@/widgets/ClockWidget";
import { TasksWidget } from "@/widgets/TasksWidget";
import { HabitsWidget } from "@/widgets/HabitsWidget";
import { QuoteWidget } from "@/widgets/QuoteWidget";
import { StatsWidget } from "@/widgets/StatsWidget";
import { NotesWidget } from "@/widgets/NotesWidget";
import { MusicWidget } from "@/widgets/MusicWidget";
import { ScheduleWidget } from "@/widgets/ScheduleWidget";
import { InspirationWidget } from "@/widgets/InspirationWidget";

export function DashboardGrid() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="bitos-window px-4 py-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="font-display text-2xl sm:text-3xl text-primary">
          welcome back, {user?.displayName || "operator"}
        </h1>
        <span className="font-mono text-xs opacity-70">(dream. build. repeat.)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ClockWidget />
        <StatsWidget />
        <QuoteWidget />
        <TasksWidget />
        <ScheduleWidget />
        <HabitsWidget />
        <MusicWidget />
        <NotesWidget />
        <div className="sm:col-span-2 lg:col-span-3">
          <InspirationWidget />
        </div>
      </div>
    </div>
  );
}
