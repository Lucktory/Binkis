interface TopbarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Topbar({ title, description, action }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-8">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">{title}</h1>
        {description ? (
          <p className="text-xs text-ink-500">{description}</p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
