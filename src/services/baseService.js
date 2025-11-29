// Base service class for MCP services

class BaseService {
  /**
   * Format date to YYYY-MM-DD HH:MM:SS
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string
   */
  formatDateTime(date) {
    const pad = (num) => String(num).padStart(2, '0');
    
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
  }

  /**
   * Get current timestamp (Unix time in seconds)
   * @returns {number} Current timestamp
   */
  getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get current time information
   * @returns {Object} Object containing timestamp and formatted time
   */
  getCurrentTimeInfo() {
    const now = new Date();
    const timestamp = this.getCurrentTimestamp();
    const formatted = this.formatDateTime(now);
    
    return {
      timestamp,
      formatted
    };
  }
}

module.exports = BaseService;