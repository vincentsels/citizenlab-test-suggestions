export class Mail {
  constructor(init?: Partial<Mail>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  city: string;
  lang: string;

  allowPublic: boolean = true;
  allowReplies: boolean = true;
  stayUpToDate: boolean = true;

  to: string;
  subject: string;
  body: string;

  sentOn: Date;
}
