import { getDeviceProfile, GPUTier, View } from "@novorender/api";

export class ViewBuilder {
  constructor() {}

  async createView(
    canvas: HTMLCanvasElement,
    gpuTier: GPUTier = 2
  ): Promise<View> {
    // Get Device Profile
    const deviceProfile = getDeviceProfile(gpuTier);
    const baseUrl = new URL("/novorender/api/", window.location.origin);
    const imports = await View.downloadImports({ baseUrl });

    // Create and return a View
    return new View(canvas, deviceProfile, imports);
  }
}
