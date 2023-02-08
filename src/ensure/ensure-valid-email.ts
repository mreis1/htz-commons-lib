export interface EnsureValidEmailOpts {
  allowNull?: boolean;
  defaultValue?: any;
}
export function ensureValidEmail(email, opts?: EnsureValidEmailOpts) {
  opts = opts || ({} as any);
  if (email === null && opts.allowNull) {
    return null;
  }
  if (!email || !(typeof email === 'string')) {
    return opts.defaultValue;
  }
  const res = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(email);
  if (res) {
    return email;
  }
}
