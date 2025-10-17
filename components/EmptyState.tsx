/**
 * Empty State Components
 * 用于显示空状态和错误状态的组件
 */

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="material-symbols-outlined text-white/20 text-6xl mb-4">
        {icon}
      </span>
      <h3 className="text-white/80 text-base font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-white/50 text-sm mb-4 max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-background-dark text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  retry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="material-symbols-outlined text-red-500/80 text-6xl mb-4">
        error
      </span>
      <h3 className="text-white/80 text-base font-semibold mb-2">{title}</h3>
      <p className="text-white/50 text-sm mb-4 max-w-md">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
