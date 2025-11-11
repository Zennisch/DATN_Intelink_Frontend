// Dev-only filters to reduce console warning noise from Reanimated strict-mode
// Ref: https://docs.swmansion.com/react-native-reanimated/docs/debugging/logger-configuration
// This does not affect production builds.

// Apply a synchronous console.warn filter for the repetitive Reanimated messages
if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    try {
      const msg = String(args?.[0] ?? '');
      if (
        msg.includes('Reading from `value` during component render') ||
        msg.includes('Writing to `value` during component render')
      ) {
        return; // suppress only these repetitive warnings
      }
    } catch {}
    // forward everything else
    originalWarn.apply(console, args as []);
  };
}
try {
  if (__DEV__) {
    // Dynamic import to avoid type issues / missing export on certain versions
    // Note: We avoid top-level await; schedule the import immediately in dev.
    import('react-native-reanimated').then((Reanimated: any) => {
      const setLogger = Reanimated?.setLogger ?? Reanimated?.default?.setLogger;
      if (typeof setLogger !== 'function') return;
      setLogger({
      // keep normal logs disabled to reduce noise
      log: () => {},
      warn: (message?: unknown, ...optionalParams: unknown[]) => {
        const msg = String(message ?? '');
        // Filter the repetitive messages about reading/writing during render
        if (
          msg.includes('Reading from `value` during component render') ||
          msg.includes('Writing to `value` during component render')
        ) {
          return;
        }
        // Forward other warnings
        console.warn(message, ...optionalParams);
      },
      error: (...args: unknown[]) => {
        console.error(...args);
      },
      });
    });
  }
} catch {
  // ignore if reanimated is not available
}
