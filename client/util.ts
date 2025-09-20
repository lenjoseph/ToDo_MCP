export const extractId = (output: unknown): string => {
  if (output && typeof output === "object" && (output as any).id) {
    return (output as any).id as string;
  }
  if (typeof output === "string") {
    try {
      const parsed = JSON.parse(output);
      if (parsed && parsed.id) return parsed.id as string;
    } catch {}
    const match = output.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/
    );
    if (match) return match[0];
  }
  throw new Error("Unable to extract todo id from createResultOne.finalOutput");
};

// Utility function to show periodic "working..." messages
export const withPeriodicLogging = <T>(
  promise: Promise<T>,
  message: string = "working..."
): Promise<T> => {
  const interval = setInterval(() => {
    console.log(message);
  }, 3000);

  return promise.finally(() => {
    clearInterval(interval);
  });
};
