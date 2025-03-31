function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>

        {/* Texto opcional */}
        <p className="text-gray-600 font-medium">Carregando...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
