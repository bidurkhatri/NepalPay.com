/**
 * Retry Queue Service for Failed Blockchain Operations
 * Implements exponential backoff for failed smart contract transactions
 */

interface RetryJob {
  id: string;
  type: 'register_user' | 'transfer' | 'mint' | 'burn';
  payload: any;
  attempts: number;
  maxAttempts: number;
  nextRetry: Date;
  createdAt: Date;
  lastError?: string;
}

export class RetryQueue {
  private queue: Map<string, RetryJob> = new Map();
  private isProcessing: boolean = false;
  private processingInterval?: NodeJS.Timeout;

  constructor() {
    this.startProcessing();
  }

  /**
   * Add a job to the retry queue
   */
  addJob(type: RetryJob['type'], payload: any, maxAttempts: number = 3): string {
    const jobId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: RetryJob = {
      id: jobId,
      type,
      payload,
      attempts: 0,
      maxAttempts,
      nextRetry: new Date(Date.now() + 1000), // Retry in 1 second
      createdAt: new Date()
    };

    this.queue.set(jobId, job);
    console.log(`Added job to retry queue: ${jobId} (${type})`);
    
    return jobId;
  }

  /**
   * Remove a job from the queue
   */
  removeJob(jobId: string): boolean {
    const removed = this.queue.delete(jobId);
    if (removed) {
      console.log(`Removed job from retry queue: ${jobId}`);
    }
    return removed;
  }

  /**
   * Start processing the retry queue
   */
  private startProcessing(): void {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, 5000); // Check every 5 seconds

    console.log('Retry queue processing started');
  }

  /**
   * Stop processing the retry queue
   */
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
    this.isProcessing = false;
    console.log('Retry queue processing stopped');
  }

  /**
   * Process jobs in the queue
   */
  private async processQueue(): Promise<void> {
    const now = new Date();
    const readyJobs = Array.from(this.queue.values())
      .filter(job => job.nextRetry <= now)
      .sort((a, b) => a.nextRetry.getTime() - b.nextRetry.getTime());

    for (const job of readyJobs) {
      await this.processJob(job);
    }
  }

  /**
   * Process a single job
   */
  private async processJob(job: RetryJob): Promise<void> {
    try {
      console.log(`Processing retry job: ${job.id} (attempt ${job.attempts + 1}/${job.maxAttempts})`);
      
      job.attempts++;
      let success = false;

      // Execute the job based on its type
      switch (job.type) {
        case 'register_user':
          success = await this.retryRegisterUser(job.payload);
          break;
        case 'transfer':
          success = await this.retryTransfer(job.payload);
          break;
        case 'mint':
          success = await this.retryMint(job.payload);
          break;
        case 'burn':
          success = await this.retryBurn(job.payload);
          break;
        default:
          console.error(`Unknown job type: ${job.type}`);
          success = false;
      }

      if (success) {
        console.log(`Job completed successfully: ${job.id}`);
        this.removeJob(job.id);
      } else {
        // Job failed, check if we should retry
        if (job.attempts >= job.maxAttempts) {
          console.error(`Job permanently failed after ${job.attempts} attempts: ${job.id}`);
          this.logPermanentFailure(job);
          this.removeJob(job.id);
        } else {
          // Schedule next retry with exponential backoff
          const delayMs = Math.pow(2, job.attempts) * 1000; // 2^attempts seconds
          job.nextRetry = new Date(Date.now() + delayMs);
          this.queue.set(job.id, job);
          console.log(`Job rescheduled for retry: ${job.id} (next attempt in ${delayMs}ms)`);
        }
      }

    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      job.lastError = error instanceof Error ? error.message : String(error);
      
      // Update job in queue with error information
      this.queue.set(job.id, job);
    }
  }

  /**
   * Retry user registration on blockchain
   */
  private async retryRegisterUser(payload: { userId: number; walletAddress: string }): Promise<boolean> {
    try {
      const { blockchainService } = await import('./blockchain');
      const result = await blockchainService.registerUser(payload.userId, payload.walletAddress);
      return result !== null;
    } catch (error) {
      console.error('Failed to retry user registration:', error);
      return false;
    }
  }

  /**
   * Retry token transfer
   */
  private async retryTransfer(payload: { to: string; amount: string }): Promise<boolean> {
    try {
      const { blockchainService } = await import('./blockchain');
      const result = await blockchainService.transfer(payload.to, payload.amount);
      return result !== null;
    } catch (error) {
      console.error('Failed to retry transfer:', error);
      return false;
    }
  }

  /**
   * Retry token minting
   */
  private async retryMint(payload: { to: string; amount: string }): Promise<boolean> {
    try {
      const { blockchainService } = await import('./blockchain');
      const result = await blockchainService.mint(payload.to, payload.amount);
      return result !== null;
    } catch (error) {
      console.error('Failed to retry mint:', error);
      return false;
    }
  }

  /**
   * Retry token burning
   */
  private async retryBurn(payload: { from: string; amount: string }): Promise<boolean> {
    try {
      const { blockchainService } = await import('./blockchain');
      const result = await blockchainService.burn(payload.from, payload.amount);
      return result !== null;
    } catch (error) {
      console.error('Failed to retry burn:', error);
      return false;
    }
  }

  /**
   * Log permanent failure
   */
  private logPermanentFailure(job: RetryJob): void {
    const failureLog = {
      jobId: job.id,
      type: job.type,
      payload: job.payload,
      attempts: job.attempts,
      createdAt: job.createdAt,
      failedAt: new Date(),
      lastError: job.lastError
    };

    // In production, this should write to a persistent log file or database
    console.error('PERMANENT FAILURE:', JSON.stringify(failureLog, null, 2));
    
    // TODO: Send alert to monitoring system
    // TODO: Store in permanent failure log database table
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    totalJobs: number;
    readyJobs: number;
    pendingJobs: number;
    jobsByType: Record<string, number>;
  } {
    const jobs = Array.from(this.queue.values());
    const now = new Date();
    
    const stats = {
      totalJobs: jobs.length,
      readyJobs: jobs.filter(job => job.nextRetry <= now).length,
      pendingJobs: jobs.filter(job => job.nextRetry > now).length,
      jobsByType: {} as Record<string, number>
    };

    // Count jobs by type
    jobs.forEach(job => {
      stats.jobsByType[job.type] = (stats.jobsByType[job.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get all jobs (for debugging)
   */
  getAllJobs(): RetryJob[] {
    return Array.from(this.queue.values());
  }
}

// Export singleton instance
export const retryQueue = new RetryQueue();