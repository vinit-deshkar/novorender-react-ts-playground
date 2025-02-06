import { getDeviceProfile, View } from "@novorender/api";

export const createView = async (canvas: HTMLCanvasElement): Promise<View> => {
  const gpuTier = 2; // laptop with reasonably new/powerful GPU.
  // Get Device Profile
  const deviceProfile = getDeviceProfile(gpuTier);
  const baseUrl = new URL("/novorender/api/", window.location.origin);
  const imports = await View.downloadImports({ baseUrl });
  // Create a View
  return new View(canvas, deviceProfile, imports);
};
