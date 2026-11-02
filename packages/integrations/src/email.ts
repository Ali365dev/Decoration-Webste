import { getEnv } from "@dec-walls/config";

export interface EmailProvider {
  send(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ id: string }>;
}

class NoopEmailProvider implements EmailProvider {
  async send(input: {
    to: string;
    subject: string;
  }): Promise<{ id: string }> {
    return { id: `email_${input.to}_${input.subject.slice(0, 12)}` };
  }
}

export function getEmailProvider(): EmailProvider {
  const provider = getEnv().EMAIL_PROVIDER;
  if (provider === "resend") {
    return new NoopEmailProvider();
  }
  return new NoopEmailProvider();
}
