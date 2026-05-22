import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";
import { useBitStore } from "@/lib/store";
import { ArrowLeft, FolderPlus, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/projects")({
  component: ProjectsPage,
  head: () => ({ meta: [{ title: "Projects — BitOS" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    project: typeof s.project === "string" ? s.project : undefined,
    board: typeof s.board === "string" ? s.board : undefined,
  }),
});

const ACCENTS = [
  "oklch(0.72 0.2 295)", "oklch(0.75 0.28 330)", "oklch(0.8 0.22 145)",
  "oklch(0.78 0.18 65)", "oklch(0.7 0.18 0)", "oklch(0.65 0.2 220)",
];

function ProjectsPage() {
  const { project: pid, board: bid } = Route.useSearch();
  const projects = useBitStore((s) => s.projects);

  const activeProject = useMemo(() => projects.find((p) => p.id === pid), [projects, pid]);

  if (!activeProject) return <ProjectList />;
  return <ProjectDetail projectId={activeProject.id} boardId={bid} />;
}

function ProjectList() {
  const projects = useBitStore((s) => s.projects);
  const addProject = useBitStore((s) => s.addProject);
  const deleteProject = useBitStore((s) => s.deleteProject);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(ACCENTS[0]);

  const create = () => {
    if (!title.trim()) return;
    addProject({ title: title.trim(), description: desc.trim() || undefined, color });
    setTitle(""); setDesc(""); setOpen(false);
  };

  return (
    <PageShell title="projects" subtitle="workspaces.exe — create a project, then add kanban boards inside it">
      <div className="flex justify-end mb-3">
        <button onClick={() => setOpen(true)} className="bitos-btn">
          <FolderPlus className="h-4 w-4" /> new project
        </button>
      </div>

      {projects.length === 0 ? (
        <RetroWindow title="empty.workspace">
          <div className="py-8 text-center">
            <div className="font-mono text-xs opacity-60 mb-2">// no projects yet</div>
            <p className="text-sm opacity-80 mb-3">Spin up your first project to start organising boards and tasks.</p>
            <button onClick={() => setOpen(true)} className="bitos-btn inline-flex">
              <FolderPlus className="h-4 w-4" /> create project
            </button>
          </div>
        </RetroWindow>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((p) => {
            const cardCount = p.boards.reduce((n, b) => n + Object.keys(b.cards).length, 0);
            return (
              <RetroWindow key={p.id} title={p.title.toLowerCase()} subtitle={`${p.boards.length} boards · ${cardCount} cards`}>
                <div className="flex items-start gap-3">
                  <span
                    className="h-10 w-10 rounded-md border border-border shrink-0"
                    style={{ background: p.color || "var(--color-primary)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2 opacity-90">{p.description || "no description"}</p>
                    <p className="mt-1 font-mono text-[10px] opacity-50">
                      created {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Link to="/projects" search={{ project: p.id }} className="bitos-btn">open →</Link>
                  <button
                    onClick={() => { if (confirm(`Delete project "${p.title}"?`)) deleteProject(p.id); }}
                    className="opacity-50 hover:opacity-100 hover:text-destructive transition"
                    aria-label="Delete project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </RetroWindow>
            );
          })}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[150] bg-background/70 backdrop-blur-sm grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="bitos-window w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="bitos-titlebar">
              <span className="text-sm">new.project</span>
              <button onClick={() => setOpen(false)}><X className="h-3.5 w-3.5" /></button>
            </div>
            <div className="p-4 space-y-3">
              <input
                autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="project title…"
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                value={desc} onChange={(e) => setDesc(e.target.value)}
                placeholder="short description (optional)"
                rows={3}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div>
                <div className="text-xs font-mono opacity-70 mb-1.5">accent</div>
                <div className="flex flex-wrap gap-2">
                  {ACCENTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-foreground" : "border-border"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <button onClick={create} className="w-full bitos-btn justify-center !bg-primary !text-primary-foreground !py-2">
                <Plus className="h-4 w-4" /> create project
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function ProjectDetail({ projectId, boardId }: { projectId: string; boardId?: string }) {
  const project = useBitStore((s) => s.projects.find((p) => p.id === projectId))!;
  const addBoard = useBitStore((s) => s.addBoard);
  const deleteBoard = useBitStore((s) => s.deleteBoard);
  const addColumn = useBitStore((s) => s.addColumn);
  const renameColumn = useBitStore((s) => s.renameColumn);
  const deleteColumn = useBitStore((s) => s.deleteColumn);
  const addCard = useBitStore((s) => s.addCard);
  const updateCard = useBitStore((s) => s.updateCard);
  const deleteCard = useBitStore((s) => s.deleteCard);
  const moveCard = useBitStore((s) => s.moveCard);

  const board = project.boards.find((b) => b.id === boardId) ?? project.boards[0];
  const [composingCol, setComposingCol] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newColTitle, setNewColTitle] = useState("");
  const [showAddCol, setShowAddCol] = useState(false);
  const [movingCardId, setMovingCardId] = useState<string | null>(null); // mobile tap-to-move

  // HTML5 drag state for card target index hint
  const [dragOver, setDragOver] = useState<{ col: string; index: number } | null>(null);

  if (!board) return null;

  const submitCard = (colId: string) => {
    if (!newCardTitle.trim()) return;
    addCard(projectId, board.id, colId, newCardTitle.trim());
    setNewCardTitle(""); setComposingCol(null);
  };

  const submitCol = () => {
    if (!newColTitle.trim()) return;
    addColumn(projectId, board.id, newColTitle.trim());
    setNewColTitle(""); setShowAddCol(false);
  };

  return (
    <PageShell
      title={project.title}
      subtitle={project.description || "kanban.workspace"}
      action={
        <Link to="/projects" search={{}} className="bitos-btn">
          <ArrowLeft className="h-3.5 w-3.5" /> back
        </Link>
      }
    >
      {/* Board tabs */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar">
        {project.boards.map((b) => (
          <Link
            key={b.id}
            to="/projects"
            search={{ project: projectId, board: b.id }}
            className={`bitos-btn !text-xs shrink-0 ${b.id === board.id ? "!bg-primary !text-primary-foreground" : ""}`}
          >
            {b.title}
          </Link>
        ))}
        <button
          onClick={() => {
            const t = prompt("Board name");
            if (t) addBoard(projectId, t);
          }}
          className="bitos-btn !text-xs shrink-0"
        >
          <Plus className="h-3 w-3" /> board
        </button>
        {project.boards.length > 1 && (
          <button
            onClick={() => { if (confirm(`Delete board "${board.title}"?`)) deleteBoard(projectId, board.id); }}
            className="bitos-btn !text-xs shrink-0 opacity-60"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Columns — horizontal scroll on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2 snap-x">
        {board.columns.map((col) => {
          const cards = col.cardIds.map((id) => board.cards[id]).filter(Boolean);
          return (
            <div
              key={col.id}
              className="w-[78vw] sm:w-72 shrink-0 snap-start"
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => {
                e.preventDefault();
                const cardId = e.dataTransfer.getData("text/cardId");
                if (cardId) {
                  const idx = dragOver?.col === col.id ? dragOver.index : cards.length;
                  moveCard(projectId, board.id, cardId, col.id, idx);
                }
                setDragOver(null);
              }}
            >
              <RetroWindow
                title={col.title}
                subtitle={`${cards.length}`}
                action={
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const t = prompt("Rename column", col.title);
                        if (t) renameColumn(projectId, board.id, col.id, t);
                      }}
                      className="text-[10px] opacity-60 hover:opacity-100"
                    >edit</button>
                    <button
                      onClick={() => { if (confirm(`Delete column "${col.title}"?`)) deleteColumn(projectId, board.id, col.id); }}
                      className="opacity-50 hover:opacity-100 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                }
              >
                <ul className="space-y-2 min-h-12">
                  {cards.length === 0 && (
                    <li className="text-[11px] font-mono opacity-40 text-center py-2">// drop cards here</li>
                  )}
                  {cards.map((c, idx) => (
                    <li
                      key={c.id}
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData("text/cardId", c.id); e.dataTransfer.effectAllowed = "move"; }}
                      onDragOver={(e) => { e.preventDefault(); setDragOver({ col: col.id, index: idx }); }}
                      className={`group rounded-md border border-border p-2.5 bg-secondary/40 hover:bg-secondary cursor-grab active:cursor-grabbing transition ${
                        dragOver?.col === col.id && dragOver.index === idx ? "ring-2 ring-primary" : ""
                      } ${movingCardId === c.id ? "ring-2 ring-accent" : ""}`}
                      onClick={() => {
                        if (movingCardId && movingCardId !== c.id) return;
                        if (movingCardId === c.id) setMovingCardId(null);
                        else if (window.matchMedia("(pointer: coarse)").matches) setMovingCardId(c.id);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          value={c.title}
                          onChange={(e) => updateCard(projectId, board.id, c.id, { title: e.target.value })}
                          className="flex-1 bg-transparent text-sm outline-none focus:bg-input rounded px-1 -mx-1"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCard(projectId, board.id, c.id); }}
                          className="opacity-0 group-hover:opacity-60 hover:!opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* mobile move-here target */}
                {movingCardId && (
                  <button
                    onClick={() => {
                      moveCard(projectId, board.id, movingCardId, col.id, cards.length);
                      setMovingCardId(null);
                    }}
                    className="mt-2 w-full text-[11px] font-mono border border-dashed border-accent rounded py-1.5 text-accent"
                  >
                    ↳ move here
                  </button>
                )}

                {composingCol === col.id ? (
                  <div className="mt-2 flex gap-1">
                    <input
                      autoFocus value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") submitCard(col.id); if (e.key === "Escape") setComposingCol(null); }}
                      placeholder="card title…"
                      className="flex-1 text-sm bg-input border border-border rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-ring min-w-0"
                    />
                    <button onClick={() => submitCard(col.id)} className="bitos-btn shrink-0"><Plus className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setComposingCol(col.id); setNewCardTitle(""); }}
                    className="mt-2 w-full text-[11px] font-mono opacity-60 hover:opacity-100 border border-dashed border-border rounded py-1.5"
                  >
                    <Plus className="inline h-3 w-3 mr-1" />add card
                  </button>
                )}
              </RetroWindow>
            </div>
          );
        })}

        {/* Add column */}
        <div className="w-[78vw] sm:w-72 shrink-0 snap-start">
          {showAddCol ? (
            <div className="bitos-window p-2 flex gap-1">
              <input
                autoFocus value={newColTitle} onChange={(e) => setNewColTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitCol(); if (e.key === "Escape") setShowAddCol(false); }}
                placeholder="column name…"
                className="flex-1 text-sm bg-input border border-border rounded-md px-2 py-1 outline-none min-w-0"
              />
              <button onClick={submitCol} className="bitos-btn shrink-0"><Plus className="h-3 w-3" /></button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCol(true)}
              className="w-full h-full min-h-32 rounded-md border border-dashed border-border text-sm font-mono opacity-60 hover:opacity-100"
            >
              <Plus className="inline h-3 w-3 mr-1" /> add column
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
