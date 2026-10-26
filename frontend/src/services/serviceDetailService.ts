import { SAMPLE_SERVICE } from "./serviceDetailData";
import type { RequestPayload, ServiceDetail } from "../types/serviceDetail";

/**
 * Returns the same sample service for every id and remembers the requests
 * sent during this session, so the page can show "Request sent" when you
 * come back to it.
 */
const requestedIds = new Set<string>();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const serviceDetailService = {
  async get(id: string): Promise<ServiceDetail> {
    await wait(400);
    return { ...SAMPLE_SERVICE, id, hasActiveRequest: requestedIds.has(id) };
  },

  async createRequest(payload: RequestPayload): Promise<void> {
    await wait(800);
    requestedIds.add(payload.serviceId);
  },
};