export function ensureValidEmail(email) {
    if (!email || !(typeof email === 'string')) {
    	return void 0;
    }
    const res = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(email);
    if (res){
        return email;
    }
}