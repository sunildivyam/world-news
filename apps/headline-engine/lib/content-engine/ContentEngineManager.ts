// lib/content-engine/ContentEngineManager.ts

import { contentEngine } from "@worldnews/shared/server";
import type { ContentEngineProgress } from "@worldnews/shared/server/content-engine/ContentEngineProgress.interface";

class ContentEngineManager {
  isRunning = false;
  progress: ContentEngineProgress = {
    logs: [],
    headlines: [],
    articles: [],
  };

  constructor() {
    contentEngine.onProgress = (data: ContentEngineProgress) => {
      this.progress = { ...data };
    };
  }

  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    contentEngine.cancel = false;

    contentEngine.start().finally(() => {
      this.isRunning = false;
    });
  }

  stop() {
    contentEngine.stop();
    this.isRunning = false;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      progress: this.progress,
    };
  }
}

export const engineManager = new ContentEngineManager();
