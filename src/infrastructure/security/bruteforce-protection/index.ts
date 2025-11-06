interface BruteForceRecord {
    attempts: number;
    lastAttempt: Date;
    lockUntil?: Date;
  }
  
  /**
   * BruteForceProtection
   * 
   * This class tracks login attempts and locks out further attempts
   * if the maximum allowed attempts are exceeded within a defined window.
   */
  export class BruteForceProtection {
    private records: Map<string, BruteForceRecord> = new Map();
    // Maximum allowed attempts before a lock is applied.
    private readonly maxAttempts: number;
    // Duration (in milliseconds) for which the user is locked out.
    private readonly lockoutTime: number;
    // Time window (in milliseconds) within which attempts are counted.
    private readonly windowTime: number;
  
    /**
     * @param maxAttempts - maximum allowed login attempts (default: 5)
     * @param lockoutTime - lockout duration in milliseconds (default: 15 minutes)
     * @param windowTime - time window for counting attempts in milliseconds (default: 15 minutes)
     */
    constructor(maxAttempts = 5, lockoutTime = 15 * 60 * 1000, windowTime = 15 * 60 * 1000) {
      this.maxAttempts = maxAttempts;
      this.lockoutTime = lockoutTime;
      this.windowTime = windowTime;
    }
  
    /**
     * Registers a login attempt for a given identifier.
     * Returns true if login attempts are still allowed, false if the identifier is locked.
     *
     * @param uniqueId - a unique identifier (e.g., username or IP address)
     */

    /**
     * 
     * @IMPORTANT : Needs to change this to redis in production
     *  
     */
    public async registerAttempt(uniqueId: string): Promise<boolean> {
      const now = new Date();
  
      // Check if already locked
      if (this.isLocked(uniqueId)) {
        return false;
      }
  
      let record = this.records.get(uniqueId);
      if (!record) {
        record = { attempts: 1, lastAttempt: now };
        this.records.set(uniqueId, record);
      } else {
        // If within the same window, increment; otherwise, reset.
        if (now.getTime() - record.lastAttempt.getTime() <= this.windowTime) {
          record.attempts += 1;
        } else {
          record.attempts = 1;
        }
        record.lastAttempt = now;
      }
  
      // Lock the identifier if max attempts are exceeded.
      if (record.attempts > this.maxAttempts) {
        record.lockUntil = new Date(now.getTime() + this.lockoutTime);
      }
  
      return !this.isLocked(uniqueId);
    }
  
    /**
     * Checks whether the given unique identifier is currently locked.
     *
     * @param uniqueId - a unique identifier (e.g., username or IP address)
     */
    public isLocked(uniqueId: string): boolean {
      const record = this.records.get(uniqueId);
      if (!record) return false;
  
      if (record.lockUntil && new Date() < record.lockUntil) {
        return true;
      } else if (record.lockUntil && new Date() >= record.lockUntil) {
        // Reset the record once the lock has expired.
        this.records.delete(uniqueId);
        return false;
      }
  
      return false;
    }
  
    /**
     * Resets the attempts for the given unique identifier.
     * Call this after a successful authentication.
     *
     * @param uniqueId - a unique identifier (e.g., username or IP address)
     */
    public resetAttempts(uniqueId: string): void {
      this.records.delete(uniqueId);
    }
  }
  