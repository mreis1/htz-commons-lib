import { SqlBuilder } from "./sql-builder";

describe("sql-builder", () => {
  test('Multi builder', function() {
    let b = new SqlBuilder();
    b.and("CLI_ID = 1");
    b.or("CLI_NAME = \"FRANK\"");
    b.andGroup()
      .and('XX = 1')
      .or('BB = 2');
    b.orGroup()
      .and('CC = 3')
      .and('DD = 4');

    let result = b.toString({ where: true });
    // toString method returns always a space at the begining and the end of the string
    expect(
      result
    ).toBe(` WHERE  CLI_ID = 1 OR CLI_NAME = \"FRANK\" AND ( XX = 1 OR BB = 2) OR ( CC = 3 AND DD = 4) `);
  })

  test('Simple builder', function() {
    let b = new SqlBuilder();
    b.and("CLI_ID = 1");

    let result = b.toString({ where: true });
    // toString method returns always a space at the begining and the end of the string
    expect(
      result
    ).toBe(` WHERE  CLI_ID = 1 `);
  })
  test('Group builder only', function() {
    let b = new SqlBuilder();
    b.andGroup()
      .and("CLI_ID = 1")
      .or("CLI_ID = 2");

    let result = b.toString({ where: true });
    // toString method returns always a space at the begining and the end of the string
    expect(
      result
    ).toBe(` WHERE  ( CLI_ID = 1 OR CLI_ID = 2) `);
  })
});
