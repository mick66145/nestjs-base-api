import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  /**
   * 註冊一個具有重試機制的 Timeout 任務
   * @param name 任務名稱
   * @param delay 執行延遲 (ms)
   * @param maxRetries 最大重試次數
   * @param task 任務函式 (return Promise)
   */
  registerRetryableTimeout(
    name: string,
    delay: number,
    maxRetries: number,
    task: () => Promise<void>,
  ) {
    let retryCount = 0;

    const executeTask = async () => {
      // 清除舊的 timeout，避免 memory leak
      this.schedulerRegistry.deleteTimeout(name);

      try {
        this.logger.log(`執行任務 [${name}] (第 ${retryCount + 1} 次)`);
        await task();
        this.logger.log(`任務 [${name}] 完成`);
      } catch (error) {
        retryCount++;
        this.logger.error(
          `任務 [${name}] 失敗，失敗原因: ${(error as Error)?.message} (${retryCount}/${maxRetries})`,
          (error as Error).stack || error,
        );

        if (retryCount < maxRetries) {
          this.logger.warn(`重新排程任務 [${name}]...`);
          // 重新註冊 Timeout
          const retryDelay = delay; // 這裡你可以做 exponential backoff
          const retryTimeout = setTimeout(executeTask, retryDelay);
          this.schedulerRegistry.addTimeout(name, retryTimeout);
        } else {
          this.logger.error(`任務 [${name}] 已達最大重試次數，停止執行`);
        }
      }
    };

    const timeout = setTimeout(executeTask, delay);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
