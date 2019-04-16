import {ensureValidEmail} from "./ensure-valid-email";

describe('ensure-valid-email.spec.ts', function () {
    var input1 = '+35191340-777 8';
    var input2 = 'marcio@test.com';
    test('Non emails should be returned as void', function () {
        expect(ensureValidEmail(input1)).toBe(void 0);
    });
    test('Emails should be returned as they were provided', function () {
        expect(ensureValidEmail(input2)).toBe(input2);
    })
});
