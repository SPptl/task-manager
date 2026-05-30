function LoadingSpinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
    </div>
  );
}

export default LoadingSpinner;
