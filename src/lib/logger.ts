type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    error?: Error;
    context?: Record<string, unknown>;
    timestamp: string;
    url?: string;
    userAgent?: string;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private isServer = typeof window === 'undefined';

    private createLogEntry(
        level: LogLevel,
        message: string,
        error?: Error,
        context?: Record<string, unknown>
    ): LogEntry {
        return {
            level,
            message,
            error,
            context,
            timestamp: new Date().toISOString(),
            url: this.isServer ? undefined : window.location.href,
            userAgent: this.isServer ? undefined : navigator.userAgent,
        };
    }

    private log(entry: LogEntry) {
        const { level, message, error, context, timestamp, url, userAgent } = entry;

        // In development, log to console
        if (this.isDevelopment) {
            const consoleMethod = level === 'debug' ? 'debug' :
                level === 'info' ? 'info' :
                    level === 'warn' ? 'warn' : 'error';

            console[consoleMethod](`[${timestamp}] ${level.toUpperCase()}: ${message}`, {
                error,
                context,
                url,
                userAgent,
            });
        }

        // In production, you could send to an error reporting service
        // For now, we'll just use console.error for errors
        if (!this.isDevelopment && level === 'error') {
            console.error(`[${timestamp}] ERROR: ${message}`, {
                error: error?.message,
                stack: error?.stack,
                context,
                url,
                userAgent,
            });
        }
    }

    debug(message: string, context?: Record<string, unknown>) {
        this.log(this.createLogEntry('debug', message, undefined, context));
    }

    info(message: string, context?: Record<string, unknown>) {
        this.log(this.createLogEntry('info', message, undefined, context));
    }

    warn(message: string, error?: Error, context?: Record<string, unknown>) {
        this.log(this.createLogEntry('warn', message, error, context));
    }

    error(message: string, error?: Error, context?: Record<string, unknown>) {
        this.log(this.createLogEntry('error', message, error, context));
    }

    // Utility method for logging API errors
    apiError(endpoint: string, error: Error, context?: Record<string, unknown>) {
        this.error(`API Error: ${endpoint}`, error, {
            endpoint,
            ...context,
        });
    }

    // Utility method for logging user actions
    userAction(action: string, context?: Record<string, unknown>) {
        this.info(`User Action: ${action}`, context);
    }

    // Utility method for performance monitoring
    performance(metric: string, value: number, context?: Record<string, unknown>) {
        this.info(`Performance: ${metric} = ${value}ms`, {
            metric,
            value,
            ...context,
        });
    }
}

export const logger = new Logger();