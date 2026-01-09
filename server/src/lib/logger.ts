// server/src/socket/utils/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ENV } from './env';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

// Colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Custom format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info: winston.Logform.TransformableInfo) =>
      `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports to use based on environment
const transports = [];

// Console transport for all environments
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

// File transports for production
if (ENV.NODE_ENV === 'production') {
  // Error logs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    })
  );

  // All logs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    })
  );

  // Socket-specific logs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/socket-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '7d',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    })
  );
}

// Create the logger instance
export const logger = winston.createLogger({
  level: ENV.LOG_LEVEL,
  levels,
  format,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    }),
  ],
  exitOnError: false,
});

// Socket-specific logger with context
export class SocketLogger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string, metadata?: any): string {
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    return `[${this.context}] ${message}${metaStr}`;
  }

  info(message: string, metadata?: any): void {
    logger.info(this.formatMessage(message, metadata));
  }

  debug(message: string, metadata?: any): void {
    logger.debug(this.formatMessage(message, metadata));
  }

  warn(message: string, metadata?: any): void {
    logger.warn(this.formatMessage(message, metadata));
  }

  error(message: string, metadata?: any): void {
    logger.error(this.formatMessage(message, metadata));
  }

  http(message: string, metadata?: any): void {
    logger.http(this.formatMessage(message, metadata));
  }

  // Socket connection specific logs
  connection(socketId: string, userId?: string, metadata?: any): void {
    const userInfo = userId ? ` (user: ${userId})` : '';
    logger.info(
      `[${this.context}] Connection: ${socketId}${userInfo}`,
      metadata
    );
  }

  disconnect(
    socketId: string,
    userId?: string,
    reason?: string,
    metadata?: any
  ): void {
    const userInfo = userId ? ` (user: ${userId})` : '';
    const reasonInfo = reason ? ` - ${reason}` : '';
    logger.info(
      `[${this.context}] Disconnect: ${socketId}${userInfo}${reasonInfo}`,
      metadata
    );
  }

  event(socketId: string, event: string, data?: any, metadata?: any): void {
    const dataStr = data ? ` - ${JSON.stringify(data).substring(0, 200)}` : '';
    logger.debug(
      `[${this.context}] Event: ${event} from ${socketId}${dataStr}`,
      metadata
    );
  }

  session(
    sessionId: string,
    action: string,
    userId?: string,
    metadata?: any
  ): void {
    const userInfo = userId ? ` by ${userId}` : '';
    logger.info(
      `[${this.context}] Session ${action}: ${sessionId}${userInfo}`,
      metadata
    );
  }

  device(
    deviceId: string,
    action: string,
    userId?: string,
    metadata?: any
  ): void {
    const userInfo = userId ? ` for user ${userId}` : '';
    logger.info(
      `[${this.context}] Device ${action}: ${deviceId}${userInfo}`,
      metadata
    );
  }
}

// Create logger instances for different components
export const socketLogger = new SocketLogger('SocketIO');
export const sessionLogger = new SocketLogger('Session');
export const deviceLogger = new SocketLogger('Device');
export const playbackLogger = new SocketLogger('Playback');

// Utility function for structured logging
export const structuredLog = (
  level: keyof typeof levels,
  context: string,
  data: {
    message: string;
    socketId?: string;
    userId?: string;
    sessionId?: string;
    deviceId?: string;
    event?: string;
    error?: Error;
    metadata?: any;
  }
): void => {
  const {
    message,
    socketId,
    userId,
    sessionId,
    deviceId,
    event,
    error,
    metadata,
  } = data;

  const logData = {
    timestamp: new Date().toISOString(),
    context,
    message,
    socketId,
    userId,
    sessionId,
    deviceId,
    event,
    error: error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : undefined,
    ...metadata,
  };

  logger.log(level, JSON.stringify(logData));
};

// Stream for Morgan HTTP logger integration
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Export default logger for backward compatibility
export default logger;
