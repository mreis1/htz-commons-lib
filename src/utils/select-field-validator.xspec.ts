import { SelectFieldValidator } from './select-field-validator';

describe('SelectFieldValidator', () => {
     // describe('Simple List', () => {
     //      const listOptions = [
     //           {
     //                id: 1,
     //                label: "All",
     //                requires: [2,3,4]
     //           },
     //           {
     //                id: 2,
     //                label: "A",
     //           },
     //           {
     //                id: 3,
     //                label: "B",
     //           },
     //           {
     //                id: 4,
     //                label: "C"
     //           },
     //           {
     //                id: 5,
     //                label: "Other"
     //           }
     //      ]
     //      it('Should #1', () => {
     //           const selectFieldValidator = new SelectFieldValidator({
     //                newModelValue: [1,2,3,4],
     //                oldModelValue: [2,3,4],
     //                listOptions,
     //                property: null
     //           });
     //           const o = selectFieldValidator.get();
     //           expect(JSON.stringify(o)).toBe('[1,2,3,4]');
     //      })
     //      it('As long "All" is selected, all required properties must be selected too.', () => {
     //           const selectFieldValidator = new SelectFieldValidator({
     //                newModelValue: [1],
     //                oldModelValue: [2,3,4],
     //                listOptions,
     //                property: null
     //           });
     //           const o = selectFieldValidator.get();
     //           expect(JSON.stringify(o)).toBe('[1,2,3,4]');
     //      })
     //      it('Should check "all" since all properties are selected', () => {
     //           const selectFieldValidator = new SelectFieldValidator({
     //                newModelValue: [2,3,4],
     //                oldModelValue: [1,2,3,4],
     //                listOptions,
     //                property: null
     //           });
     //           const o = selectFieldValidator.get();
     //           expect(JSON.stringify(o)).toBe('[2,3,4]');// All item is automatically happened to the list
     //      })
     //      it('Should check "all" even if theres a non related item on list', () => {
     //           const selectFieldValidator = new SelectFieldValidator({
     //                newModelValue: [2,5,3,4],
     //                oldModelValue: [1,5,2,3,4,5],
     //                listOptions,
     //                property: null
     //           });
     //           const o = selectFieldValidator.get();
     //           expect(JSON.stringify(o)).toBe('[2,5,3,4,1]');// All item is automatically happened to the list
     //      })
     // })
     describe('Object mode', () => {
          const listOptions = [
               {
                    id: 1,
                    label: "Any - 2,3,4,5",
                    requires: [2,3,4,5]
               },
               {
                    id: 1,
                    label: "All - 2, 3, 4",
                    requires: [2,3,4]
               },
               {
                    id: 2,
                    label: "2",
               },
               {
                    id: 3,
                    label: "3",
               },
               {
                    id: 4,
                    label: "4"
               },
               {
                    id: 5,
                    label: "5"
               },
               {
                    id: 6,
                    label: "6"
               }
          ]
        /*  it('Should #1', () => {
               const selectFieldValidator = new SelectFieldValidator({
                    newModelValue: [{"id": 1},{"id": 2},{"id": 3},{"id": 4}],
                    oldModelValue: [{"id": 2},{"id": 3},{"id": 4}],
                    listOptions,
                    property: "id"
               });
               const o = selectFieldValidator.get();
               expect(JSON.stringify(o.map(i => i.id))).toBe('[1,2,3,4]');
          })
          it('As long "All" is selected, all required properties must be selected too.', () => {
               const selectFieldValidator = new SelectFieldValidator({
                    newModelValue: [{"id": 1}],
                    oldModelValue: [{"id": 2},{"id": 3},{"id": 4}],
                    listOptions,
                    property: "id"
               });
               const o = selectFieldValidator.get();
               expect(JSON.stringify(o.map(i => i.id))).toBe('[1,2,3,4]');
          })
          it('Should check "all" since all properties are selected', () => {
               const selectFieldValidator = new SelectFieldValidator({
                    newModelValue: [2,3,4],
                    oldModelValue: [1,2,3,4],
                    listOptions,
                    property: "id"
               });
               const o = selectFieldValidator.get();
               expect(JSON.stringify(o)).toBe('[2,3,4,1]');// All item is automatically happened to the list
          })
          it('Should check "all" even if theres a non related item on list', () => {
               const selectFieldValidator = new SelectFieldValidator({
                    newModelValue: [2,5,3,4],
                    oldModelValue: [1,5,2,3,4,5],
                    listOptions,
                    property: null
               });
               const o = selectFieldValidator.get();
               expect(JSON.stringify(o)).toBe('[2,5,3,4,1]');// All item is automatically happened to the list
          })
*/
          it('X1', () => {
               const selectFieldValidator = new SelectFieldValidator({
                    newModelValue: [1],
                    oldModelValue: [],
                    listOptions,
                    property: null
               });
               const o = selectFieldValidator.get();
               expect(JSON.stringify(o)).toBe('[1,2,3,4,5]');// All item is automatically happened to the list
          })
     })
})
