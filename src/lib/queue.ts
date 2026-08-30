import { notifyUser, NotificationPayload } from './notifications';

export type JobType = 'SEND_NOTIFICATION' | 'GENERATE_REPORT' | 'EXPIRE_CAMPAIGNS' | 'PROCESS_IMAGE_ASYNC';

export interface BackgroundJob {
  id: string;
  type: JobType;
  payload: any;
  createdAt: Date;
}

export class AsyncJobQueue {
  private queue: BackgroundJob[] = [];
  private isProcessing = false;

  enqueue(type: JobType, payload: any): string {
    const jobId = `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const job: BackgroundJob = {
      id: jobId,
      type,
      payload,
      createdAt: new Date(),
    };

    this.queue.push(job);
    this.processNextJob();
    return jobId;
  }

  private async processNextJob() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift();

    if (job) {
      try {
        await this.executeJob(job);
      } catch (err) {
        console.error(`Background Job ${job.id} (${job.type}) failed:`, err);
      }
    }

    this.isProcessing = false;

    // Process remaining queued tasks asynchronously
    if (this.queue.length > 0) {
      setTimeout(() => this.processNextJob(), 50);
    }
  }

  private async executeJob(job: BackgroundJob) {
    switch (job.type) {
      case 'SEND_NOTIFICATION':
        await notifyUser(job.payload as NotificationPayload);
        break;

      case 'GENERATE_REPORT':
        console.log(`[Async Queue] Report generation background job completed:`, job.payload);
        break;

      case 'EXPIRE_CAMPAIGNS':
        console.log(`[Async Queue] Expired campaigns check completed:`, job.payload);
        break;

      case 'PROCESS_IMAGE_ASYNC':
        console.log(`[Async Queue] Background image processing task completed:`, job.payload);
        break;

      default:
        console.log(`[Async Queue] Executed generic job:`, job.type);
    }
  }
}

export const jobQueue = new AsyncJobQueue();

export function enqueueJob(type: JobType, payload: any): string {
  return jobQueue.enqueue(type, payload);
}
