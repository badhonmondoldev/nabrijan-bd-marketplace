import { prisma } from './db';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  link?: string;
  channels?: ('IN_APP' | 'EMAIL' | 'SMS' | 'PUSH')[];
  emailAddress?: string;
  phoneNumber?: string;
}

export interface NotificationAdapter {
  name: string;
  send(payload: NotificationPayload): Promise<boolean>;
}

export class InAppNotificationAdapter implements NotificationAdapter {
  name = 'InApp';
  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      await prisma.notification.create({
        data: {
          userId: payload.userId,
          title: payload.title,
          message: payload.message,
          type: payload.type || 'INFO',
          link: payload.link || null,
        },
      });
      return true;
    } catch (err) {
      console.error('InApp Notification failed:', err);
      return false;
    }
  }
}

export class EmailNotificationAdapter implements NotificationAdapter {
  name = 'Email';
  async send(payload: NotificationPayload): Promise<boolean> {
    // Adapter integration for SMTP / SendGrid / AWS SES
    console.log(`[Email Notification Sent to ${payload.emailAddress || payload.userId}]: ${payload.title} - ${payload.message}`);
    return true;
  }
}

export class SmsNotificationAdapter implements NotificationAdapter {
  name = 'Sms';
  async send(payload: NotificationPayload): Promise<boolean> {
    // Adapter integration for Bangladesh SMS Gateway (e.g., SSL Wireless / Teletalk / Greenweb)
    console.log(`[SMS Notification Sent to ${payload.phoneNumber || payload.userId}]: ${payload.message}`);
    return true;
  }
}

export class PushNotificationAdapter implements NotificationAdapter {
  name = 'Push';
  async send(payload: NotificationPayload): Promise<boolean> {
    // Adapter integration for WebPush / Firebase Cloud Messaging (FCM)
    console.log(`[Push Notification Sent to ${payload.userId}]: ${payload.title}`);
    return true;
  }
}

export class NotificationEngine {
  private adapters: NotificationAdapter[] = [
    new InAppNotificationAdapter(),
    new EmailNotificationAdapter(),
    new SmsNotificationAdapter(),
    new PushNotificationAdapter(),
  ];

  async notify(payload: NotificationPayload) {
    const channels = payload.channels || ['IN_APP'];
    const results = await Promise.allSettled(
      this.adapters
        .filter((adapter) => {
          if (channels.includes('IN_APP') && adapter.name === 'InApp') return true;
          if (channels.includes('EMAIL') && adapter.name === 'Email') return true;
          if (channels.includes('SMS') && adapter.name === 'Sms') return true;
          if (channels.includes('PUSH') && adapter.name === 'Push') return true;
          return false;
        })
        .map((adapter) => adapter.send(payload))
    );
    return results;
  }
}

export const notificationEngine = new NotificationEngine();

export async function notifyUser(payload: NotificationPayload) {
  return await notificationEngine.notify(payload);
}
