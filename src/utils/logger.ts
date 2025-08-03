/**
 * 生产环境安全的日志工具
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
    log: (...args: unknown[]) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    warn: (...args: unknown[]) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    error: (...args: unknown[]) => {
        // 错误信息在生产环境也保留，但可以发送到监控服务
        console.error(...args);
    },

    debug: (...args: unknown[]) => {
        if (isDevelopment) {
            console.debug(...args);
        }
    },

    info: (...args: unknown[]) => {
        if (isDevelopment) {
            console.info(...args);
        }
    }
};

// 简化的调试函数
export const debugLog = (message: string, data?: unknown) => {
    if (isDevelopment) {
        console.log(`🐛 ${message}`, data || '');
    }
};

export default logger;